import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/offer.controller.js';

const router = Router();

// Student routes
router.get('/my-offers', auth, ctrl.getMyOffers);
router.patch('/:id/accept', auth, ctrl.acceptOffer);
router.patch('/:id/decline', auth, ctrl.declineOffer);

// Recruiter / Admin routes
router.post('/', auth, ctrl.issueOfferLetter);
router.get('/job/:jobId', auth, ctrl.getJobOffers);
router.get('/:id', auth, ctrl.getOfferById);

export default router;
