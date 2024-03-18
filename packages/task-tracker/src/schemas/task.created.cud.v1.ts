import { Type, Schema } from 'avsc';

const taskCreatedSchema: Schema = {
	type: 'record',
	name: 'Task.Created.CUD.v1',
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
				symbols: ['v1']
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
	]
};

export const taskCreatedCUDType = Type.forSchema(taskCreatedSchema);
