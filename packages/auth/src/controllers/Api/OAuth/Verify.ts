import * as jwt from 'jsonwebtoken';

class Verify {
	static async perform (req, res): Promise<any> {
		req.checkHeaders('authorization', 'Authorization header is required').notEmpty();

		const errors = req.validationErrors();
		if (errors) {
			return res.json({
				errors
			});
		}

		const { authorization: token } = req.headers;

		try {
			const decoded = await jwt.verify(token, res.locals.app.appSecret);
			res.json(decoded);
		} catch (e) {
			res.json({
				errors: [{ error: 'Verification failed' }]
			});
		}
	}
}

export default Verify;
