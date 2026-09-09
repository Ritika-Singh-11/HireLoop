import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import roleCheck from '../middleware/roleCheck.middleware.js'; // rename this import to match your actual filename if different
import * as ctrl from '../controllers/application.controller.js';

const router = Router();

// ---------- Student: apply to a job ----------
router.post('/', auth, roleCheck('student'), ctrl.applyToJob);

// ---------- Student: my own applications (tracker) ----------
router.get('/student', auth, roleCheck('student'), ctrl.getMyApplications);

// ---------- Recruiter: view applicants for one of their jobs, filterable ----------
router.get('/job/:jobId', auth, roleCheck('recruiter'), ctrl.getApplicantsForJob);

// ---------- Recruiter: update an applicant's status ----------
router.patch('/:id/status', auth, roleCheck('recruiter'), ctrl.updateApplicationStatus);

// ---------- Get one application (owning student, owning recruiter, or admin) ----------
router.get('/:id', auth, ctrl.getApplicationById);

export default router;
