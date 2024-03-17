import { Type, Schema } from 'avsc';

const assignmentCompletedSchema: Schema = {
	type: 'record',
	name: 'Assignment.Completed.v1',
	fields: [
		{
			name: 'eventId',
			type: 'string'
		},
		{
			name: 'eventVersion',
			type: 'number'
		},
		{
			name: 'eventTime',
			type: 'string'// iso date??
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

export const assignmentCompletedType = Type.forSchema(assignmentCompletedSchema);
