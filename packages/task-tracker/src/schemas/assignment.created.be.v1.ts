import { Type, Schema } from 'avsc';

const assignmentCreatedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Created.BE.v1',
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

export const assignmentCreatedBEType = Type.forSchema(assignmentCreatedSchema);
