import { Type, Schema } from 'avsc';

const userRegisteredSchema: Schema = {
	type: 'record',
	name: 'User.Registered.v1',
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
			type: 'string',
			description: 'todo why do we need producer name? todo const'
		},
		{
			name: 'data',
			type: 'record',
			fields: [
				{
					name: 'publicId',
					type: 'string'
				},
				{
					name: 'email',
					type: 'string'
				},
				{
					name: 'role',
					type: {
						type: 'enum',
						name: 'Role',
						symbols: ['ADMIN', 'MANAGER', 'EMPLOYEE']
					}
				}
			]
		}
	]
};

export const userRegisteredType = Type.forSchema(userRegisteredSchema);
