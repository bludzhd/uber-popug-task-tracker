import { Router } from 'express';

import Cache from '../providers/Cache';
import Passport from '../providers/Passport';

import HomeController from '../controllers/Home';
import AccountController from '../controllers/Account';
import LoginController from '../controllers/Auth/Login';
import LogoutController from '../controllers/Auth/Logout';
import RegisterController from '../controllers/Auth/Register';

const router = Router();
const cache = Cache.cache;

router.get('/', cache(10), HomeController.index);

router.get('/signup', cache(10), RegisterController.show);
router.post('/signup', RegisterController.perform);

router.get('/login', cache(10), LoginController.show);
router.post('/login', LoginController.perform);

router.get('/logout', LogoutController.perform);

router.get('/account', Passport.isAuthenticated, AccountController.index);

export default router;
