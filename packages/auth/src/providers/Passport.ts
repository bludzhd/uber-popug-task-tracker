/**
 * Defines the passport config
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import { Application } from 'express';
import * as passport from 'passport';

import LocalStrategy from '../services/strategies/Local';

import User from '../models/User';
import Log from '../middlewares/Log';
import IUser from '../interfaces/models/user';

class Passport {
	public mountPackage (_express: Application): Application {
		_express = _express.use(passport.initialize());
		_express = _express.use(passport.session());

		passport.serializeUser<any>((user: IUser, done) => {
			console.log('PASSPORT USER ID', user.id);
			done(null, user.id);
		});

		passport.deserializeUser<any, any>(async (id, done) => {
			let user;
			try {
				user = await User.findById(id);
			} catch (err) {
				done(err, null);
			}
			done(null, user);
		});

		this.mountLocalStrategies();

		return _express;
	}

	public mountLocalStrategies(): void {
		try {
			LocalStrategy.init(passport);
		} catch (_err) {
			Log.error(_err.stack);
		}
	}

	public isAuthenticated (req, res, next): any {
		if (req.isAuthenticated()) {
			return next();
		}

		req.flash('errors', { msg: 'Please Log-In to access any further!'});
		return res.redirect('/login');
	}

	public isAuthorized (req, res, next): any {
		const provider = req.path.split('/').slice(-1)[0];
		const token = req.user.tokens.find(token => token.kind === provider);
		if (token) {
			return next();
		} else {
			return res.redirect(`/auth/${provider}`);
		}
	}
}

export default new Passport;
