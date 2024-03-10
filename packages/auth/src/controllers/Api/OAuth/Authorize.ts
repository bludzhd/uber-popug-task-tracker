import * as jwt from 'jsonwebtoken';

class Authorize {
	static async perform (req, res): Promise<any> {
		req.assert('clientId', 'Client ID cannot be blank').notEmpty();
		req.assert('clientSecret', 'Client ID cannot be blank').notEmpty();

		const errors = req.validationErrors();
		if (errors) {
			return res.json({
				errors
			});
		}

		const { clientId, clientSecret } = req.body;

		let client;

		// todo pass encrypted secret + decrypt
		// more apps coming
		if (clientId !== res.locals.app.taskTrackerClientId
			|| clientSecret !== res.locals.app.taskTrackerClientSecret
		) {
			return res
				.json({
					errors: [{
						error: 'access_denied',
						error_description: 'Client not found'
					}]
				});
		}

		client = { clientId, metadata: 'client_metadata' };

		const token = jwt.sign(client, res.locals.app.appSecret);

		return res.json({
			clientId,
			token
		});
	}
}

export default Authorize;
