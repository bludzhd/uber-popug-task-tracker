import { Router } from 'express';

import Passport from '../providers/Passport';

import HomeController from '../controllers/Api/Home';
import TasksController from '../controllers/Api/Tasks';
import AssignmentsController from '../controllers/Api/Assignments';

const router = Router();

router.get('/', HomeController.index);

// worker
router.get('/assignments', AssignmentsController.list);
router.post('/assignments/:assignmentId', AssignmentsController.complete);
// manager
router.post('/assignments/reassignment', AssignmentsController.reassign);

// anybody
router.post('/tasks', TasksController.create);

// // worker
// router.get('/assignments', Passport.isAuthenticated, AssignmentsController.list);
// router.post('/assignments/:assignmentId', Passport.isAuthenticated, AssignmentsController.complete);
// // manager
// router.post('/assignments/reassignment', Passport.isAuthenticated, AssignmentsController.reassign);
//
// // anybody
// router.post('/tasks', Passport.isAuthenticated, TasksController.create);

export default router;
