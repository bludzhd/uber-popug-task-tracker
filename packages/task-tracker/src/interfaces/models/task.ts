export enum Status {
	OPEN = 'OPEN',
	COMPLETED = 'COMPLETED'
}

export interface ITask {
	publicId: string;
	title: string;
	status: Status;
}

export default ITask;
