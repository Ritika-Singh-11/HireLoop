import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();

// Live Dashboard Stats
router.get('/stats', ctrl.getDashboardStats);

// Corporate Employer Approvals
router.get('/companies', ctrl.getCompanies);
router.patch('/companies/:id/status', optionalAuth, ctrl.updateCompanyStatus);

// Campus Announcements
router.get('/announcements', ctrl.getAnnouncements);
router.post('/announcements', auth, ctrl.createAnnouncement);
router.delete('/announcements/:id', auth, ctrl.deleteAnnouncement);

// Multi-Round Interview Scheduler
router.get('/interviews', ctrl.getInterviews);
router.post('/interviews', auth, ctrl.scheduleInterview);

// Student Directory & Academic Verification
router.get('/students', ctrl.getStudents);
router.patch('/students/:id/verify', auth, ctrl.verifyStudent);
router.patch('/students/:id/block', auth, ctrl.toggleBlockStudent);

export default router;
