import { Router } from 'express';
import optionalAuth from '../middleware/optionalAuth.middleware.js';
import * as ctrl from '../controllers/assessment.controller.js';

const router = Router();

// Public / Authenticated listings
router.get('/', optionalAuth, ctrl.getAssessments);
router.get('/my-submissions', optionalAuth, ctrl.getMySubmissions);
router.get('/:id', optionalAuth, ctrl.getAssessmentById);

// Proctored Assessment Lifecycle (Student)
router.post('/:id/start', optionalAuth, ctrl.startAssessment);
router.post('/run-code', optionalAuth, ctrl.runCodeSandbox);
router.post('/:id/submit', optionalAuth, ctrl.submitAssessment);

// Recruiter & Admin Management
router.get('/:id/submissions', optionalAuth, ctrl.getAssessmentSubmissions);

export default router;
