import { Type, Schema } from 'avsc';

const assignmentCreatedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Created.CUD.v1',
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
						symbols: ['TODO']
					}
				}
			]
		}
	]
};

export const assignmentCreatedCUDType = Type.forSchema(assignmentCreatedSchema);
