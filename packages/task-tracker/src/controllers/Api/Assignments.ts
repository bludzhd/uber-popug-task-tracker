import { Promise } from 'bluebird';
import { v4 as uuid } from 'uuid';
import Assignment from '../../models/Assignment';
import Task from '../../models/Task';
import User from '../../models/User';
import { Status as AssignmentStatus } from '../../interfaces/models/assignment';
import { Status as TaskStatus } from '../../interfaces/models/task';
import { Role } from '../../interfaces/models/user';
import { assignmentCompletedCUDType } from '../../schemas/assignment.completed.cud.v1';
import { assignmentCompletedBEType } from '../../schemas/assignment.completed.be.v1';
import { assignmentCreatedCUDType } from '../../schemas/assignment.created.cud.v1';
import { assignmentCreatedBEType } from '../../schemas/assignment.created.be.v1';
import { assignmentFailedBEType } from '../../schemas/assignment.failed.be.v1';
import { taskCompletedCUDType } from '../../schemas/task.completed.cud.v2';
import { name as producerName } from '../../providers/Producer';
import mongoose from '../../providers/Database';

const TOPIC_ASSIGNMENT = 'assignment';
const TOPIC_ASSIGNMENT_STREAMING = 'assignment-streaming';
const TOPIC_TASK_STREAMING = 'task-streaming';

const EVENT_CUD_TASK_COMPLETED = 'task-completed';
const EVENT_CUD_ASSIGNMENT_COMPLETED = 'assignment-completed';
const EVENT_CUD_ASSIGMENT_CREATED = 'assignment-created';

const EVENT_BE_ASSIGNMENT_CREATED = 'assignment-created';
const EVENT_BE_ASSIGNMENT_FAILED = 'assignment-failed';
const EVENT_BE_ASSIGNMENT_COMPLETED = 'assignment-created';

const V1 = 'v1';
const V2 = 'v2';

const eventMetadata = {
	eventId: uuid(),
	eventTime: (new Date()).toISOString(),
	producer: producerName
};
const produceEvent = async (producer, topic, eventName, eventVersion, data, type, callback) => {
	const event = {
		...eventMetadata,
		eventVersion,
		eventName,
		data
	};
	const messageBuffer = type.toBuffer(event);
	const payload = [{
		topic,
		messages: messageBuffer,
		attributes: 1
	}];

	producer.send(payload, callback);
};
const handleProduceResult = (res) => (error, result) => {
	if (error) {
		console.error('Sending payload failed:', error);
		res.status(500).json(error);
	} else {
		console.log('Sending payload result:', result);
	}
};

class Assignments {
	static async list(req, res): Promise<any> {
		const assignments = await Assignment.find({
			assigneeId: req.user.id,
			status: AssignmentStatus.TODO
		});
		return res.json(assignments);
	}

	static async complete(req, res): Promise<any> {
		const { assignmentId: publicId } = req.params;
		let assignment;
		let task;
		try {
			const session = await mongoose.startSession();
			await session.startTransaction();
			assignment = await Assignment.findOneAndUpdate(
				{ publicId },
				{ status: AssignmentStatus.COMPLETED },
				{ new: true }
			);
			task = await Task.findByIdAndUpdate(
				assignment.taskId,
				{ status: TaskStatus.COMPLETED },
				{ new: true }
			);
			await session.commitTransaction();
			await session.endSession();
		} catch (error) {
			res.status(500).json(error);
		}

		const producer = await req.getProducer();

		await produceEvent(
			producer,
			TOPIC_ASSIGNMENT_STREAMING,
			EVENT_CUD_ASSIGNMENT_COMPLETED,
			V1,
			assignment,
			assignmentCompletedCUDType,
			handleProduceResult(res)
		);
		await produceEvent(
			producer,
			TOPIC_TASK_STREAMING,
			EVENT_CUD_TASK_COMPLETED,
			V2,
			task,
			taskCompletedCUDType,
			handleProduceResult(res)
		);
		await produceEvent(
			producer,
			TOPIC_ASSIGNMENT,
			EVENT_BE_ASSIGNMENT_COMPLETED,
			V1,
			{ publicId },
			assignmentCompletedBEType,
			handleProduceResult(res)
		);

		return res.json(assignment);
	}

	static async reassign(req, res, next): Promise<any> {
		try {
			const session = await mongoose.startSession();
			await session.startTransaction();
			const tasks = await Task.find({ status: TaskStatus.OPEN }).lean();
			const users = await User.find({ role: Role.EMPLOYEE }).lean();
			const userIds = users.map((user) => user.id);
			const reassignments = await Promise.reduce(tasks, async (acc, task) => {
				const assigmentFailed = await Assignment.findOneAndUpdate(
					{ taskId: task.publicId, status: AssignmentStatus.TODO },
					{ status: AssignmentStatus.FAILED },
					{ new: true }
				);
				acc.assignmentsFailed = [...acc.assignmentsFailed, assigmentFailed];
				const userIdIdx = Math.floor(Math.random() * userIds.length);
				const newAssignment = new Assignment({
					publicId: uuid(),
					taskId: task.id,
					assigneeId: userIds[userIdIdx]
				});
				await newAssignment.save();
				acc.assignmentsCreated = [...acc.assignmentsCreated, newAssignment];
				return acc;
			}, Object.create({ assignmentsFailed: [], assignmentsCreated: [] }));
			await session.commitTransaction();
			await session.endSession();
			const producer = await req.getProducer();
			await Promise.all([
				// only streaming events for assignment failed: they don't trigger any business events
				...reassignments.assignmentsFailed.map(async (assignment) => {
					return produceEvent(
						producer,
						TOPIC_ASSIGNMENT_STREAMING,
						EVENT_BE_ASSIGNMENT_FAILED,
						V1,
						assignment,
						assignmentFailedBEType,
						handleProduceResult(res)
					);
				}),
				...reassignments.assignmentsCreated.map(async (assignment) => {
					return produceEvent(
						producer,
						TOPIC_ASSIGNMENT_STREAMING,
						EVENT_CUD_ASSIGMENT_CREATED,
						V1,
						assignment,
						assignmentCreatedCUDType,
						handleProduceResult(res)
					);
				}),
				// business events for assignment created as they should trigger billing transaction creation
				...reassignments.assignmentsCreated.map(async ({ publicId }) => {
					return produceEvent(
						producer,
						TOPIC_ASSIGNMENT,
						EVENT_BE_ASSIGNMENT_CREATED,
						V1,
						{ publicId },
						assignmentCreatedBEType,
						handleProduceResult(res)
					);
				})
			]);
		} catch (error) {
			res.status(500).json(error);
		}
	}
}

export default Assignments;
