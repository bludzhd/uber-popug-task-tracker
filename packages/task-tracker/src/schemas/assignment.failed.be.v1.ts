import { Type, Schema } from 'avsc';

const assignmentFailedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Failed.BE.v1',
	fields: [
		{
			name: 'eventId',
			type: 'string'
		},
		{
			name: 'eventVersion',
			type: {
				type: 'enum',
				symbols: ['v1'],
				name: 'eventVersion'
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
				name: 'assignment',
				type: 'record',
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

export const assignmentFailedBEType = Type.forSchema(assignmentFailedSchema);
