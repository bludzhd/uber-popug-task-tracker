import { Type, Schema } from 'avsc';

const taskCompletedSchema: Schema = {
	type: 'record',
	name: 'Task.Completed.CUD.v2',
	description: 'Task model extended with custom id',
	fields: [
		{
			name: 'eventId',
			type: 'string'
		},
		{
			name: 'eventVersion',
			type: {
				type: 'enum',
				name: 'eventVersion',
				symbols: ['v2']
			}
		},
		{
			name: 'eventTime',
			type: 'string'
		},
		{
			name: 'producer',
			type: 'string'
		},
		{
			name: 'data',
			type: {
				type: 'record',
				name: 'task',
				fields: [
					{
						name: 'publicId',
						type: {
							type: 'string',
							logicalType: 'uuid'
						}
					},
					{
						name: 'title',
						type: 'string'
					},
					{
						name: 'customId',
						type: 'string'
					},
					{
						name: 'amount',
						type: 'int'
					},
					{
						name: 'fee',
						type: 'int'
					},
					{
						name: 'status',
						type: {
							type: 'enum',
							name: 'taskStatus',
							symbols: ['OPEN']
						}
					}
				]
			}
		}
	]
};

export const taskCompletedCUDType = Type.forSchema(taskCompletedSchema);
