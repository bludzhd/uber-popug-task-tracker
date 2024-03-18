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
			type: 'string',
			description: 'todo why do we need producer name? todo const'
		},
		{
			name: 'data',
			type: {
				type: 'record',
				name: 'user',
				fields: [
					{
						name: 'publicId',
						type: {
							type: 'string',
							logicalType: 'uuid'
						}
					},
					{
						name: 'email',
						type: 'string'
					},
					{
						name: 'role',
						type: {
							type: 'enum',
							name: 'userRole',
							symbols: ['ADMIN', 'MANAGER', 'EMPLOYEE']
						}
					}
				]
			}
		}
	]
};

export const userRegisteredType = Type.forSchema(userRegisteredSchema);
