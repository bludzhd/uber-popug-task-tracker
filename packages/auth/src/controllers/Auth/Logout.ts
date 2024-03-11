import { IRequest, IResponse } from '../../interfaces/vendors';

class Logout {
	public static perform (req: IRequest, res: IResponse, next): any {
		req.logout(function(err) {
			if (err) { return next(err); }
			res.redirect('/');
		});
		req.session.destroy((err) => {
			if (err) {
				console.log('Error : Failed to destroy the session during logout.', err);
			}

			req.user = null;
			return res.redirect('/');
		});
	}
}

export default Logout;
