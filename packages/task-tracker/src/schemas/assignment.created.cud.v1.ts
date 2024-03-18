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
						type: {
							type: 'string',
							logicalType: 'uuid'
						}
					},
					{
						name: 'taskId',
						type: {
							type: 'string',
							logicalType: 'uuid'
						}
					},
					{
						name: 'assigneeId',
						type: {
							type: 'string',
							logicalType: 'uuid'
						}
					},
					{
						name: 'status',
						type: {
							type: 'enum',
							name: 'status',
							symbols: ['TODO']
						}
					}
				]
			}
		}
	]
};

export const assignmentCreatedCUDType = Type.forSchema(assignmentCreatedSchema);
