import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import roleCheck from '../middleware/roleCheck.middleware.js';
import * as ctrl from '../controllers/notification.controller.js';

const router = Router();

// Get notifications for current user and role
router.get('/', auth, ctrl.getNotifications);

// Bulk operations (must be before /:id)
router.patch('/mark-all-read', auth, ctrl.markAllNotificationsRead);
router.delete('/clear-all', auth, ctrl.clearAllReadNotifications);
router.post('/broadcast', auth, roleCheck('admin'), ctrl.broadcastNotification);

// Single notification operations
router.patch('/:id/read', auth, ctrl.markNotificationRead);
router.delete('/:id', auth, ctrl.deleteNotification);

export default router;
