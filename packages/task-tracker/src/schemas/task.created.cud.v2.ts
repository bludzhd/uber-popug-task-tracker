import { Type, Schema } from 'avsc';

const taskCreatedSchema: Schema = {
	type: 'record',
	name: 'Task.Created.CUD.v2',
	description: 'Task model extended with customId',
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

export const taskCreatedCUDType = Type.forSchema(taskCreatedSchema);
