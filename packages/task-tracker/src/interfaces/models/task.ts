export enum Status {
	OPEN = 'OPEN',
	COMPLETED = 'COMPLETED'
}

export interface ITask {
	publicId: string;
	customId: string;
	title: string;
	status: Status;
	amount: number;
	fee: number;
}

export default ITask;
