import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport.config.js'; // registers strategies as a side effect

import errorHandler from './middleware/errorHanler.middleware.js';
import authRoutes from './routes/auth.route.js';
import jobRoutes from './routes/job.route.js';
import notificationRoutes from './routes/notification.route.js';
import offerRoutes from './routes/offer.route.js';
import resumeRoutes from './routes/resume.route.js';
import assessmentRoutes from './routes/assessment.route.js';
import aiRoutes from './routes/ai.route.js';
import driveRoutes from './routes/drive.route.js';
import adminRoutes from './routes/admin.route.js';
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // no passport.session() - we're stateless via JWT

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/admin', adminRoutes);

// NOTE: no catch-all 404 handler here on purpose. Express matches routes in
// the ORDER they're registered, not by specificity — so a blanket 404 here
// would shadow any route you add later in server.js (like your "/" route).
// Add the 404 handler + errorHandler in server.js instead, AFTER all routes
// (including any you add there) are registered. See server.js.
app.use(errorHandler); // safe to keep here — only triggered by next(err), doesn't match by path

export default app;
