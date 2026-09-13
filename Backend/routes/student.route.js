import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/student.controller.js';

const router = Router();

// Student Profile endpoints
router.get('/profile', auth, ctrl.getProfile);
router.put('/profile', auth, ctrl.updateProfile);

export default router;
