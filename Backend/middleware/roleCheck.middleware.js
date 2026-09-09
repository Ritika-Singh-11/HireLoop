/**
 * Usage: router.post('/', auth, roleCheck('recruiter'), createJob)
 * Must run AFTER the `auth` middleware, since it reads req.user.
 *
 * If you already created this file during Phase 1 (possibly under a
 * different name like roleCheck.js), just make sure it's saved at
 * middleware/roleCheck.middleware.js so the imports in job.route.js and
 * application.route.js resolve — or update those two import paths to
 * match whatever you actually named it.
 */
export default (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for your role' });
  }
  next();
};
