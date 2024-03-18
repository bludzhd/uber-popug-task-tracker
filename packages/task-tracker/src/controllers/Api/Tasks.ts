import { v4 as uuid } from 'uuid';
import User from '../../models/User';
import Task from '../../models/Task';
import Assignment from '../../models/Assignment';
import mongoose from '../../providers/Database';
import { assignmentCreatedCUDType } from '../../schemas/assignment.created.cud.v1';
import { assignmentCreatedBEType } from '../../schemas/assignment.created.be.v1';
import { taskCreatedCUDType } from '../../schemas/task.created.cud.v2';
import { name as producerName } from '../../providers/Producer';

const TOPIC_ASSIGNMENT = 'assignment';
const TOPIC_ASSIGNMENT_STREAMING = 'assignment-streaming';
const TOPIC_TASK_STREAMING = 'task-streaming';

const EVENT_CUD_TASK_CREATED = 'task-created';
const EVENT_CUD_ASSIGMENT_CREATED = 'assignment-created';
const EVENT_BE_ASSIGNMENT_CREATED = 'assignment-created';

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

class Tasks {
	static async create(req, res): any {
		const { customId, title } = req.params;
		const assignee = User.aggregate([
			{ $match: { a: 10 } },
			{ $sample: { size: 1 } }
		])[0];
		const task = new Task({
			publicId: uuid(),
			customId,
			title,
			amount: 20,
			fee: 40
		});
		const assignment = new Assignment({
			publicId: uuid(),
			taskId: task.publicId,
			assigneeId: assignee.id
		});

		const session = await mongoose.startSession();
		await session.startTransaction();
		await task.save();
		await assignment.save();
		await session.commitTransaction();
		await session.endSession();

		const producer = await req.getProducer();
		await produceEvent(
			producer,
			TOPIC_TASK_STREAMING,
			EVENT_CUD_TASK_CREATED,
			V2,
			task,
			taskCreatedCUDType,
			handleProduceResult(res)
		);
		await produceEvent(
			producer,
			TOPIC_ASSIGNMENT_STREAMING,
			EVENT_CUD_ASSIGMENT_CREATED,
			V1,
			assignment,
			assignmentCreatedCUDType,
			handleProduceResult(res)
		);
		await produceEvent(
			producer,
			TOPIC_ASSIGNMENT,
			EVENT_BE_ASSIGNMENT_CREATED,
			V1,
			{ publicId: assignment.publicId },
			assignmentCreatedBEType,
			handleProduceResult(res)
		);

		return res.status(501).json({
			status: 'not implemented'
		});
	}
}

export default Tasks;
