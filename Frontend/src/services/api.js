// API Client Service for connecting React to the Express/MongoDB MERN backend.
// REWRITTEN to match the actual backend routes from Phase 1/2, and to handle
// access/refresh tokens properly instead of a single flat localStorage token.
const API_BASE = import.meta.env.VITE_API_URL || 'https://hireloop-txmg.onrender.com/api';

// ---------- Role-scoped Token storage ----------
// Each role ('student', 'recruiter', 'admin') has its own independent session
// and access/refresh tokens. Logging out of Student never affects Recruiter!
const accessTokens = {
  student: null,
  recruiter: null,
  admin: null,
};

let activeRole = 'student';

export function setActiveRole(role) {
  if (role && ['student', 'recruiter', 'admin'].includes(role)) {
    activeRole = role;
  }
}

export function getActiveRole() {
  return activeRole;
}

export function setAccessToken(roleOrToken, maybeToken) {
  let role = activeRole;
  let token = roleOrToken;
  if (maybeToken !== undefined) {
    role = roleOrToken;
    token = maybeToken;
  }
  if (role && accessTokens.hasOwnProperty(role)) {
    accessTokens[role] = token;
    if (token) {
      localStorage.setItem(`recruitloop_access_token_${role}`, token);
    } else {
      localStorage.removeItem(`recruitloop_access_token_${role}`);
    }
  }
}

export function getAccessToken(role) {
  const r = (role && accessTokens.hasOwnProperty(role)) ? role : activeRole;
  if (accessTokens[r]) return accessTokens[r];
  const saved = localStorage.getItem(`recruitloop_access_token_${r}`);
  if (saved) {
    accessTokens[r] = saved;
    return saved;
  }
  return null;
}

export function setRefreshToken(roleOrToken, maybeToken) {
  let role = activeRole;
  let token = roleOrToken;
  if (maybeToken !== undefined) {
    role = roleOrToken;
    token = maybeToken;
  }
  if (token) {
    localStorage.setItem(`recruitloop_refresh_token_${role}`, token);
  } else {
    localStorage.removeItem(`recruitloop_refresh_token_${role}`);
  }
}

export function getRefreshToken(role) {
  const r = (role && ['student', 'recruiter', 'admin'].includes(role)) ? role : activeRole;
  return localStorage.getItem(`recruitloop_refresh_token_${r}`) || (r === 'student' ? localStorage.getItem('recruitloop_refresh_token') : null);
}

export function clearTokens(role) {
  const r = (role && ['student', 'recruiter', 'admin'].includes(role)) ? role : activeRole;
  accessTokens[r] = null;
  localStorage.removeItem(`recruitloop_access_token_${r}`);
  localStorage.removeItem(`recruitloop_refresh_token_${r}`);
  if (r === 'student') {
    localStorage.removeItem('recruitloop_refresh_token');
  }
}

export function clearAllTokens() {
  ['student', 'recruiter', 'admin'].forEach(r => clearTokens(r));
}

function authHeaders(role) {
  const token = getAccessToken(role || activeRole);
  const geminiKey = typeof localStorage !== 'undefined' ? localStorage.getItem('recruitloop_gemini_api_key') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(geminiKey ? { 'x-gemini-api-key': geminiKey } : {}),
  };
}

// Queue for silent refreshing per role
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  pendingQueue = [];
}

async function request(path, options = {}) {
  const role = options.role || activeRole;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(role), ...(options.headers || {}) },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.ok) return data;

  // Access token expired mid-session or missing — refresh once if refresh token exists, then retry automatically.
  if (res.status === 401 && !options._retry && getRefreshToken(role)) {
    if (isRefreshing) {
      const newToken = await new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
      return request(path, { ...options, role, _retry: true, headers: { ...options.headers, Authorization: `Bearer ${newToken}` } });
    }

    isRefreshing = true;
    try {
      const refreshToken = getRefreshToken(role);
      if (!refreshToken) throw new Error('No refresh token available');

      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshData = await refreshRes.json();
      if (!refreshRes.ok) throw new Error(refreshData?.message || 'Refresh failed');

      setAccessToken(role, refreshData.accessToken);
      processQueue(null, refreshData.accessToken);

      return request(path, { ...options, role, _retry: true });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearTokens(role);
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  const err = new Error(data?.message || `Request failed (${res.status})`);
  err.status = res.status;
  err.data = data;
  throw err;
}

export const api = {
  setActiveRole,
  getActiveRole,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
  clearAllTokens,

  // ---------- Auth ----------
  async register(payload) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  async login(email, password) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async getMe(role) {
    return request('/auth/me', { role });
  },
  async logout(refreshToken) {
    return request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });
  },
  async logoutAll(role) {
    return request('/auth/logout-all', { method: 'POST', role });
  },
  // Full-page redirects, not fetch calls — logging in with Google/GitHub
  // requires actually navigating the browser away to their real login page,
  // which an AJAX request can't do.
  startGoogleLogin() {
    const returnUrl = window.location.origin;
    window.location.href = `${API_BASE}/auth/google?returnTo=${encodeURIComponent(returnUrl)}`;
  },
  startGithubLogin() {
    const returnUrl = window.location.origin;
    window.location.href = `${API_BASE}/auth/github?returnTo=${encodeURIComponent(returnUrl)}`;
  },

  // ---------- Student Profile ----------
  async getStudentProfile() {
    return request('/students/profile', { role: 'student' });
  },
  async updateStudentProfile(profileData) {
    return request('/students/profile', { method: 'PUT', body: JSON.stringify(profileData), role: 'student' });
  },

  // ---------- Jobs ----------
  async getJobs(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },
  async getMyJobs() {
    return request('/jobs/mine');
  },
  async getPendingJobs() {
    return request('/jobs/pending');
  },
  async postJob(jobData) {
    return request('/jobs', { method: 'POST', body: JSON.stringify(jobData) });
  },
  async approveJob(jobId) {
    return request(`/jobs/${jobId}/approve`, { method: 'PATCH' });
  },
  async rejectJob(jobId, reason) {
    return request(`/jobs/${jobId}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });
  },

  // ---------- Applications ----------
  async apply(jobId, resumeUrl, coverLetter) {
    return request('/applications', { method: 'POST', body: JSON.stringify({ jobId, resumeUrl, coverLetter }) });
  },
  async getMyApplications() {
    return request('/applications/student');
  },
  async getApplicantsForJob(jobId, filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return request(`/applications/job/${jobId}${qs ? `?${qs}` : ''}`);
  },
  async updateApplicationStatus(appId, status, recruiterNotes) {
    return request(`/applications/${appId}/status`, { method: 'PATCH', body: JSON.stringify({ status, recruiterNotes }) });
  },

  // ---------- Campus Placement Offers ----------
  async issueOffer(payload) {
    return request('/offers', { method: 'POST', body: JSON.stringify(payload), role: 'recruiter' });
  },
  async acceptOffer(offerId) {
    return request(`/offers/${offerId}/accept`, { method: 'PATCH', role: 'student' });
  },
  async declineOffer(offerId, reason) {
    return request(`/offers/${offerId}/decline`, { method: 'PATCH', body: JSON.stringify({ reason }), role: 'student' });
  },
  async getMyOffers() {
    return request('/offers/my-offers', { role: 'student' });
  },

  // ---------- Admin & TPC Directorate ----------
  async getPlacementStats() {
    return request('/admin/stats');
  },
  async getCompanies() {
    return request('/admin/companies');
  },
  async updateCompanyStatus(companyId, status, rejectionReason) {
    return request(`/admin/companies/${companyId}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), role: 'admin' });
  },
  async getAnnouncements() {
    return request('/admin/announcements');
  },
  async createAnnouncement(data) {
    return request('/admin/announcements', { method: 'POST', body: JSON.stringify(data), role: 'admin' });
  },
  async deleteAnnouncement(id) {
    return request(`/admin/announcements/${id}`, { method: 'DELETE', role: 'admin' });
  },
  async getInterviews() {
    return request('/admin/interviews');
  },
  async scheduleInterview(data) {
    return request('/admin/interviews', { method: 'POST', body: JSON.stringify(data), role: 'admin' });
  },
  async getAdminStudents() {
    return request('/admin/students');
  },
  async verifyStudent(id) {
    return request(`/admin/students/${id}/verify`, { method: 'PATCH', role: 'admin' });
  },
  async toggleBlockStudent(id, blockReason) {
    return request(`/admin/students/${id}/block`, { method: 'PATCH', body: JSON.stringify({ blockReason }), role: 'admin' });
  },

  // ---------- Real-Time Notifications ----------
  async getNotifications(role, filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return request(`/notifications${qs ? `?${qs}` : ''}`, { role });
  },
  async markNotificationRead(id, role) {
    return request(`/notifications/${id}/read`, { method: 'PATCH', role });
  },
  async markAllNotificationsRead(role) {
    return request('/notifications/mark-all-read', { method: 'PATCH', body: JSON.stringify({ role }), role });
  },
  async deleteNotification(id, role) {
    return request(`/notifications/${id}`, { method: 'DELETE', role });
  },
  async clearAllNotifications(role) {
    return request('/notifications/clear-all', { method: 'DELETE', body: JSON.stringify({ role }), role });
  },
  async broadcastNotification(data) {
    return request('/notifications/broadcast', { method: 'POST', body: JSON.stringify(data), role: 'admin' });
  },

  // ---------- PDF Resumes ----------
  async uploadResume(resumeData) {
    return request('/resumes/upload', { method: 'POST', body: JSON.stringify(resumeData), role: 'student' });
  },
  async getResume() {
    return request('/resumes', { role: 'student' });
  },

  // ---------- Official Offer Letters ----------
  async issueOffer(offerData) {
    return request('/offers', { method: 'POST', body: JSON.stringify(offerData), role: 'recruiter' });
  },
  async getMyOffers() {
    return request('/offers/my-offers', { role: 'student' });
  },
  async getJobOffers(jobId) {
    return request(`/offers/job/${jobId}`);
  },
  async acceptOffer(offerId) {
    return request(`/offers/${offerId}/accept`, { method: 'PATCH', role: 'student' });
  },
  async declineOffer(offerId) {
    return request(`/offers/${offerId}/decline`, { method: 'PATCH', role: 'student' });
  },

  // ---------- Online Technical Assessments ----------
  async getAssessments(role = 'student') {
    return request('/assessments', { role });
  },
  async getAssessment(id, role = 'student') {
    return request(`/assessments/${id}`, { role });
  },
  async startAssessment(id) {
    return request(`/assessments/${id}/start`, { method: 'POST', role: 'student' });
  },
  async runCodeSandbox(codeData) {
    return request('/assessments/run-code', { method: 'POST', body: JSON.stringify(codeData), role: 'student' });
  },
  async submitAssessment(id, payload) {
    return request(`/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify(payload), role: 'student' });
  },
  async getMySubmissions() {
    return request('/assessments/my-submissions', { role: 'student' });
  },
  async getAssessmentLeaderboard(id) {
    return request(`/assessments/${id}/submissions`);
  },

  // ---------- AI Engine (ATS & Mock Interview) ----------
  async analyzeResume(payload) {
    return request('/ai/analyze-resume', { method: 'POST', body: JSON.stringify(payload), role: 'student' });
  },
  async evaluateInterviewAnswer(payload) {
    return request('/ai/interview/evaluate', { method: 'POST', body: JSON.stringify(payload), role: 'student' });
  },
  async generateInterviewQuestions(payload) {
    return request('/ai/interview/questions', { method: 'POST', body: JSON.stringify(payload), role: 'student' });
  },
  async saveInterviewSession(payload) {
    return request('/ai/interview/save-session', { method: 'POST', body: JSON.stringify(payload), role: 'student' });
  },

  // ---------- Placement Drives & Eligibility Directorate ----------
  async getDrives() {
    return request('/drives');
  },
  async getDrive(id) {
    return request(`/drives/${id}`);
  },
  async createDrive(payload) {
    return request('/drives', { method: 'POST', body: JSON.stringify(payload), role: 'admin' });
  },
  async updateDrivePhase(id, phase, status) {
    return request(`/drives/${id}/phase`, { method: 'PATCH', body: JSON.stringify({ phase, status }), role: 'admin' });
  },
  async registerForDrive(id, studentData = {}) {
    return request(`/drives/${id}/register`, { method: 'POST', body: JSON.stringify(studentData), role: 'student' });
  },
  async updateCandidateDriveStatus(driveId, payload) {
    return request(`/drives/${driveId}/candidate`, { method: 'PATCH', body: JSON.stringify(payload), role: 'admin' });
  },
  async getEligibilityPolicy() {
    return request('/drives/policy/global');
  },
  async updateEligibilityPolicy(payload) {
    return request('/drives/policy/global', { method: 'PUT', body: JSON.stringify(payload), role: 'admin' });
  },
  async getNirfReports() {
    return request('/drives/reports/nirf');
  },

  // ---------- Razorpay Corporate Gateway ----------
  async getRazorpayKey() {
    return request('/payment/key');
  },
  async updateRazorpayConfig(payload) {
    return request('/payment/config', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async createPaymentOrder(payload) {
    return request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async verifyPayment(payload) {
    return request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export default api;


