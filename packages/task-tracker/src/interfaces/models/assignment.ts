export enum Status {
	TODO = 'TODO',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED'
}

export interface IAssignment {
	publicId: string;
	taskId: string;
	userId: string;
	status: Status;
}

export default IAssignment;
