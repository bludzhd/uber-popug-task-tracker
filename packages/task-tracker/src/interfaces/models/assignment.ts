export enum Status {
	TODO = 'TODO',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED'
}

export interface IAssignment {
	publicId: string;
	taskId: string;
	assigneeId: string;
	status: Status;
}

export default IAssignment;
