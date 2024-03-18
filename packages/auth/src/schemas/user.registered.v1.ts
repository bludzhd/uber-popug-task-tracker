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
			type: 'string',
			description: 'todo why do we need producer name? todo const'
		},
		{
			name: 'data',
			type: {
				name: 'user',
				type: 'record',
				fields: [
					{
						name: 'publicId',
						type: 'string',
						logicalType: 'uuid'
					},
					{
						name: 'email',
						type: 'string'
					},
					{
						name: 'role',
						type: {
							type: 'enum',
							name: 'role',
							symbols: ['ADMIN', 'MANAGER', 'EMPLOYEE']
						}
					}
				]
			}
		}
	]
};

export const userRegisteredType = Type.forSchema(userRegisteredSchema);
