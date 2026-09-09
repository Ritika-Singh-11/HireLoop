import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/drive.controller.js';

const router = Router();

// Global institutional policy & reports
router.get('/policy/global', ctrl.getEligibilityPolicy);
router.put('/policy/global', auth, ctrl.updateEligibilityPolicy);
router.get('/reports/nirf', ctrl.getPlacementReports);

// Drives CRUD & Progression
router.get('/', ctrl.getDrives);
router.get('/:id', ctrl.getDriveById);
router.post('/', auth, ctrl.createDrive);
router.patch('/:id/phase', auth, ctrl.updateDrivePhase);
router.post('/:id/register', auth, ctrl.registerForDrive);
router.patch('/:id/candidate', auth, ctrl.updateCandidateStatus);

export default router;
