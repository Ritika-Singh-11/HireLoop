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
import { checkCandidateEligibility } from '../utils/eligibilityHelper';

export const buildCleanStudentProfile = (user, formData = {}) => {
  const skillsArray = Array.isArray(formData.skills)
    ? formData.skills
    : typeof formData.skills === 'string'
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['React', 'Node.js', 'JavaScript'];

  const studentName = user?.name || formData.name || 'Candidate';
  const studentEmail = (user?.email || formData.email || '').toLowerCase();
  const rollNumber = formData.rollNumber || '';
  const branch = formData.branch || 'Computer Science & Engineering';
  const batch = formData.batch || '2026';
  const cgpa = formData.cgpa !== undefined ? Number(formData.cgpa) : 8.0;

  return {
    id: user?.id || `stu-${Date.now()}`,
    userId: user?.id,
    name: studentName,
    email: studentEmail,
    phone: formData.phone || '',
    location: formData.location || '',
    rollNumber,
    branch,
    batch,
    cgpa,
    skills: skillsArray,
    isPremium: true,
    atsScore: null,
    mockInterviewScore: null,
    placedCompany: null,
    backlogs: 0,
    resumeUrl: null,
    resumeData: {
      fullName: studentName,
      email: studentEmail,
      phone: formData.phone || '',
      location: formData.location || '',
      linkedin: '',
      github: '',
      summary: '',
      education: [
        {
          institution: 'Campus University',
          degree: `B.Tech in ${branch}`,
          year: `2022 - ${batch}`,
          score: `CGPA: ${cgpa} / 10`
        }
      ],
      experience: [],
      projects: [],
      skills: skillsArray
    }
  };
};

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

  // ================= MOCK / LOCAL STATE (User-isolated per account) =================
  const [student, setStudent] = useState(() => {
    try {
      const savedUser = localStorage.getItem('recruitloop_role_users');
      const parsedUsers = savedUser ? JSON.parse(savedUser) : null;
      const studentEmail = parsedUsers?.student?.email?.toLowerCase();
      if (studentEmail) {
        const userSaved = localStorage.getItem(`recruitloop_student_${studentEmail}`);
        if (userSaved) return JSON.parse(userSaved);
      }
      const saved = localStorage.getItem('recruitloop_student');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
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
      const readIds = new Set(JSON.parse(localStorage.getItem('recruitloop_read_notification_ids') || '[]'));
      const list = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
      return list.map(n => readIds.has(String(n.id)) ? { ...n, isRead: true } : n);
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
            const readIds = new Set(JSON.parse(localStorage.getItem('recruitloop_read_notification_ids') || '[]'));
            const map = new Map();
            prev.forEach(item => map.set(String(item.id), item));
            backendItems.forEach(item => {
              const key = String(item.id);
              const existing = map.get(key);
              const isRead = readIds.has(key) || (existing?.isRead === true) || item.isRead;
              map.set(key, { ...item, isRead });
            });
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
    try {
      const readIds = new Set(JSON.parse(localStorage.getItem('recruitloop_read_notification_ids') || '[]'));
      readIds.add(String(id));
      localStorage.setItem('recruitloop_read_notification_ids', JSON.stringify(Array.from(readIds)));
    } catch {}

    setNotifications(prev => {
      const updated = prev.map(n => String(n.id) === String(id) ? { ...n, isRead: true } : n);
      try {
        localStorage.setItem('recruitloop_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await api.markNotificationRead(id, currentRole);
    } catch {}
  };

  const markAllNotificationsRead = async (targetRole) => {
    const roleToMark = targetRole || currentRole;
    try {
      const readIds = new Set(JSON.parse(localStorage.getItem('recruitloop_read_notification_ids') || '[]'));
      notifications.forEach(n => {
        if (n.role === roleToMark || n.role === 'all') {
          readIds.add(String(n.id));
        }
      });
      localStorage.setItem('recruitloop_read_notification_ids', JSON.stringify(Array.from(readIds)));
    } catch {}

    setNotifications(prev => {
      const updated = prev.map(n => (n.role === roleToMark || n.role === 'all') ? { ...n, isRead: true } : n);
      try {
        localStorage.setItem('recruitloop_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await api.markAllNotificationsRead(roleToMark);
    } catch {}
  };

  const deleteNotification = async (id) => {
    try {
      const readIds = new Set(JSON.parse(localStorage.getItem('recruitloop_read_notification_ids') || '[]'));
      readIds.delete(String(id));
      localStorage.setItem('recruitloop_read_notification_ids', JSON.stringify(Array.from(readIds)));
    } catch {}
    setNotifications(prev => {
      const updated = prev.filter(n => String(n.id) !== String(id));
      try {
        localStorage.setItem('recruitloop_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
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

  const loadStudentProfileForUser = async (user, fallbackData = null) => {
    if (!user || !user.email) return null;
    const userEmail = user.email.toLowerCase();

    // 1. Try to fetch real profile from Backend API
    try {
      const res = await api.getStudentProfile();
      if (res?.profile) {
        const p = res.profile;
        const mapped = {
          id: p.userId || user.id || p.id,
          userId: p.userId || user.id,
          name: p.name || user.name || 'Candidate',
          email: p.email || user.email,
          phone: p.phone || '',
          location: p.location || '',
          rollNumber: p.rollNumber || fallbackData?.rollNumber || '',
          branch: p.branch || fallbackData?.branch || 'Computer Science & Engineering',
          batch: p.batch || fallbackData?.batch || 2026,
          cgpa: p.cgpa !== undefined ? Number(p.cgpa) : (fallbackData?.cgpa !== undefined ? Number(fallbackData.cgpa) : 8.0),
          skills: p.skills && p.skills.length > 0 ? p.skills : (fallbackData?.skills || ['React', 'Node.js']),
          linkedin: p.linkedin || '',
          github: p.github || '',
          summary: p.summary || '',
          atsScore: p.atsScore || null,
          mockInterviewScore: p.mockInterviewScore || null,
          placedCompany: p.placedCompany || null,
          backlogs: p.backlogs || 0,
          isPremium: p.isPremium !== false,
          resumeUrl: p.resumeUrl || null,
          resumeData: p.resumeData || {
            fullName: p.name || user.name,
            email: p.email || user.email,
            phone: p.phone || '',
            location: p.location || '',
            linkedin: p.linkedin || '',
            github: p.github || '',
            summary: p.summary || '',
            education: [
              {
                institution: 'Campus University',
                degree: `B.Tech in ${p.branch || 'Computer Science & Engineering'}`,
                year: `2022 - ${p.batch || '2026'}`,
                score: `CGPA: ${p.cgpa || 8.0} / 10`
              }
            ],
            experience: [],
            projects: [],
            skills: p.skills || []
          }
        };
        setStudent(mapped);
        try {
          localStorage.setItem(`recruitloop_student_${userEmail}`, JSON.stringify(mapped));
          localStorage.setItem('recruitloop_student', JSON.stringify(mapped));
        } catch {}
        return mapped;
      }
    } catch (err) {
      console.warn('Backend student profile fetch notice:', err.message || err);
    }

    // 2. Check user-specific localStorage
    try {
      const savedUserStudent = localStorage.getItem(`recruitloop_student_${userEmail}`);
      if (savedUserStudent) {
        const parsed = JSON.parse(savedUserStudent);
        setStudent(parsed);
        localStorage.setItem('recruitloop_student', JSON.stringify(parsed));
        return parsed;
      }
    } catch {}

    // 3. If it's the demo student Aarav Sharma, use INITIAL_STUDENT
    if (userEmail === 'aarav.sharma@campus.edu') {
      setStudent(INITIAL_STUDENT);
      try {
        localStorage.setItem('recruitloop_student', JSON.stringify(INITIAL_STUDENT));
      } catch {}
      return INITIAL_STUDENT;
    }

    // 4. Otherwise create a clean new student profile for this user
    const newProfile = buildCleanStudentProfile(user, fallbackData || {});
    setStudent(newProfile);
    try {
      localStorage.setItem(`recruitloop_student_${userEmail}`, JSON.stringify(newProfile));
      localStorage.setItem('recruitloop_student', JSON.stringify(newProfile));
    } catch {}
    return newProfile;
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
          if (role === 'student' && me) {
            await loadStudentProfileForUser(me);
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
            if (r === 'student' && me) {
              await loadStudentProfileForUser(me);
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
        return { success: false, error: msg };
      }

      const role = data.user.role;
      api.setAccessToken(role, data.accessToken);
      api.setRefreshToken(role, data.refreshToken);
      setRoleUsers(prev => ({ ...prev, [role]: data.user }));
      setCurrentRole(role);

      if (role === 'student' && data.user) {
        await loadStudentProfileForUser(data.user);
      }

      showToast(`Welcome back, ${data.user.name || data.user.email}! (Signed into ${role.toUpperCase()} panel)`);
      return { success: true };
    } catch (err) {
      // Graceful offline fallback for local development / demo testing
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
        const mockUser = target === 'admin' 
          ? { id: 'admin-1', name: 'Prof. S. K. Verma (Dean)', email: email || 'skverma@campus.edu', role: 'admin', department: 'Head of Placement Directorate' }
          : target === 'recruiter'
          ? { id: 'rec-1', name: 'Neha Kapoor', email: email || 'neha.recruiter@razorpay.com', role: 'recruiter', companyName: 'Razorpay' }
          : { id: 'stu-1', name: student.name || 'Aarav Sharma', email: email || student.email, role: 'student', isPremium: true };
        
        api.setAccessToken(target, 'mock-access-token');
        api.setRefreshToken(target, 'mock-refresh-token');
        setRoleUsers(prev => ({ ...prev, [target]: mockUser }));
        setCurrentRole(target);
        showToast(`Signed into ${target.toUpperCase()} panel!`);
        return { success: true };
      }

      const errorMsg = err.data?.message || err.message || 'Login failed';
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
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
      setRoleUsers(prev => ({ ...prev, student: { ...data.user, isPremium: true } }));
      setCurrentRole('student');

      // Create a fresh, pristine student profile dedicated to this new user (no leftover data from other users!)
      const newStudent = buildCleanStudentProfile(data.user, formData);
      setStudent(newStudent);
      const emailKey = (formData.email || data.user.email || '').toLowerCase();
      try {
        localStorage.setItem(`recruitloop_student_${emailKey}`, JSON.stringify(newStudent));
        localStorage.setItem('recruitloop_student', JSON.stringify(newStudent));
      } catch {}

      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      showToast(`Student account created! Welcome to HireLoop, ${data.user.name}. Pro tier activated!`);
      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Registration failed';
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
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
      const recruiterUser = {
        ...data.user,
        companyName: formData.companyName || data.user?.companyName || 'Corporate Recruiter',
        companyId: data.user?.companyId || null,
        isApproved: data.user?.isApproved || false,
      };
      setRoleUsers(prev => ({ ...prev, recruiter: recruiterUser }));
      setCurrentRole('recruiter');

      // Add to local companies list so Admin/TPO immediately sees it in Company Approvals
      const newCompany = {
        id: data.user?.companyId || `comp-${Date.now()}`,
        name: formData.companyName,
        logo: '🏢',
        industry: formData.industry || 'Information Technology',
        location: 'India',
        website: formData.website || '',
        contactPerson: formData.name,
        contactEmail: formData.email,
        status: 'Pending',
        registeredAt: new Date().toISOString().split('T')[0]
      };
      setCompanies(prev => {
        if (prev.some(c => c.name?.toLowerCase() === formData.companyName?.trim().toLowerCase())) {
          return prev;
        }
        return [newCompany, ...prev];
      });

      showToast(`Company "${formData.companyName}" registered! Awaiting TPO verification.`);
      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Registration failed';
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
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
      return { success: true };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
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
        return { success: true };
      }

      const errorMsg = err.data?.message || err.message || 'Admin registration failed';
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
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
    if (role === 'student') {
      try {
        localStorage.removeItem('recruitloop_student');
      } catch {}
      setStudent(INITIAL_STUDENT);
    }
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
      if (role === 'student') {
        try {
          localStorage.removeItem('recruitloop_student');
        } catch {}
        setStudent(INITIAL_STUDENT);
      }
      showToast(`Logged out from all devices for ${role === 'student' ? 'Student' : role === 'recruiter' ? 'Recruiter' : 'Admin'} panel`);
    }
  };

  // ================= GENERAL APP ACTIONS =================

  // Company Authorizations
  const approveCompany = (companyIdOrName) => {
    let companyName = 'Partner Company';
    setCompanies(prev => {
      let found = false;
      const updated = prev.map(c => {
        const matches = 
          c.id === companyIdOrName || 
          c._id === companyIdOrName || 
          (c.name && String(c.name).toLowerCase() === String(companyIdOrName).toLowerCase());
        if (matches) {
          found = true;
          companyName = c.name;
          return { ...c, status: 'Approved' };
        }
        return c;
      });

      if (!found && companyIdOrName) {
        const newComp = {
          id: `comp-${Date.now()}`,
          name: typeof companyIdOrName === 'string' ? companyIdOrName : 'Partner Employer',
          status: 'Approved',
          logo: '🏢',
          industry: 'Campus Recruitment'
        };
        companyName = newComp.name;
        updated.push(newComp);
      }

      try {
        localStorage.setItem('recruitloop_companies', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    addNotification({
      role: 'recruiter',
      title: 'Company Verification Approved',
      message: `Placement Directorate verified "${companyName}" for campus recruitment drives.`,
      type: 'success',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });

    showToast(`Company "${companyName}" approved and authorized for campus hiring!`);
  };

  const rejectCompany = (companyIdOrName) => {
    let companyName = 'Organization';
    setCompanies(prev => {
      let found = false;
      const updated = prev.map(c => {
        const matches = 
          c.id === companyIdOrName || 
          c._id === companyIdOrName || 
          (c.name && String(c.name).toLowerCase() === String(companyIdOrName).toLowerCase());
        if (matches) {
          found = true;
          companyName = c.name;
          return { ...c, status: 'Rejected' };
        }
        return c;
      });

      if (!found && companyIdOrName) {
        const newComp = {
          id: `comp-${Date.now()}`,
          name: typeof companyIdOrName === 'string' ? companyIdOrName : 'Partner Employer',
          status: 'Rejected',
          logo: '🏢',
          industry: 'Campus Recruitment'
        };
        companyName = newComp.name;
        updated.push(newComp);
      }

      try {
        localStorage.setItem('recruitloop_companies', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    addNotification({
      role: 'recruiter',
      title: 'Company Verification Notice',
      message: `Verification for "${companyName}" was declined. Please contact TPO placement directorate.`,
      type: 'warning',
      category: 'approval',
      actionTarget: { role: 'recruiter', tab: 'dashboard' }
    });

    showToast('Company registration status marked as Rejected.', 'warning');
  };

  // Job Openings
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: 'Just now',
      approved: true
    };
    setJobs(prev => {
      const next = [newJob, ...prev];
      try {
        localStorage.setItem('recruitloop_jobs', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Opening "${newJob.title}" posted successfully!`);
    return newJob;
  };

  const updateJob = (jobId, updatedData) => {
    setJobs(prev => {
      const nextJobs = prev.map(j => (j.id === jobId || j._id === jobId ? { ...j, ...updatedData } : j));
      try {
        localStorage.setItem('recruitloop_jobs', JSON.stringify(nextJobs));
      } catch {}
      return nextJobs;
    });
    showToast('Job opening & eligibility criteria updated successfully!');
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

  const handlePaymentSuccess = (paymentResult) => {
    if (paymentModal.onSuccess) {
      paymentModal.onSuccess(paymentResult);
    } else if (paymentModal.type === 'student_premium') {
      setStudent(prev => ({ ...prev, isPremium: true }));
      showToast('Premium upgrade successful! Unlimited AI mock interviews unlocked.');
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
    closePaymentModal();
  };

  const updateStudentResume = (updatedResume) => {
    setStudent(prev => {
      const next = { ...prev, resumeData: { ...prev.resumeData, ...updatedResume } };
      try {
        localStorage.setItem('recruitloop_student', JSON.stringify(next));
        if (next.email) {
          localStorage.setItem(`recruitloop_student_${next.email.toLowerCase()}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
    showToast('Resume profile updated successfully!');
  };

  const updateStudentProfile = async (updatedData) => {
    let backendProfile = null;
    try {
      const res = await api.updateStudentProfile(updatedData);
      if (res?.profile) {
        backendProfile = res.profile;
      }
    } catch (err) {
      console.warn('Backend student profile sync notice:', err.message || err);
    }

    const mergedStudent = {
      ...student,
      ...updatedData,
      ...(backendProfile || {})
    };

    setStudent(mergedStudent);
    try {
      localStorage.setItem('recruitloop_student', JSON.stringify(mergedStudent));
      if (mergedStudent.email) {
        localStorage.setItem(`recruitloop_student_${mergedStudent.email.toLowerCase()}`, JSON.stringify(mergedStudent));
      }
    } catch {}

    // Update in studentsList so Admin / TPO panel reflects changes immediately
    setStudentsList(prev => {
      const list = [...prev];
      const matchIdx = list.findIndex(s => 
        (s.id && (s.id === student.id || s.id === backendProfile?.id)) ||
        (s.email && s.email.toLowerCase() === mergedStudent.email?.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase() === mergedStudent.rollNumber?.toLowerCase())
      );

      const studentEntry = {
        id: backendProfile?.id || student.id || `stu-${Date.now()}`,
        name: mergedStudent.name,
        email: mergedStudent.email,
        phone: mergedStudent.phone || '',
        location: mergedStudent.location || '',
        rollNumber: mergedStudent.rollNumber || '21BCSE000',
        branch: mergedStudent.branch || 'Computer Science & Engineering',
        batch: mergedStudent.batch || 2026,
        cgpa: parseFloat(mergedStudent.cgpa) || 8.0,
        skills: mergedStudent.skills || [],
        backlogs: mergedStudent.backlogs || 0,
        isVerified: true,
        isBlocked: false,
        placedCompany: mergedStudent.placedCompany || null,
        atsScore: mergedStudent.atsScore || 85,
        mockInterviewScore: mergedStudent.mockInterviewScore || 88
      };

      if (matchIdx >= 0) {
        list[matchIdx] = { ...list[matchIdx], ...studentEntry };
      } else {
        list.unshift(studentEntry);
      }

      try {
        localStorage.setItem('recruitloop_students_list', JSON.stringify(list));
      } catch {}

      return list;
    });

    // Update active student auth user name/email if changed
    setRoleUsers(prev => {
      if (prev.student) {
        const updatedUser = {
          ...prev.student,
          name: mergedStudent.name,
          email: mergedStudent.email
        };
        const nextRoles = { ...prev, student: updatedUser };
        try {
          localStorage.setItem('recruitloop_role_users', JSON.stringify(nextRoles));
        } catch {}
        return nextRoles;
      }
      return prev;
    });

    return mergedStudent;
  };

  const applyToJob = (job, coverLetter = '') => {
    const existing = applications.find(a => (a.jobId === job.id || a.jobId === job._id) && (a.studentId === student.id || a.studentEmail === student.email));
    if (existing) {
      showToast('You have already applied for this position!', 'info');
      return false;
    }

    // Synchronized Validation: College Placement Directorate Policy strictly takes precedence!
    const evalResult = checkCandidateEligibility({
      student,
      companyRequirement: job,
      collegePolicy: eligibilityPolicy,
      userApplications: applications
    });

    if (!evalResult.isEligible) {
      if (!evalResult.passesCollege) {
        showToast(`University Policy Ineligible: ${evalResult.collegeReasons[0]}`, 'error');
      } else if (!evalResult.passesCompany) {
        showToast(`Company Criteria Ineligible: ${evalResult.companyReasons[0]}`, 'error');
      } else {
        showToast(`Eligibility check failed: ${evalResult.allReasons[0]}`, 'error');
      }
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
      if (app.id === appId || app._id === appId || String(app.id) === String(appId)) {
        const historyEntry = { status: newStatus, date: new Date().toISOString().split('T')[0], note: extraDetails.notes || `Status updated to ${newStatus}` };
        const updated = { ...app, status: newStatus, history: [...(app.history || []), historyEntry] };
        if (newStatus === 'Interview Scheduled' && extraDetails.interview) {
          updated.interviewDetails = extraDetails.interview;
          updated.interview = extraDetails.interview;
        }
        if (newStatus === 'Offer' || newStatus === 'Offered' || newStatus === 'offered') {
          updated.offerAccepted = false;
          updated.offerDeclined = false;
          if (extraDetails.offer) {
            updated.offerDetails = extraDetails.offer;
            updated.offer = extraDetails.offer;
          }
        }
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

  const acceptOffer = async (appId) => {
    setApplications(prev => prev.map(a => (a.id === appId || a._id === appId || String(a.id) === String(appId)) ? {
      ...a,
      status: 'Offer Accepted',
      offerAccepted: true,
      offerDeclined: false,
      history: [...(a.history || []), { status: 'Offer Accepted', date: new Date().toISOString().split('T')[0], note: 'Offer accepted and digitally signed by candidate' }]
    } : a));

    confetti({ particleCount: 120, spread: 85, origin: { y: 0.6 } });

    const targetApp = applications.find(a => a.id === appId || a._id === appId || String(a.id) === String(appId));
    const compName = targetApp?.companyName || 'Corporate Partner';

    addNotification({
      role: 'student',
      title: '🎉 Placement Offer Accepted!',
      message: `You have successfully accepted and signed the placement offer from ${compName}. Welcome aboard!`,
      type: 'success',
      category: 'application',
      actionTarget: { role: 'student', tab: 'applications' }
    });

    addNotification({
      role: 'recruiter',
      title: 'Offer Accepted by Candidate',
      message: `${student.name || 'Candidate'} accepted your campus placement offer for ${targetApp?.jobTitle || compName}.`,
      type: 'success',
      category: 'application',
      actionTarget: { role: 'recruiter', tab: 'applicants' }
    });

    addNotification({
      role: 'admin',
      title: 'Offer Confirmed: Candidate Placed',
      message: `${student.name || 'Candidate'} accepted placement contract at ${compName}.`,
      type: 'success',
      category: 'application',
      actionTarget: { role: 'admin', tab: 'analytics' }
    });

    showToast(`🎉 Congratulations! You formally accepted the offer from ${compName}!`);

    try {
      await api.acceptOffer(appId);
    } catch (err) {
      console.warn('Backend offer accept sync notice (client state active):', err.message);
    }
  };

  const declineOffer = async (appId) => {
    setApplications(prev => prev.map(a => (a.id === appId || a._id === appId || String(a.id) === String(appId)) ? {
      ...a,
      status: 'Offer Declined',
      offerDeclined: true,
      offerAccepted: false,
      history: [...(a.history || []), { status: 'Offer Declined', date: new Date().toISOString().split('T')[0], note: 'Offer declined by candidate' }]
    } : a));

    const targetApp = applications.find(a => a.id === appId || a._id === appId || String(a.id) === String(appId));
    const compName = targetApp?.companyName || 'Company';

    addNotification({
      role: 'recruiter',
      title: 'Offer Notice: Candidate Declined',
      message: `${student.name || 'Candidate'} opted out of the placement offer for ${compName}.`,
      type: 'warning',
      category: 'application',
      actionTarget: { role: 'recruiter', tab: 'applicants' }
    });

    addNotification({
      role: 'admin',
      title: 'Candidate Declined Offer',
      message: `${student.name || 'Candidate'} declined the placement offer from ${compName}.`,
      type: 'warning',
      category: 'application'
    });

    showToast(`You have declined the offer from ${compName}.`, 'info');

    try {
      await api.declineOffer(appId);
    } catch (err) {
      console.warn('Backend offer decline sync notice (client state active):', err.message);
    }
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

  const approveJob = async (jobId) => {
    const job = jobs.find(j => j.id === jobId || j._id === jobId);
    setJobs(prev => prev.map(j => (j.id === jobId || j._id === jobId) ? { ...j, approved: true, rejectionReason: null } : j));

    try {
      if (api.approveJob) await api.approveJob(jobId);
    } catch {}
    
    addNotification({
      role: 'recruiter',
      title: 'Job Posting Approved & Confirmed',
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

    showToast(`Job "${job?.title || 'Opening'}" confirmed & published!`);
  };

  const rejectJob = async (jobId, reason) => {
    const job = jobs.find(j => j.id === jobId || j._id === jobId);
    setJobs(prev => prev.map(j => (j.id === jobId || j._id === jobId) ? { ...j, approved: false, rejectionReason: reason || 'Not meeting TPC criteria' } : j));
    
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

  const recommendCandidateToHr = (studentObj, jobObj, matchScore = 90, notes = '') => {
    if (!studentObj || !jobObj) return false;

    const studentId = studentObj.id || studentObj._id || studentObj.studentId;
    const jobId = jobObj.id || jobObj._id;
    const jobTitle = jobObj.title || 'Campus Opening';
    const compName = jobObj.companyName || jobObj.company || 'Recruiter';

    let matchedAppIndex = -1;
    const updatedApps = [...applications];

    matchedAppIndex = updatedApps.findIndex(
      a => (String(a.jobId) === String(jobId) || String(a.job?._id || a.job?.id || a.job) === String(jobId)) &&
           (String(a.studentId) === String(studentId) || a.studentEmail === studentObj.email || a.studentName === studentObj.name)
    );

    const historyEntry = {
      status: 'Shortlisted',
      date: new Date().toISOString().split('T')[0],
      note: notes || `⭐ Direct TPO Recommendation dispatched with ${matchScore}% AI Match Score`
    };

    if (matchedAppIndex !== -1) {
      updatedApps[matchedAppIndex] = {
        ...updatedApps[matchedAppIndex],
        isTpoRecommended: true,
        tpoRecommendationScore: matchScore,
        tpoNotes: notes || `TPO verified candidate match (${matchScore}%)`,
        status: updatedApps[matchedAppIndex].status === 'Applied' ? 'Shortlisted' : updatedApps[matchedAppIndex].status,
        history: [...(updatedApps[matchedAppIndex].history || []), historyEntry]
      };
    } else {
      const newApp = {
        id: `app-rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        jobId: jobId,
        jobTitle: jobTitle,
        companyName: compName,
        studentId: studentId,
        studentName: studentObj.name || 'Candidate',
        studentEmail: studentObj.email || `${(studentObj.name || 'student').toLowerCase().replace(/\s+/g, '')}@campus.edu`,
        studentRoll: studentObj.rollNumber || studentObj.roll || '21BCSE000',
        branch: studentObj.branch || 'Engineering',
        cgpa: studentObj.cgpa || 8.0,
        status: 'Shortlisted',
        appliedDate: new Date().toISOString().split('T')[0],
        matchScore: matchScore,
        isTpoRecommended: true,
        tpoRecommendationScore: matchScore,
        tpoNotes: notes || `TPO AI Recommendation dispatched to HR`,
        history: [
          { status: 'Applied', date: new Date().toISOString().split('T')[0], note: 'Application initiated via TPO endorsement' },
          historyEntry
        ]
      };
      updatedApps.unshift(newApp);
    }

    setApplications(updatedApps);
    try {
      localStorage.setItem('recruitloop_applications', JSON.stringify(updatedApps));
    } catch {}

    // Dispatch real-time notification to Recruiter
    addNotification({
      role: 'recruiter',
      title: `⭐ TPO Recommended: ${studentObj.name}`,
      message: `The TPO has officially endorsed ${studentObj.name} (${studentObj.branch || 'Engineering'}, CGPA ${studentObj.cgpa || '8.0+'}) for "${jobTitle}" with a ${matchScore}% AI match.`,
      type: 'success',
      category: 'candidate_recommendation',
      actionTarget: { role: 'recruiter', tab: 'applicants' }
    });

    // Dispatch notification to Student
    addNotification({
      role: 'student',
      title: `⭐ TPO Endorsement Dispatched`,
      message: `Your profile has been officially endorsed by the TPO to ${compName} for the "${jobTitle}" position.`,
      type: 'success',
      category: 'endorsement',
      actionTarget: { role: 'student', tab: 'applications' }
    });

    showToast(`⭐ ${studentObj.name} officially endorsed to ${compName} HR!`);
    return true;
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
        updateStudentProfile,
        updateStudentResume,
        companies,
        approveCompany,
        rejectCompany,
        jobs,
        addJob,
        updateJob,
        approveJob,
        rejectJob,
        applications,
        applyToJob,
        updateApplicationStatus,
        acceptOffer,
        declineOffer,
        scheduleInterview,
        recommendCandidateToHr,
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
        checkCandidateEligibility,
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
