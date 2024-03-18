import { IAssignment, Status } from '../interfaces/models/assignment';
import mongoose from '../providers/Database';

export interface IAssignmentModel extends IAssignment, mongoose.Document {}

export const AssignmentSchema = new mongoose.Schema<IAssignmentModel>({
	publicId: { type: String, unique: true },
	status: { type: String, enum: Status, default: Status.TODO },
	taskId:  { type: String },
	assigneeId: { type: String }
}, {
	timestamps: true
});

const Assignment = mongoose.model<IAssignmentModel>('Assignment', AssignmentSchema);

export default Assignment;
