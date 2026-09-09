# RecruitLoop Backend — Phase 0 & Phase 1 (Auth)

This is a working Express + Mongoose backend implementing:
- Email/password auth (register, login) with bcrypt
- Google OAuth login
- GitHub OAuth login
- Access token (short-lived JWT) + Refresh token (DB-backed session) pattern
- Logout (current device)
- **Logout from all devices**
- Revoke a specific device's session
- Role-based access (student / recruiter / admin) with an admin email whitelist

---

## 1. Install

```bash
cd recruitloop-backend
npm install
cp .env.example .env
```

Fill in `.env` — see section 3 below for how to get each OAuth credential.

## 2. Run

```bash
npm run dev      # with nodemon, auto-restarts on file changes
# or
npm start
```

Check it's alive: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

---

## 3. Getting OAuth credentials

### Google
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing).
3. "Create Credentials" → "OAuth client ID" → Application type: **Web application**.
4. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback` (must match `GOOGLE_CALLBACK_URL` in `.env` exactly).
5. Copy the generated Client ID and Client Secret into `.env`.
6. You'll also need to configure the OAuth consent screen (just "External" + your app name is enough for dev/testing).

### GitHub
1. Go to https://github.com/settings/developers → "New OAuth App".
2. Homepage URL: `http://localhost:5173` (your frontend dev URL).
3. Authorization callback URL: `http://localhost:5000/api/auth/github/callback` (must match `GITHUB_CALLBACK_URL`).
4. Copy the Client ID, generate a Client Secret, put both in `.env`.

When you deploy, add a **second** OAuth app (or update the callback URL) pointing at your production domain — localhost callbacks won't work in prod.

---

## 4. How the auth flow works

### Email/Password
```
POST /api/auth/register   { email, password, name, role, companyName? }
POST /api/auth/login      { email, password }
```
Both return: `{ user, accessToken, refreshToken }`

- `role` must be `student`, `recruiter`, or `admin`.
- `admin` registration is **blocked** unless the email is in `ADMIN_EMAIL_WHITELIST` in `.env`. This is intentional — TPO/admin accounts shouldn't be self-service in a real deployment. Seed them manually or via that whitelist.

### Google / GitHub OAuth
```
GET /api/auth/google    -> redirects to Google consent screen
GET /api/auth/github    -> redirects to GitHub consent screen
```
After the user approves, they land back on:
```
{CLIENT_URL}/oauth-success?accessToken=...&refreshToken=...
```
Your frontend route `/oauth-success` should read these query params, store them (see section 5), then:
- If this looks like a brand-new account (you can check via `GET /api/auth/me` — new OAuth users default to role `student` with no profile filled in), redirect to a **"Complete your profile"** page to collect branch/CGPA (student) or company name (recruiter).
- Otherwise redirect to their dashboard.

### Access token usage
Every protected request:
```
Authorization: Bearer <accessToken>
```
Access tokens expire quickly (15 min default). When you get a 401 with `code: "TOKEN_EXPIRED"`, call:
```
POST /api/auth/refresh   { refreshToken }
-> { accessToken }
```
and retry the original request. Do this in an axios response interceptor (see section 6) so it's automatic and invisible to the user.

### Logout
```
POST /api/auth/logout       { refreshToken }        -> logs out THIS device only
POST /api/auth/logout-all   (Bearer token required)  -> logs out EVERY device
GET  /api/auth/sessions     (Bearer token required)  -> list this user's active devices
DELETE /api/auth/sessions/:sessionId (Bearer token)  -> revoke one specific device
```

`logout-all` works because refresh tokens are stored as `Session` documents in MongoDB, not just signed JWTs. Deleting the row makes that refresh token instantly unusable, so even a device that's still "logged in" will be forced to re-login the next time its access token expires and it tries to refresh.

---

## 5. Frontend token storage (recommendation)

- **Access token**: keep in memory (React state/context), NOT localStorage. Lost on page refresh — that's fine, refresh flow gets a new one.
- **Refresh token**: for a hackathon/MVP, localStorage is acceptable. For production, prefer an `httpOnly` secure cookie set by the backend instead of returning it in the JSON body — this avoids exposing it to JS/XSS. This starter returns it in the JSON body to keep the client-side code simple; swap to a cookie later if you want the extra hardening.

## 6. Example axios setup with auto-refresh (frontend reference)

```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

let accessToken = null; // set after login/oauth
export const setAccessToken = (t) => { accessToken = t; };

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.data?.code === 'TOKEN_EXPIRED') {
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post('http://localhost:5000/api/auth/refresh', { refreshToken });
      setAccessToken(data.accessToken);
      err.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios(err.config); // retry original request
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## 7. What's next (Phase 2+)

This starter deliberately stops at auth so you can test it thoroughly before adding
Jobs / Applications / AI / Payments on top. Add new models to `src/models/`, routes to
`src/routes/`, controllers to `src/controllers/`, and mount the route in `src/app.js`
the same way `auth.routes.js` is mounted.

Every new protected route just needs:
```js
router.post('/', auth, roleCheck('recruiter'), someController.someAction);
```
# Phase 2 — Jobs & Applications

## Files in this package

```
models/job.model.js
models/application.model.js
controllers/job.controller.js
controllers/application.controller.js
routes/job.route.js
routes/application.route.js
middleware/roleCheck.middleware.js   ← only needed if you don't already have this from Phase 1
```

## 1. Copy into your project

Drop each file into the matching folder in your `Backend/` project (same structure you already have from Phase 1: `models/`, `controllers/`, `routes/`, `middleware/`).

**Import path check:** `job.route.js` and `application.route.js` import:
```js
import auth from '../middleware/auth.middleware.js';
import roleCheck from '../middleware/roleCheck.middleware.js';
```
Make sure your actual filenames match. If you already have a role-check middleware under a different name, either rename it to `roleCheck.middleware.js` or edit the import path in both route files.

The controllers import your existing Phase 1 models:
```js
import RecruiterProfile from '../models/recruiterProfile.model.js';
import StudentProfile from '../models/studentProfile.model.js';
```
Double-check these filenames match what you already have — don't let these overwrite your real Phase 1 files.

## 2. Mount the routes in `app.js`

```js
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';

app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
```
Add these **above** the 404 handler in `server.js` (same rule as before — anything registered after a catch-all won't be reached).

## 3. What each endpoint does

### Jobs
| Method | Route | Who | What |
|---|---|---|---|
| GET | `/api/jobs` | anyone logged in | browse **approved** jobs, filterable by `?branch=&minCgpa=&batch=&roleType=&skill=` |
| GET | `/api/jobs/mine` | recruiter | list jobs I've posted (including unapproved) |
| GET | `/api/jobs/pending` | admin | jobs awaiting approval |
| GET | `/api/jobs/:id` | anyone logged in | one job (unapproved ones only visible to owner/admin) |
| POST | `/api/jobs` | recruiter | create a job (blocked until `RecruiterProfile.isApproved` is true) |
| PATCH | `/api/jobs/:id` | recruiter (owner) | edit own job, only while still unapproved |
| PATCH | `/api/jobs/:id/approve` | admin | approve a job |
| PATCH | `/api/jobs/:id/reject` | admin | reject with `{ reason }` |

### Applications
| Method | Route | Who | What |
|---|---|---|---|
| POST | `/api/applications` | student | apply with `{ jobId, resumeUrl, coverLetter? }` — server checks CGPA/branch eligibility and deadline itself, never trust the frontend filter alone |
| GET | `/api/applications/student` | student | my own applications with status tracker |
| GET | `/api/applications/job/:jobId` | recruiter (owner) | applicants for one of my jobs, filterable by `?status=&minAtsScore=&branch=&minCgpa=` |
| PATCH | `/api/applications/:id/status` | recruiter (owner) | update status: `applied → shortlisted → interview_scheduled → offered/rejected` |
| GET | `/api/applications/:id` | owning student, owning recruiter, or admin | one application's full detail |

## 4. Important design notes

- **A job is invisible to students until an admin approves it.** `isApproved` defaults to `false`. This mirrors your original plan's "Company Moderation" / verification queue.
- **A recruiter can't post jobs until their own account is approved** (`RecruiterProfile.isApproved`). You'll need an admin endpoint to approve recruiter accounts too — that's a small addition, ask if you want it scaffolded (it's basically identical to `approveJob` but on `RecruiterProfile`).
- **Eligibility (CGPA, branch) is re-checked server-side on apply**, not just used as a display filter. This stops a student from applying to a job they don't qualify for by calling the API directly, bypassing your frontend's filter UI.
- **One application per student per job** is enforced at the database level via a unique compound index (`student + job`), so even a race condition (double-click Apply) can't create duplicates.
- **Payment integration point:** `Job.isPaid` is already in the schema, defaulted to `false`, ready for Phase 5 (Razorpay) to flip to `true` after a verified listing-fee payment. For now jobs can be created without payment so you can test this phase fully before wiring up Razorpay.

## 5. Testing with Postman — suggested order

1. Register a recruiter (`role: recruiter`) and a student (`role: student`) via `/api/auth/register` from Phase 1. Save both access tokens.
2. As the recruiter, try `POST /api/jobs` — it should fail with 403 ("company not yet approved") since `RecruiterProfile.isApproved` defaults to `false`.
3. Manually flip that flag to `true` in MongoDB Atlas's data browser (or Compass) for now — you'll build the actual admin-approval endpoint next.
4. Retry `POST /api/jobs` as the recruiter — should succeed, returns a job with `isApproved: false`.
5. As the student, `GET /api/jobs` — should return an **empty list**, since the job isn't approved yet. This confirms the moderation gate is working.
6. Manually flip `isApproved: true` on the job document in Atlas (again, standing in for the admin endpoint).
7. `GET /api/jobs` as the student again — the job should now appear.
8. `POST /api/applications` as the student with that job's `_id` — should succeed.
9. Try it again with the same `jobId` — should fail with 409 ("already applied").
10. As the recruiter, `GET /api/applications/job/:jobId` — should show the student's application.
11. `PATCH /api/applications/:id/status` with `{ "status": "shortlisted" }` — should succeed.
12. As the student, `GET /api/applications/student` — should show the updated status.

Once all of that works, you're ready for the admin approval endpoints (small addition) and then Phase 3 (frontend wiring).
