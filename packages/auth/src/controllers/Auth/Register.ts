import User from '../../models/User';
import { IRequest, IResponse, INext } from '../../interfaces/vendors';
import { userRegisteredType } from '../../schemas/user.registered.v1';

class Register {
	public static show (req: IRequest, res: IResponse): any {
		return res.render('pages/signup', {
			title: 'SignUp'
		});
	}

	static async perform (req: IRequest, res: IResponse, next: INext): any {
		req.assert('email', 'E-mail cannot be blank').notEmpty();
		req.assert('email', 'E-mail is not valid').isEmail();
		req.assert('password', 'Password cannot be blank').notEmpty();
		req.assert('password', 'Password length must be atleast 8 characters').isLength({ min: 8 });
		req.assert('confirmPassword', 'Confirmation Password cannot be blank').notEmpty();
		req.assert('confirmPassword', 'Password & Confirmation password does not match').equals(req.body.password);
		req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

		const errors = req.validationErrors();
		if (errors) {
			req.flash('errors', errors);
			return res.redirect('/signup');
		}

		const user = new User({
			email: req.body.email,
			password: req.body.password
		});

		let existingUser;

		try {
			existingUser = await User.findOne({ email: req.body.email });
		} catch (err) {
			return next(err);
		}

		if (existingUser) {
			req.flash('errors', { msg: 'Account with the e-mail address already exists.' });
			return res.redirect('/signup');
		}

		try {
			await user.save();
		} catch (error) {
			return next(error);
		}

		console.log('USER SAVED', JSON.stringify(user, null, 2));

		const messageBuffer = userRegisteredType.toBuffer({
			id: user._id.toString(),
			email: user.email,
			role: user.role
		});
		const payload = [{
			topic: 'user-topic',
			messages: messageBuffer,
			attributes: 1
		}];

		const producer = await req.getProducer();
		producer.send(payload, (error, result) => {
			if (error) {
				console.error('Sending payload failed:', error);
				res.status(500).json(error);
			} else {
				console.log('Sending payload result:', result);
			}

			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				req.flash('success', { msg: 'You are successfully logged in now!' });
				res.redirect('/signup');
			});
		});
	}
}

export default Register;
