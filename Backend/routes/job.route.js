import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import roleCheck from '../middleware/roleCheck.middleware.js'; // rename this import to match your actual filename if different
import * as ctrl from '../controllers/job.controller.js';

const router = Router();

// ---------- Public / Student: browse approved jobs ----------
router.get('/', ctrl.getJobs);

// ---------- Recruiter: my own postings (put before /:id so "mine" isn't treated as an id) ----------
router.get('/mine', auth, roleCheck('recruiter'), ctrl.getMyJobs);

// ---------- Admin: jobs pending approval ----------
router.get('/pending', auth, roleCheck('admin'), ctrl.getPendingJobs);

// ---------- Recruiter: create a job ----------
router.post('/', auth, roleCheck('recruiter'), ctrl.createJob);

// ---------- Get one job (public if approved, owner/admin if not) ----------
router.get('/:id', auth, ctrl.getJobById);

// ---------- Recruiter: edit own unapproved job ----------
router.patch('/:id', auth, roleCheck('recruiter'), ctrl.updateJob);

// ---------- Admin: approve / reject ----------
router.patch('/:id/approve', auth, roleCheck('admin'), ctrl.approveJob);
router.patch('/:id/reject', auth, roleCheck('admin'), ctrl.rejectJob);

export default router;
