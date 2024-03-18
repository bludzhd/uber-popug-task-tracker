import { Type, Schema } from 'avsc';

const taskCompletedSchema: Schema = {
	type: 'record',
	name: 'Task.Completed.CUD.v1',
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
					}
				]
			}
		}
	]
};

export const taskCompletedCUDType = Type.forSchema(taskCompletedSchema);
