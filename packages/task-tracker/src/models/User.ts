import { IUser, Role } from '../interfaces/models/user';
import mongoose from '../providers/Database';

// Create the model schema & register your custom methods here
export interface IUserModel extends IUser, mongoose.Document {}

// Define the User Schema
export const UserSchema = new mongoose.Schema<IUserModel>({
	publicId: { type: String, unique: true },
	email: { type: String, unique: true },
	role: { type: String, enum: Role, default: Role.EMPLOYEE }
}, {
	timestamps: true
});

const User = mongoose.model<IUserModel>('User', UserSchema);

export default User;
