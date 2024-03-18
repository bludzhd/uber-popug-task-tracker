import { Type, Schema } from 'avsc';

const assignmentCompletedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Completed.BE.v1',
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

export const assignmentCompletedBEType = Type.forSchema(assignmentCompletedSchema);
