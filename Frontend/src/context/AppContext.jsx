import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api, setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../services/api';
import {
  INITIAL_STUDENT,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STUDENTS_LIST,
  INITIAL_DRIVES,
  INITIAL_ELIGIBILITY_POLICY,
  INITIAL_FRAUD_ALERTS,
  INITIAL_TPO_STAFF,
  INITIAL_NOTIFICATIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_SUBMISSIONS
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ================= ROLE-ISOLATED AUTH SESSIONS =================
  // Each role ('student', 'recruiter', 'admin') has its OWN session!
  // Registering/logging in as Student ONLY authenticates Student panel.
  // Logging out of Student NEVER logs you out of Recruiter!
  const [roleUsers, setRoleUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitloop_role_users');
      return saved ? JSON.parse(saved) : { student: null, recruiter: null, admin: null };
    } catch {
      return { student: null, recruiter: null, admin: null };
    }
  });

  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitloop_active_role');
      return (saved && ['student', 'recruiter', 'admin'].includes(saved)) ? saved : 'student';
    } catch {
      return 'student';
    }
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const setCurrentRole = (role) => {
    if (role && ['student', 'recruiter', 'admin'].includes(role)) {
      api.setActiveRole(role);
      try {
        localStorage.setItem('recruitloop_active_role', role);
      } catch {}
    }
    setCurrentRoleState(role);
  };

  const currentUser = roleUsers[currentRole] || null;

  // ================= MOCK / LOCAL STATE (unchanged for now) =================
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('recruitloop_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('recruitloop_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('recruitloop_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('recruitloop_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('recruitloop_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // TPO / Placement Directorate Collections
  const [studentsList, setStudentsList] = useState(() => {
    const saved = localStorage.getItem('recruitloop_students_list');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_LIST;
  });

  const [drivesList, setDrivesList] = useState(() => {
    const saved = localStorage.getItem('recruitloop_drives_list');
    return saved ? JSON.parse(saved) : INITIAL_DRIVES;
  });

  const [eligibilityPolicy, setEligibilityPolicy] = useState(() => {
    const saved = localStorage.getItem('recruitloop_eligibility_policy');
    return saved ? JSON.parse(saved) : INITIAL_ELIGIBILITY_POLICY;
  });

  const [fraudAlerts, setFraudAlerts] = useState(() => {
    const saved = localStorage.getItem('recruitloop_fraud_alerts');
    return saved ? JSON.parse(saved) : INITIAL_FRAUD_ALERTS;
  });

  const [tpoStaffList, setTpoStaffList] = useState(() => {
    const saved = localStorage.getItem('recruitloop_tpo_staff');
    return saved ? JSON.parse(saved) : INITIAL_TPO_STAFF;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authModalTargetRole, setAuthModalTargetRole] = useState('student');

  const openAuthModal = (tab = 'login', targetRole) => {
    setAuthModalTab(tab);
    setAuthModalTargetRole(targetRole || (currentRole === 'guest' ? 'student' : currentRole));
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    type: 'student_premium',
    title: '',
    amount: 0,
    metadata: null,
    onSuccess: null
  });

  const [toast, setToast] = useState(null);

  // Sync mock state to localStorage (unchanged)
  useEffect(() => { localStorage.setItem('recruitloop_student', JSON.stringify(student)); }, [student]);
  useEffect(() => { localStorage.setItem('recruitloop_companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('recruitloop_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('recruitloop_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('recruitloop_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('recruitloop_students_list', JSON.stringify(studentsList)); }, [studentsList]);
  useEffect(() => { localStorage.setItem('recruitloop_drives_list', JSON.stringify(drivesList)); }, [drivesList]);
  useEffect(() => { localStorage.setItem('recruitloop_eligibility_policy', JSON.stringify(eligibilityPolicy)); }, [eligibilityPolicy]);
  useEffect(() => { localStorage.setItem('recruitloop_fraud_alerts', JSON.stringify(fraudAlerts)); }, [fraudAlerts]);
  useEffect(() => { localStorage.setItem('recruitloop_tpo_staff', JSON.stringify(tpoStaffList)); }, [tpoStaffList]);
  useEffect(() => {
    try {
      localStorage.setItem('recruitloop_role_users', JSON.stringify(roleUsers));
    } catch {}
  }, [roleUsers]);

  // ================= REAL-TIME NOTIFICATIONS STATE =================
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitloop_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('recruitloop_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Synchronize live notifications from MongoDB backend when authenticated
  useEffect(() => {
    let isMounted = true;
    async function syncBackendNotifications() {
      const token = api.getAccessToken(currentRole) || api.getRefreshToken(currentRole);
      if (!token) return;
      try {
        const data = await api.getNotifications(currentRole);
        if (isMounted && data?.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
          const backendItems = data.notifications.map(n => ({
            id: n._id || n.id,
            role: n.role,
            title: n.title,
            message: n.message,
            type: n.type || 'info',
            category: n.category || 'system',
            isRead: !!n.isRead,
            createdAt: n.createdAt,
            actionTarget: n.actionTarget || null
          }));

          setNotifications(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            backendItems.forEach(item => map.set(item.id, item));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      } catch (err) {
        // Backend offline or route unauthenticated; continue using cached state
      }
    }
    syncBackendNotifications();
    return () => { isMounted = false; };
  }, [currentRole, roleUsers]);

  const addNotification = (notif) => {
    const newNotif = {
      id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: notif.role || currentRole || 'all',
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      category: notif.category || 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionTarget: notif.actionTarget || null
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(notif.title, notif.type === 'urgent' ? 'error' : 'success');
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await api.markNotificationRead(id, currentRole);
    } catch {}
  };

  const markAllNotificationsRead = async (targetRole) => {
    const roleToMark = targetRole || currentRole;
    setNotifications(prev => prev.map(n => (n.role === roleToMark || n.role === 'all') ? { ...n, isRead: true } : n));
    try {
      await api.markAllNotificationsRead(roleToMark);
    } catch {}
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id, currentRole);
    } catch {}
  };

  const clearAllNotifications = async (targetRole) => {
    const roleToClear = targetRole || currentRole;
    setNotifications(prev => prev.filter(n => !((n.role === roleToClear || n.role === 'all') && n.isRead)));
    try {
      await api.clearAllNotifications(roleToClear);
    } catch {}
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  };

  // ================= ONLINE TECHNICAL ASSESSMENTS STATE =================
  const [assessments, setAssessments] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitloop_assessments');
      return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
    } catch {
      return INITIAL_ASSESSMENTS;
    }
  });

  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitloop_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [activeTestSession, setActiveTestSession] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('recruitloop_assessments', JSON.stringify(assessments));
    } catch {}
  }, [assessments]);

  useEffect(() => {
    try {
      localStorage.setItem('recruitloop_submissions', JSON.stringify(submissions));
    } catch {}
  }, [submissions]);

  // Sync assessments from backend
  useEffect(() => {
    let isMounted = true;
    async function syncBackendAssessments() {
      try {
        const data = await api.getAssessments(currentRole);
        if (isMounted && data?.assessments && Array.isArray(data.assessments) && data.assessments.length > 0) {
          setAssessments(prev => {
            const map = new Map();
            prev.forEach(a => map.set(a.id || a._id, a));
            data.assessments.forEach(a => map.set(a._id || a.id, { ...a, id: a._id || a.id }));
            return Array.from(map.values());
          });
        }
      } catch {}
    }
    syncBackendAssessments();
    return () => { isMounted = false; };
  }, [currentRole]);

  const submitAssessmentAttempt = async (assessmentId, payload) => {
    const targetAssessment = assessments.find(a => (a.id === assessmentId || a._id === assessmentId));
    let backendResult = null;

    try {
      backendResult = await api.submitAssessment(assessmentId, payload);
    } catch (err) {
      console.warn('Backend assessment submit notice (local grading active):', err);
    }

    let totalScore = 0;
    const evaluatedMcqs = [];
    if (targetAssessment?.mcqQuestions) {
      const mcqMap = new Map(targetAssessment.mcqQuestions.map(q => [q.id, q]));
      (payload.mcqAnswers || []).forEach(ans => {
        const q = mcqMap.get(ans.questionId);
        if (q) {
          const isCorrect = Number(ans.selectedOption) === Number(q.correctOption);
          const marks = isCorrect ? (q.marks || 2) : 0;
          totalScore += marks;
          evaluatedMcqs.push({ ...ans, isCorrect, marksAwarded: marks });
        }
      });
    }

    const evaluatedCode = (payload.codingSubmissions || []).map(cs => {
      const p = targetAssessment?.codingProblems?.find(cp => cp.id === cs.problemId);
      const marks = p?.marks || 40;
      const ratio = cs.totalTests > 0 ? (cs.testsPassed / cs.totalTests) : (cs.status === 'Accepted' ? 1 : 0);
      const score = Math.round(ratio * marks);
      totalScore += score;
      return {
        ...cs,
        title: p?.title || 'Coding Problem',
        score
      };
    });

    const maxScore = targetAssessment?.totalMarks || 100;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const violationsCount = (payload.proctoringViolations || []).length;
    const isTerminated = violationsCount >= (targetAssessment?.proctoringRules?.maxTabSwitches || 3);
    const passed = !isTerminated && percentage >= (targetAssessment?.passingMarks || 60);

    const newSubmission = {
      id: backendResult?.submission?.id || `sub-${Date.now()}`,
      assessmentId,
      assessmentTitle: targetAssessment?.title || 'Campus Assessment',
      companyName: targetAssessment?.companyName || 'Campus Recruiter',
      companyLogo: targetAssessment?.companyLogo || '🏢',
      studentId: student.id,
      studentName: student.name,
      totalScore,
      maxScore,
      percentage,
      passed,
      status: isTerminated ? 'terminated_proctoring' : 'completed',
      submittedAt: new Date().toISOString(),
      mcqScore: evaluatedMcqs.reduce((acc, m) => acc + (m.marksAwarded || 0), 0),
      codingScore: evaluatedCode.reduce((acc, c) => acc + (c.score || 0), 0),
      violationsCount,
      codingSubmissions: evaluatedCode,
      proctoringViolations: payload.proctoringViolations || []
    };

    setSubmissions(prev => [newSubmission, ...prev.filter(s => s.assessmentId !== assessmentId)]);

    if (targetAssessment?.jobId) {
      setApplications(prev => prev.map(app => {
        if (app.jobId === targetAssessment.jobId && (app.studentId === student.id || app.studentRoll === student.rollNumber)) {
          return {
            ...app,
            status: passed ? 'Shortlisted' : app.status,
            matchScore: Math.max(app.matchScore || 0, percentage),
            assessmentScore: percentage,
            assessmentPassed: passed,
            history: [
              ...(app.history || []),
              {
                status: passed ? 'Shortlisted' : 'Assessment Completed',
                date: new Date().toISOString().split('T')[0],
                note: `Online Technical Assessment score: ${percentage}% (${totalScore}/${maxScore}). Status: ${passed ? 'Shortlisted for Interview' : 'Test Not Cleared'}.`
              }
            ]
          };
        }
        return app;
      }));
    }

    addNotification({
      role: 'student',
      title: passed ? '🎉 Technical Assessment Cleared!' : 'Technical Assessment Completed',
      message: `You scored ${percentage}% (${totalScore}/${maxScore}) on "${targetAssessment?.title || 'Assessment'}". Status: ${passed ? 'PASSED (Shortlisted)' : (isTerminated ? 'TERMINATED (Proctoring Alert)' : 'NOT CLEARED')}.`,
      type: passed ? 'success' : 'warning',
      category: 'application',
      actionTarget: { role: 'student', tab: 'applications' }
    });

    if (isTerminated) {
      addNotification({
        role: 'admin',
        title: '🚨 Anti-Cheating Violation Alert',
        message: `Candidate ${student.name} triggered ${violationsCount} tab switch violations during "${targetAssessment?.title}". Session terminated.`,
        type: 'urgent',
        category: 'fraud',
        actionTarget: { role: 'admin', tab: 'fraud-monitor' }
      });
    }

    showToast(`Assessment submitted! Score: ${percentage}% (${passed ? 'PASSED' : 'NOT CLEARED'})`, passed ? 'success' : 'warning');
    return newSubmission;
  };

  // ================= SESSION RESTORE (Independent per role) =================
  useEffect(() => {
    async function bootstrapAuth() {
      api.setActiveRole(currentRole);

      const params = new URLSearchParams(window.location.search);
      const oauthAccessToken = params.get('accessToken');
      const oauthRefreshToken = params.get('refreshToken');

      if (oauthAccessToken && oauthRefreshToken) {
        window.history.replaceState({}, '', window.location.pathname);
        try {
          api.setAccessToken('student', oauthAccessToken);
          const me = await api.getMe('student');
          const role = me?.role || 'student';
          api.setAccessToken(role, oauthAccessToken);
          api.setRefreshToken(role, oauthRefreshToken);
          setRoleUsers(prev => ({ ...prev, [role]: me }));
          setCurrentRole(role);
          if (role === 'student' && me?.name) {
            setStudent(prev => ({ ...prev, id: me.id, name: me.name, email: me.email }));
          }
          showToast(`Welcome, ${me?.name || me?.email}!`);
        } catch {
          setAuthError('Could not complete sign-in. Please try again.');
        }
        setAuthLoading(false);
        return;
      }

      // Check all 3 roles independently in parallel!
      const rolesToCheck = ['student', 'recruiter', 'admin'];
      await Promise.all(rolesToCheck.map(async (r) => {
        const token = api.getRefreshToken(r) || api.getAccessToken(r);
        if (!token) return;
        try {
          const me = await api.getMe(r);
          if (me && me.role === r) {
            setRoleUsers(prev => ({ ...prev, [r]: me }));
            if (r === 'student' && me.name) {
              setStudent(prev => ({ ...prev, id: me.id, name: me.name, email: me.email }));
            }
          }
        } catch (err) {
          // ONLY clear tokens if the backend explicitly rejected authentication with 401 Unauthorized
          // Never clear cached user profile on network disconnect or server offline!
          if (err?.status === 401) {
            api.clearTokens(r);
            setRoleUsers(prev => ({ ...prev, [r]: null }));
          }
        }
      }));

      setAuthLoading(false);
    }
    bootstrapAuth();
  }, []);

  // ================= ROLE-ISOLATED AUTH ACTIONS =================

  const login = async (email, password, requestedRole) => {
    setAuthError('');
    const target = requestedRole || currentRole || 'student';
    try {
      const data = await api.login(email, password);
      
      // Enforce panel/role isolation
      if (target && target !== 'guest' && data.user.role !== target) {
        const properPanelName = data.user.role === 'student' ? 'Student' : data.user.role === 'recruiter' ? 'Recruiter' : 'Admin (TPC)';
        const msg = `This account is registered as a ${data.user.role.toUpperCase()}. Please switch to the "${properPanelName}" panel to sign in.`;
        setAuthError(msg);
        showToast(msg, 'warning');
        return false;
      }

      const role = data.user.role;
      api.setAccessToken(role, data.accessToken);
      api.setRefreshToken(role, data.refreshToken);
      setRoleUsers(prev => ({ ...prev, [role]: data.user }));
      setCurrentRole(role);

      if (role === 'student' && data.user.name) {
        setStudent(prev => ({ ...prev, id: data.user.id, name: data.user.name, email: data.user.email }));
      }

      showToast(`Welcome back, ${data.user.name || data.user.email}! (Signed into ${role.toUpperCase()} panel)`);
      return true;
    } catch (err) {
      // Graceful offline fallback for local development / demo testing
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.status === 500) {
        const mockUser = target === 'admin' 
          ? { id: 'admin-1', name: 'Prof. S. K. Verma (Dean)', email: email || 'skverma@campus.edu', role: 'admin', department: 'Head of Placement Directorate' }
          : target === 'recruiter'
          ? { id: 'rec-1', name: 'Neha Kapoor', email: email || 'neha.recruiter@razorpay.com', role: 'recruiter', companyName: 'Razorpay' }
          : { id: 'stu-1', name: student.name || 'Aarav Sharma', email: email || student.email, role: 'student' };
        
        api.setAccessToken(target, 'mock-access-token');
        api.setRefreshToken(target, 'mock-refresh-token');
        setRoleUsers(prev => ({ ...prev, [target]: mockUser }));
        setCurrentRole(target);
        showToast(`Signed into ${target.toUpperCase()} panel!`);
        return true;
      }

      setAuthError(err.data?.message || err.message || 'Login failed');
      showToast(err.data?.message || 'Login failed. Check your email and password.', 'error');
      return false;
    }
  };

  const loginWithGoogle = () => api.startGoogleLogin();
  const loginWithGithub = () => api.startGithubLogin();

  const registerStudent = async (formData) => {
    setAuthError('');
    try {
      const data = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'student',
        rollNumber: formData.rollNumber,
        branch: formData.branch,
        batch: formData.batch,
        cgpa: formData.cgpa,
        skills: formData.skills,
      });
      api.setAccessToken('student', data.accessToken);
      api.setRefreshToken('student', data.refreshToken);
      setRoleUsers(prev => ({ ...prev, student: data.user }));
      setCurrentRole('student');
      setStudent(prev => ({
        ...prev,
        id: data.user.id,
        name: data.user.name || formData.name,
        email: data.user.email || formData.email,
        rollNumber: formData.rollNumber || prev.rollNumber,
        branch: formData.branch || prev.branch,
        batch: formData.batch || prev.batch,
        cgpa: formData.cgpa !== undefined ? Number(formData.cgpa) : prev.cgpa,
        skills: Array.isArray(formData.skills)
          ? formData.skills
          : typeof formData.skills === 'string'
            ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            : prev.skills,
      }));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      showToast(`Student account created! Welcome to HireLoop, ${data.user.name}.`);
      return true;
    } catch (err) {
      setAuthError(err.data?.message || err.message || 'Registration failed');
      showToast(err.data?.message || 'Registration failed', 'error');
      return false;
    }
  };

  const registerRecruiter = async (formData) => {
    setAuthError('');
    try {
      const data = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'recruiter',
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
      });
      api.setAccessToken('recruiter', data.accessToken);
      api.setRefreshToken('recruiter', data.refreshToken);
      setRoleUsers(prev => ({ ...prev, recruiter: data.user }));
      setCurrentRole('recruiter');
      showToast(`Company "${formData.companyName}" registered! Logged into Recruiter panel.`);
      return true;
    } catch (err) {
      setAuthError(err.data?.message || err.message || 'Registration failed');
      showToast(err.data?.message || 'Registration failed', 'error');
      return false;
    }
  };

  const registerAdmin = async (formData) => {
    setAuthError('');
    try {
      const data = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'admin',
        department: formData.department || 'Central Placement Cell',
        designation: formData.designation || 'TPO Officer',
        adminSecretKey: formData.adminSecretKey || 'TPO2026',
      });
      api.setAccessToken('admin', data.accessToken);
      api.setRefreshToken('admin', data.refreshToken);
      setRoleUsers(prev => ({ ...prev, admin: data.user }));
      setCurrentRole('admin');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      showToast(`Admin account registered! Welcome to TPO Directorate, ${data.user.name}.`);
      return true;
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.status === 500) {
        const mockAdmin = {
          id: `admin-${Date.now()}`,
          name: formData.name || 'Placement Dean',
          email: formData.email,
          role: 'admin',
          department: formData.department || 'Central Placement Cell'
        };
        api.setAccessToken('admin', 'mock-admin-access');
        api.setRefreshToken('admin', 'mock-admin-refresh');
        setRoleUsers(prev => ({ ...prev, admin: mockAdmin }));
        setCurrentRole('admin');
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        showToast(`TPO Administrator registered! Welcome, ${mockAdmin.name}.`);
        return true;
      }

      setAuthError(err.data?.message || err.message || 'Admin registration failed');
      showToast(err.data?.message || 'Admin registration failed', 'error');
      return false;
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser = {
      id: 'admin-dean-1',
      name: 'Prof. S. K. Verma (Dean)',
      email: 'skverma@campus.edu',
      role: 'admin',
      department: 'Head of Placement Directorate'
    };
    api.setAccessToken('admin', 'mock-admin-token');
    api.setRefreshToken('admin', 'mock-admin-refresh');
    setRoleUsers(prev => ({ ...prev, admin: adminUser }));
    setCurrentRole('admin');
    showToast('Signed into TPO Directorate as Dean / Super Admin!');
    return true;
  };

  // Logout only from the specified panel (defaults to currentRole)
  const logout = async (roleToLogout) => {
    const role = roleToLogout || currentRole || 'student';
    try {
      const token = api.getRefreshToken(role);
      if (token) {
        await api.logout(token);
      }
    } catch {
      // ignore network errors
    }
    api.clearTokens(role);
    setRoleUsers(prev => ({ ...prev, [role]: null }));
    showToast(`Logged out from ${role === 'student' ? 'Student' : role === 'recruiter' ? 'Recruiter' : 'Admin'} panel`);
  };

  // Logout from all devices for the specified panel
  const logoutAllDevices = async (roleToLogout) => {
    const role = roleToLogout || currentRole || 'student';
    try {
      await api.logoutAll(role);
    } catch {
      // ignore
    } finally {
      api.clearTokens(role);
      setRoleUsers(prev => ({ ...prev, [role]: null }));
      showToast(`Logged out from all devices for ${role === 'student' ? 'Student' : role === 'recruiter' ? 'Recruiter' : 'Admin'} panel`);
    }
  };

  // ================= GENERAL APP ACTIONS =================

  // Company Authorizations
  const approveCompany = (companyId) => {
    const comp = companies.find(c => c.id === companyId);
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: 'Approved' } : c));

    addNotification({
      role: 'recruiter',
      title: 'Company Verification Approved',
      message: `Placement Directorate verified "${comp?.name || 'Your organization'}" for campus drives.`,
      type: 'success',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });

    showToast('Company approved and authorized for campus hiring!');
  };

  const rejectCompany = (companyId) => {
    const comp = companies.find(c => c.id === companyId);
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: 'Rejected' } : c));

    addNotification({
      role: 'recruiter',
      title: 'Company Verification Notice',
      message: `Verification for "${comp?.name || 'Company'}" was rejected. Please contact TPO cell.`,
      type: 'warning',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });

    showToast('Company registration rejected.', 'warning');
  };

  // Job Openings
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: 'Just now',
      approved: true
    };
    setJobs(prev => [newJob, ...prev]);
    showToast(`Opening "${newJob.title}" posted successfully!`);
    return newJob;
  };

  // Announcements
  const addAnnouncement = (announcementData) => {
    const newAnnouncement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    showToast('Announcement broadcasted to campus board!');
  };

  // Payment Modal Operations
  const openPaymentModal = ({ type, title, amount, metadata, onSuccess } = {}) => {
    setPaymentModal({
      isOpen: true,
      type: type || 'student_premium',
      title: title || 'Secure Checkout',
      amount: amount || 499,
      metadata: metadata || null,
      onSuccess: onSuccess || null
    });
  };

  const closePaymentModal = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePaymentSuccess = () => {
    if (paymentModal.onSuccess) {
      paymentModal.onSuccess();
    } else if (paymentModal.type === 'student_premium') {
      setStudent(prev => ({ ...prev, isPremium: true }));
      showToast('Premium upgrade successful! Unlimited AI mock interviews unlocked.');
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
    closePaymentModal();
  };

  const updateStudentResume = (updatedResume) => {
    setStudent(prev => ({ ...prev, resumeData: { ...prev.resumeData, ...updatedResume } }));
    showToast('Resume profile updated successfully!');
  };

  const applyToJob = (job, coverLetter = '') => {
    const existing = applications.find(a => a.jobId === job.id && a.studentId === student.id);
    if (existing) {
      showToast('You have already applied for this position!', 'info');
      return false;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentRoll: student.rollNumber,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      studentSkills: student.skills,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: 91,
      interviewDetails: null,
      coverLetter,
      history: [{ status: 'Applied', date: new Date().toISOString().split('T')[0], note: 'Application submitted through HireLoop 1-Click Apply' }]
    };

    setApplications(prev => [newApp, ...prev]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    showToast(`Application successfully sent to ${job.companyName}!`);

    // Dispatch real-time notifications to Recruiter and Student
    addNotification({
      role: 'recruiter',
      title: 'New Candidate Application',
      message: `${student.name} (CGPA ${student.cgpa}, ${student.branch}) applied for ${job.title}.`,
      type: 'info',
      category: 'application',
      actionTarget: { role: 'recruiter', tab: 'applicants' }
    });
    addNotification({
      role: 'student',
      title: 'Application Submitted',
      message: `Your application for "${job.title}" at ${job.companyName} was submitted successfully.`,
      type: 'success',
      category: 'application',
      actionTarget: { role: 'student', tab: 'applications' }
    });

    return true;
  };

  const updateApplicationStatus = (appId, newStatus, extraDetails = {}) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const historyEntry = { status: newStatus, date: new Date().toISOString().split('T')[0], note: extraDetails.notes || `Status updated to ${newStatus}` };
        const updated = { ...app, status: newStatus, history: [...(app.history || []), historyEntry] };
        if (newStatus === 'Interview Scheduled' && extraDetails.interview) updated.interviewDetails = extraDetails.interview;
        if (newStatus === 'Offer' && extraDetails.offer) updated.offerDetails = extraDetails.offer;
        return updated;
      }
      return app;
    }));

    if (newStatus === 'Interview Scheduled') {
      addNotification({
        role: 'student',
        title: 'Interview Scheduled',
        message: `An interview round has been scheduled for your application. Check details in your tracker.`,
        type: 'success',
        category: 'interview',
        actionTarget: { role: 'student', tab: 'applications' }
      });
    } else if (newStatus === 'Offer') {
      addNotification({
        role: 'student',
        title: '🎉 Placement Offer Extended!',
        message: `Congratulations! A campus placement offer has been recorded for your profile.`,
        type: 'success',
        category: 'application',
        actionTarget: { role: 'student', tab: 'applications' }
      });
    } else if (newStatus === 'Shortlisted') {
      addNotification({
        role: 'student',
        title: 'Candidate Shortlisted',
        message: `You have cleared the screening stage for the next placement round.`,
        type: 'info',
        category: 'application',
        actionTarget: { role: 'student', tab: 'applications' }
      });
    }

    showToast(`Candidate status updated to: ${newStatus}`);
  };

  // ================= TPO ACTIONS =================
  const verifyStudent = (studentId) => {
    setStudentsList(prev => prev.map(s => s.id === studentId ? { ...s, isVerified: true } : s));
    showToast('Student credentials verified by TPC!');
  };

  const toggleBlockStudent = (studentId, reason) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextBlocked = !s.isBlocked;
        return {
          ...s,
          isBlocked: nextBlocked,
          blockReason: nextBlocked ? (reason || 'Campus placement policy violation') : null
        };
      }
      return s;
    }));
    showToast('Student placement clearance status updated.');
  };

  const approveJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, approved: true, rejectionReason: null } : j));
    
    addNotification({
      role: 'recruiter',
      title: 'Job Posting Approved',
      message: `Your campus job posting "${job?.title || 'Opening'}" is now live and accepting applications.`,
      type: 'success',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });
    addNotification({
      role: 'student',
      title: `New Job Opening: ${job?.title || 'Campus Opening'}`,
      message: `${job?.companyName || 'A verified recruiter'} has opened campus applications.`,
      type: 'info',
      category: 'drive',
      actionTarget: { role: 'student', tab: 'jobs' }
    });

    showToast('Job opening approved! Students can now apply.');
  };

  const rejectJob = (jobId, reason) => {
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, approved: false, rejectionReason: reason || 'Not meeting TPC criteria' } : j));
    
    addNotification({
      role: 'recruiter',
      title: 'Job Posting Rejected',
      message: `Job "${job?.title || 'Opening'}" was rejected by TPO. Reason: ${reason || 'Not meeting TPC criteria'}`,
      type: 'warning',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });

    showToast('Job posting rejected.', 'warning');
  };

  const createPlacementDrive = (driveData) => {
    const newDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      status: 'Live',
      eligibleCount: driveData.eligibleCount || 120,
      shortlistedCount: 0
    };
    setDrivesList(prev => [newDrive, ...prev]);

    addNotification({
      role: 'student',
      title: `Placement Drive Announced: ${driveData.companyName}`,
      message: `${driveData.companyName} announced a new placement drive for Batch 2026. Pre-placement talk is live.`,
      type: 'info',
      category: 'drive',
      actionTarget: { role: 'student', tab: 'jobs' }
    });

    showToast(`Campus Drive for "${driveData.companyName}" successfully launched!`);
  };

  const updateDrivePhase = (driveId, nextPhase) => {
    setDrivesList(prev => prev.map(d => d.id === driveId ? { ...d, currentPhase: nextPhase } : d));
    showToast(`Drive round advanced to: ${nextPhase}`);
  };

  const updateEligibilityPolicy = (newPolicy) => {
    setEligibilityPolicy(prev => ({ ...prev, ...newPolicy }));
    showToast('Campus recruitment eligibility policy updated!');
  };

  const resolveFraudAlert = (alertId, actionNote) => {
    setFraudAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: `Resolved (${actionNote || 'Action taken'})` } : a));
    showToast('Fraud alert updated and resolved.');
  };

  const updateStaffRole = (staffId, newRole, newPermissions) => {
    setTpoStaffList(prev => prev.map(s => s.id === staffId ? { ...s, role: newRole, permissions: newPermissions || s.permissions } : s));
    showToast('TPO staff permissions saved.');
  };

  const scheduleInterview = (appId, interviewData) => {
    updateApplicationStatus(appId, 'Interview Scheduled', { interview: interviewData, notes: `Interview scheduled on ${interviewData.date} at ${interviewData.time}` });
    showToast(`Interview scheduled and invitation sent to candidate!`);
  };

  return (
    <AppContext.Provider
      value={{
        // auth (role-isolated)
        roleUsers,
        currentUser,
        currentRole,
        setCurrentRole,
        authLoading,
        authError,
        isAuthenticated: !!currentUser,
        login,
        loginWithGoogle,
        loginWithGithub,
        registerStudent,
        registerRecruiter,
        registerAdmin,
        loginAsDemoAdmin,
        logout,
        logoutAllDevices,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authModalTargetRole,
        openAuthModal,
        closeAuthModal,
        // mock app state
        student,
        setStudent,
        updateStudentResume,
        companies,
        approveCompany,
        rejectCompany,
        jobs,
        addJob,
        approveJob,
        rejectJob,
        applications,
        applyToJob,
        updateApplicationStatus,
        scheduleInterview,
        announcements,
        addAnnouncement,
        // TPO directorate collections & actions
        studentsList,
        setStudentsList,
        verifyStudent,
        toggleBlockStudent,
        drivesList,
        setDrivesList,
        createPlacementDrive,
        updateDrivePhase,
        eligibilityPolicy,
        setEligibilityPolicy,
        updateEligibilityPolicy,
        fraudAlerts,
        setFraudAlerts,
        resolveFraudAlert,
        tpoStaffList,
        setTpoStaffList,
        updateStaffRole,
        toast,
        showToast,
        // Real-Time Notifications
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        handlePaymentSuccess,
        // Online Technical Assessments
        assessments,
        setAssessments,
        submissions,
        setSubmissions,
        activeTestSession,
        setActiveTestSession,
        submitAssessmentAttempt
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
