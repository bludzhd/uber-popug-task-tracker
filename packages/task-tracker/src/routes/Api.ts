import { Router } from 'express';

import HomeController from '../controllers/Api/Home';

const router = Router();

router.get('/', HomeController.index);

export default router;
