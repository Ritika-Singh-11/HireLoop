import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/resume.controller.js';

const router = Router();

router.post('/upload', auth, ctrl.uploadResume);
router.get('/', auth, ctrl.getResume);

export default router;
