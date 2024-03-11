import { Router } from 'express';

import HomeController from '../controllers/Api/Home';
import AuthorizeController from '../controllers/Api/OAuth/Authorize';
import VerifyController from '../controllers/Api/OAuth/Verify';

const router = Router();

router.get('/', HomeController.index);

// OAUTH
router.post('/oauth/authorize', AuthorizeController.perform);
router.post('/oauth/verify', VerifyController.perform);

export default router;
