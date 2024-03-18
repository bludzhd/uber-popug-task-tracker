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
				name: 'assignment',
				fields: [
					{
						name: 'publicId',
						type: 'string',
						logicalType: 'uuid'
					},
					{
						name: 'taskId',
						type: 'string',
						logicalType: 'uuid',
						description: 'Task public id'
					},
					{
						name: 'assigneeId',
						type: 'string',
						logicalType: 'uuid',
						description: 'User public id'
					},
					{
						name: 'status',
						type: {
							type: 'enum',
							name: 'assignmentStatus',
							symbols: ['COMPLETED']
						}
					}
				]
			}
		}
	]
};

export const assignmentCompletedCUDType = Type.forSchema(assignmentCompletedSchema);
