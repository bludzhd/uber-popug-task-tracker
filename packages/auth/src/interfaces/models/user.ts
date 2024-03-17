/**
 * Define interface for User Model
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

export interface Tokens {
	kind: string;
	accessToken: string;
	tokenSecret?: string;
}

export enum Role {
	ADMIN = 'ADMIN',
	MANAGER = 'MANAGER',
	EMPLOYEE = 'EMPLOYEE'
}

export interface IUser {
	publicId: string;
	email: string;
	password: string;
	passwordResetToken: string;
	passwordResetExpires: Date;
	role: Role;

	tokens: Tokens[];

	fullname: string;
}

export default IUser;
