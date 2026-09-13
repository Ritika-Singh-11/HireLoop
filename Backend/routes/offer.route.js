import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/offer.controller.js';

import optionalAuth from '../middleware/optionalAuth.middleware.js';

const router = Router();

// Student routes (both PATCH, PUT, and GET supported for email/direct link clicks)
router.get('/my-offers', optionalAuth, ctrl.getMyOffers);
router.patch('/:id/accept', optionalAuth, ctrl.acceptOffer);
router.put('/:id/accept', optionalAuth, ctrl.acceptOffer);
router.get('/:id/accept', optionalAuth, ctrl.acceptOffer);
router.patch('/:id/decline', optionalAuth, ctrl.declineOffer);
router.put('/:id/decline', optionalAuth, ctrl.declineOffer);
router.get('/:id/decline', optionalAuth, ctrl.declineOffer);

// Recruiter / Admin routes
router.post('/', optionalAuth, ctrl.issueOfferLetter);
router.post('/issue', optionalAuth, ctrl.issueOfferLetter);
router.get('/job/:jobId', optionalAuth, ctrl.getJobOffers);
router.get('/:id', optionalAuth, ctrl.getOfferById);

export default router;
