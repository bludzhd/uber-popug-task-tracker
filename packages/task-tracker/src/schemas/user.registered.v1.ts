import { Type, Schema } from 'avsc';

const userRegisteredSchema: Schema = {
	type: 'record',
	name: 'User.Registered.v1',
	fields: [
		{
			name: 'id',
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
};

export const userRegisteredType = Type.forSchema(userRegisteredSchema);
