import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/assessment.controller.js';

const router = Router();

// Public / Authenticated listings
router.get('/', auth, ctrl.getAssessments);
router.get('/my-submissions', auth, ctrl.getMySubmissions);
router.get('/:id', auth, ctrl.getAssessmentById);

// Proctored Assessment Lifecycle (Student)
router.post('/:id/start', auth, ctrl.startAssessment);
router.post('/run-code', auth, ctrl.runCodeSandbox);
router.post('/:id/submit', auth, ctrl.submitAssessment);

// Recruiter & Admin Management
router.get('/:id/submissions', auth, ctrl.getAssessmentSubmissions);

export default router;
