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
				}
			]
		}
	]
};

export const assignmentFailedBEType = Type.forSchema(assignmentFailedSchema);
