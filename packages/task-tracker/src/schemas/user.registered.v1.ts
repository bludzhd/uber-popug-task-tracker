import { Type, Schema } from 'avsc';

const userRegisteredSchema: Schema = {
	type: 'record',
	name: 'User.Registered.CUD.v1',
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
			type: 'string',
			description: 'todo why do we need producer name? todo const'
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
