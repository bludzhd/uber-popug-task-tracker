import { Type, Schema } from 'avsc';

const assignmentCompletedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Completed.CUD.v1',
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
					name: 'taskId',
					type: 'uuid',
					description: 'Task public id'
				},
				{
					name: 'assigneeId',
					type: 'uuid',
					description: 'User public id'
				},
				{
					name: 'status',
					type: {
						type: 'enum',
						name: 'Status',
						symbols: ['COMPLETED']
					}
				}
			]
		}
	]
};

export const assignmentCompletedCUDType = Type.forSchema(assignmentCompletedSchema);
