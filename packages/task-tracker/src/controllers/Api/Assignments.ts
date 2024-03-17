import { Promise } from 'bluebird';
import { v4 as uuid } from 'uuid';
import Assignment from '../../models/Assignment';
import Task from '../../models/Task';
import User from '../../models/User';
import { Status as AssignmentStatus } from '../../interfaces/models/assignment';
import { Status as TaskStatus } from '../../interfaces/models/task';
import { Role } from '../../interfaces/models/user';
import { assignmentCompletedType } from '../../schemas/assignment.completed.v1';
import { name as producerName } from '../../providers/Producer';
import mongoose from '../../providers/Database';

const ASSIGNMENT_COMPLETED = 'assignment-completed';

const eventMetadata = {
	eventId: uuid(),
	eventVersion: 1,
	eventTime: (new Date()).toISOString(),
	producer: producerName
};
const produceAssignmentBeEvent = async (producer, data, callback) => {
	const event = {
		...eventMetadata,
		eventName: ASSIGNMENT_COMPLETED,
		data
	};
	const messageBuffer = assignmentCompletedType.toBuffer(event);
	const payload = [{
		topic: 'assignment',
		messages: messageBuffer,
		attributes: 1
	}];

	producer.send(payload, callback);
};
const produceAssignmentStreamingEvent = async (producer, data, callback) => {
	const event = {
		...eventMetadata,
		eventName: ASSIGNMENT_COMPLETED,
		data
	};
	const messageBuffer = assignmentCompletedType.toBuffer(event);
	const payload = [{
		topic: 'assignment-stream',
		messages: messageBuffer,
		attributes: 1
	}];

	producer.send(payload, callback);
};
const produceTaskStreamingEvent = async (producer, data, callback) => {
	const event = {
		...eventMetadata,
		eventName: ASSIGNMENT_COMPLETED,
		data
	};
	const messageBuffer = assignmentCompletedType.toBuffer(event);
	const payload = [{
		topic: 'task-stream',
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
	static async list(req, res, next): Promise<any> {
		const assignments = await Assignment.find({
			userId: req.user.id,
			status: AssignmentStatus.TODO
		});
		return res.json(assignments);
	}

	static async complete(req, res, next): Promise<any> {
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

		// for consumer to save the data about the assignment
		await produceAssignmentStreamingEvent(producer, assignment, handleProduceResult(res));
		// for consumer to save the data about the task
		await produceTaskStreamingEvent(producer, task, handleProduceResult(res));
		// for consumer to trigger some action
		await produceAssignmentBeEvent(producer, { publicId }, handleProduceResult(res));
		return res.json(assignment);
	}

	static async reassign(req, res, next): Promise<any> {
		try {
			const session = await mongoose.startSession();
			await session.startTransaction();
			const tasks = await Task.find({ status: TaskStatus.OPEN });
			const users = await User.find({ role: Role.EMPLOYEE });
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
					userId: userIds[userIdIdx]
				});
				await newAssignment.save();
				acc.assignmentsCreated = [...acc.assignmentsCreated, newAssignment];
			}, Object.create({ assignmentsFailed: [], assignmentsCreated: [] }));
			await session.commitTransaction();
			await session.endSession();
		} catch (error) {
			res.status(500).json(error);
		}

		const producer = await req.getProducer();
		// reassignments: produce cud event and business event for each assignemtn failed and assignment created
	}
}

export default Assignments;
