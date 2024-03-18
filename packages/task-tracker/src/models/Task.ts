import { ITask, Status } from '../interfaces/models/task';
import mongoose from '../providers/Database';

export interface ITaskModel extends ITask, mongoose.Document {}

export const TaskSchema = new mongoose.Schema<ITaskModel>({
	publicId: { type: String, unique: true },
	customId: { type: String, unique: true },
	title: { type: String },
	status: { type: String, enum: Status, default: Status.OPEN },
	amount: { type: Number },
	fee: { type: Number }
}, {
	timestamps: true
});

const Task = mongoose.model<ITaskModel>('Task', TaskSchema);

export default Task;
