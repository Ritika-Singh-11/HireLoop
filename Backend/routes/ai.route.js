import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/ai.controller.js';

const router = Router();

// ATS Resume Analyzer
router.post('/analyze-resume', auth, ctrl.analyzeResume);

// AI Mock Interview
router.post('/interview/evaluate', auth, ctrl.evaluateInterviewAnswer);
router.post('/interview/questions', auth, ctrl.generateQuestions);
router.post('/interview/save-session', auth, ctrl.saveInterviewSession);

export default router;
