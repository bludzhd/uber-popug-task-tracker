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
				name: 'EventVersion',
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
			type: 'record',
			fields: [
				{
					name: 'publicId',
					type: 'uuid'
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
					type: 'number'
				},
				{
					name: 'fee',
					type: 'number'
				},
				{
					name: 'status',
					type: {
						type: 'enum',
						name: 'Status',
						symbols: ['OPEN']
					}
				}
			]
		}
	]
};

export const taskCompletedCUDType = Type.forSchema(taskCompletedSchema);
