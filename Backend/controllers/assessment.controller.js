import mongoose from 'mongoose';
import Assessment from '../models/assessment.model.js';
import AssessmentSubmission from '../models/assessmentSubmission.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import Application from '../models/application.model.js';
import notificationService from '../services/notification.service.js';
import { runCodeAgainstTestCases } from '../services/codeRunner.service.js';

// Pre-built default assessments for campus recruitment
export const DEFAULT_CAMPUS_ASSESSMENTS = [
  {
    title: 'Razorpay SDE-1 Campus Coding & Aptitude Challenge',
    description: 'Comprehensive technical round for 2026 Batch candidates applying for Software Development Engineer - I. Covers quantitative aptitude, core computer science, and algorithmic problem-solving.',
    companyName: 'Razorpay',
    companyLogo: '💳',
    category: 'hybrid',
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 60,
    instructions: [
      'The assessment consists of 10 Multiple Choice Questions (20 marks) and 2 Algorithmic Coding Challenges (80 marks).',
      'Anti-cheating proctoring is strictly enforced. Switching tabs or exiting full-screen mode will be recorded.',
      'A maximum of 3 proctoring warnings are permitted before your test session is automatically terminated.',
      'Code editor supports JavaScript with live unit test assertions.'
    ],
    proctoringRules: {
      maxTabSwitches: 3,
      fullScreenEnforced: true,
      copyPasteDisabled: true
    },
    mcqQuestions: [
      {
        id: 'mcq-1',
        category: 'Quantitative',
        question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
        correctOption: 1, // 89 seconds: Speed = 240/24 = 10 m/s. Time = (240+650)/10 = 890/10 = 89s
        explanation: 'Speed = 240 / 24 = 10 m/s. Total distance = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.',
        marks: 2
      },
      {
        id: 'mcq-2',
        category: 'Logical',
        question: 'In a certain code, "MONKEY" is written as "XDJMNL". How is "TIGER" written in that code?',
        options: ['QDFHS', 'SDFHS', 'SHFDQ', 'UJHFS'],
        correctOption: 0, // QDFHS
        explanation: 'Each letter is shifted by -1 and reversed.',
        marks: 2
      },
      {
        id: 'mcq-3',
        category: 'DBMS',
        question: 'Which normal form deals with removing multivalued dependencies (MVD)?',
        options: ['1NF', '2NF', '3NF', '4NF'],
        correctOption: 3,
        explanation: 'Fourth Normal Form (4NF) addresses multivalued dependencies.',
        marks: 2
      },
      {
        id: 'mcq-4',
        category: 'OS',
        question: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOption: 2, // Non-preemption is the required condition
        explanation: 'Deadlock requires Non-Preemption (processes cannot be forcefully deprived of resources).',
        marks: 2
      },
      {
        id: 'mcq-5',
        category: 'Networks',
        question: 'What is the standard port used for Secure Shell (SSH) protocol?',
        options: ['21', '22', '23', '80'],
        correctOption: 1,
        explanation: 'Port 22 is the standard port for SSH.',
        marks: 2
      },
      {
        id: 'mcq-6',
        category: 'DSA',
        question: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL Tree) with n nodes?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctOption: 1,
        explanation: 'AVL trees guarantee O(log n) height, so search takes O(log n) worst case.',
        marks: 2
      },
      {
        id: 'mcq-7',
        category: 'DBMS',
        question: 'In ACID properties of database transactions, what does the "I" stand for?',
        options: ['Integrity', 'Isolation', 'Iteration', 'Indexing'],
        correctOption: 1,
        explanation: 'ACID stands for Atomicity, Consistency, Isolation, Durability.',
        marks: 2
      },
      {
        id: 'mcq-8',
        category: 'OS',
        question: 'Belady’s anomaly can occur in which of the following page replacement algorithms?',
        options: ['FIFO (First-In First-Out)', 'LRU (Least Recently Used)', 'Optimal Algorithm', 'LFU'],
        correctOption: 0,
        explanation: 'FIFO algorithm can exhibit Belady’s anomaly where adding page frames causes more page faults.',
        marks: 2
      },
      {
        id: 'mcq-9',
        category: 'Networks',
        question: 'How many packets are exchanged in the TCP standard connection establishment handshake?',
        options: ['2-way handshake', '3-way handshake', '4-way handshake', '1 packet'],
        correctOption: 1,
        explanation: 'TCP uses SYN, SYN-ACK, ACK (3-way handshake).',
        marks: 2
      },
      {
        id: 'mcq-10',
        category: 'DSA',
        question: 'Which data structure is primarily used to implement Breadth-First Search (BFS) in a graph?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree'],
        correctOption: 1,
        explanation: 'Queue (FIFO) is used for Breadth-First Search.',
        marks: 2
      }
    ],
    codingProblems: [
      {
        id: 'code-1',
        title: 'Two Sum / Target Index Finder',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        inputFormat: 'An array of numbers and a target number, e.g. [2, 7, 11, 15], 9',
        outputFormat: 'An array with two indices, e.g. [0, 1]',
        starterCode: {
          javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
          python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
        },
        testCases: [
          {
            input: '[2, 7, 11, 15], 9',
            expectedOutput: '[0, 1]',
            isHidden: false,
            explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].'
          },
          {
            input: '[3, 2, 4], 6',
            expectedOutput: '[1, 2]',
            isHidden: false,
            explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2].'
          },
          {
            input: '[3, 3], 6',
            expectedOutput: '[0, 1]',
            isHidden: true,
            explanation: 'Hidden verification case'
          },
          {
            input: '[-1, -2, -3, -4, -5], -8',
            expectedOutput: '[2, 4]',
            isHidden: true,
            explanation: 'Hidden negative integer case'
          }
        ],
        marks: 40
      },
      {
        id: 'code-2',
        title: 'Valid Parentheses & Delimiter Validator',
        difficulty: 'Easy',
        description: 'Given a string `s` containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        constraints: [
          '1 <= s.length <= 10^4',
          's consists of parentheses only: "()[]{}"'
        ],
        inputFormat: 'A string s, e.g. "()[]{}"',
        outputFormat: 'Boolean true or false',
        starterCode: {
          javascript: `function isValid(s) {
  // Write your code here
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (let ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (map[ch]) {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
          python: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`
        },
        testCases: [
          {
            input: '"()[]{}"',
            expectedOutput: 'true',
            isHidden: false,
            explanation: 'All brackets match in correct order.'
          },
          {
            input: '"(]"',
            expectedOutput: 'false',
            isHidden: false,
            explanation: 'Mismatched closing bracket.'
          },
          {
            input: '"([)]"',
            expectedOutput: 'false',
            isHidden: true,
            explanation: 'Interleaved invalid nesting.'
          },
          {
            input: '"{[]}"',
            expectedOutput: 'true',
            isHidden: true,
            explanation: 'Proper nested brackets.'
          }
        ],
        marks: 40
      }
    ]
  },
  {
    title: 'Microsoft Azure Cloud & Systems Architecture Test',
    description: 'Online technical assessment for Cloud Systems Engineer & SDE. Focuses on distributed computing concepts, operating systems, networking, and array interval algorithms.',
    companyName: 'Microsoft',
    companyLogo: '💻',
    category: 'hybrid',
    durationMinutes: 45,
    totalMarks: 60,
    passingMarks: 40,
    instructions: [
      '5 Advanced Computer Science MCQs (10 marks) and 1 Interval Algorithm Problem (50 marks).',
      'Strict full-screen proctoring enabled with clipboard interception.'
    ],
    proctoringRules: {
      maxTabSwitches: 3,
      fullScreenEnforced: true,
      copyPasteDisabled: true
    },
    mcqQuestions: [
      {
        id: 'ms-mcq-1',
        category: 'OS',
        question: 'Which thread scheduling model maps multiple user threads to multiple kernel threads?',
        options: ['Many-to-One', 'One-to-One', 'Many-to-Many', 'None of the above'],
        correctOption: 2,
        explanation: 'Many-to-Many multiplexes many user-level threads to a smaller or equal number of kernel threads.',
        marks: 2
      },
      {
        id: 'ms-mcq-2',
        category: 'Networks',
        question: 'In DNS resolution, what record type maps a domain name directly to an IPv6 address?',
        options: ['A Record', 'AAAA Record', 'CNAME Record', 'MX Record'],
        correctOption: 1,
        explanation: 'AAAA records map hostnames to 128-bit IPv6 addresses.',
        marks: 2
      }
    ],
    codingProblems: [
      {
        id: 'ms-code-1',
        title: 'Merge Overlapping Intervals',
        difficulty: 'Medium',
        description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        constraints: [
          '1 <= intervals.length <= 10^4',
          'intervals[i].length == 2',
          '0 <= starti <= endi <= 10^4'
        ],
        inputFormat: 'A 2D array of intervals, e.g. [[1,3],[2,6],[8,10],[15,18]]',
        outputFormat: 'Merged 2D array of intervals, e.g. [[1,6],[8,10],[15,18]]',
        starterCode: {
          javascript: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
          python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`
        },
        testCases: [
          {
            input: '[[1,3],[2,6],[8,10],[15,18]]',
            expectedOutput: '[[1,6],[8,10],[15,18]]',
            isHidden: false,
            explanation: 'Intervals [1,3] and [2,6] overlap, merged into [1,6].'
          },
          {
            input: '[[1,4],[4,5]]',
            expectedOutput: '[[1,5]]',
            isHidden: false,
            explanation: 'Intervals [1,4] and [4,5] touch at 4, merged into [1,5].'
          },
          {
            input: '[[1,4],[2,3]]',
            expectedOutput: '[[1,4]]',
            isHidden: true,
            explanation: 'Enclosed interval case.'
          }
        ],
        marks: 50
      }
    ]
  }
];

// Helper to seed assessments on first run
export const ensureSeededAssessments = async () => {
  try {
    const count = await Assessment.countDocuments();
    if (count === 0) {
      await Assessment.insertMany(DEFAULT_CAMPUS_ASSESSMENTS);
      console.log('Seeded default campus technical assessments into MongoDB Atlas');
    }
  } catch (err) {
    console.warn('Notice seeding default assessments:', err.message);
  }
};

// GET /api/assessments - List available assessments
export const getAssessments = async (req, res, next) => {
  try {
    await ensureSeededAssessments();

    const assessments = await Assessment.find({ isPublished: true })
      .select('-mcqQuestions.correctOption -mcqQuestions.explanation -codingProblems.testCases')
      .sort({ createdAt: -1 });

    // If user is a student, attach their submission status if any
    let studentSubmissions = [];
    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: req.user.id });
      if (studentProfile) {
        studentSubmissions = await AssessmentSubmission.find({ student: studentProfile._id })
          .select('assessment status totalScore maxScore percentage passed submittedAt proctoringViolationsCount');
      }
    }

    const submissionMap = new Map();
    studentSubmissions.forEach(sub => {
      submissionMap.set(sub.assessment.toString(), sub);
    });

    const enriched = assessments.map(a => {
      const sub = submissionMap.get(a._id.toString());
      return {
        ...a.toObject(),
        mySubmission: sub || null,
        questionCount: (a.mcqQuestions?.length || 0) + (a.codingProblems?.length || 0),
      };
    });

    res.json({ assessments: enriched });
  } catch (err) {
    next(err);
  }
};

// Helper to resolve string IDs (e.g. 'asm-1') or ObjectIds to Assessment document
export const findAssessmentByIdOrSeed = async (idParam) => {
  if (!idParam) return null;
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    const found = await Assessment.findById(idParam);
    if (found) return found;
  }

  // Search by string id, title, or company in DB
  let found = await Assessment.findOne({
    $or: [
      { title: new RegExp(idParam, 'i') },
      { companyName: new RegExp(idParam, 'i') }
    ]
  });
  if (found) return found;

  // Match in DEFAULT_CAMPUS_ASSESSMENTS
  const match = DEFAULT_CAMPUS_ASSESSMENTS.find(a =>
    a.id === idParam ||
    (idParam === 'asm-1' && a.companyName === 'Razorpay') ||
    (idParam === 'asm-2' && a.companyName === 'Microsoft')
  );

  const template = match || DEFAULT_CAMPUS_ASSESSMENTS[0];
  let inDb = await Assessment.findOne({ title: template.title });
  if (!inDb) {
    inDb = await Assessment.create({
      ...template,
      createdBy: new mongoose.Types.ObjectId()
    });
  }
  return inDb;
};

// GET /api/assessments/:id - Fetch assessment details for test taker
export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await findAssessmentByIdOrSeed(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const isRecruiterOrAdmin = req.user?.role === 'recruiter' || req.user?.role === 'admin';

    // If student, sanitize answers and hidden test cases
    const testData = assessment.toObject();
    if (!isRecruiterOrAdmin) {
      testData.mcqQuestions = (testData.mcqQuestions || []).map(q => ({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options || [],
        marks: q.marks
        // correctOption and explanation omitted
      }));

      testData.codingProblems = (testData.codingProblems || []).map(p => ({
        ...p,
        testCases: (p.testCases || []).filter(tc => !tc.isHidden).map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          explanation: tc.explanation,
          isHidden: false
        }))
      }));
    }

    res.json({ assessment: testData });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessments/:id/start - Start a timed assessment attempt
export const startAssessment = async (req, res, next) => {
  try {
    const assessment = await findAssessmentByIdOrSeed(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    let studentProfile = null;
    if (req.user?.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }
    if (!studentProfile) {
      studentProfile = await StudentProfile.findOne();
      if (!studentProfile) {
        studentProfile = await StudentProfile.create({
          user: req.user?.id || new mongoose.Types.ObjectId(),
          rollNumber: '21BCSE000',
          branch: 'Computer Science & Engineering',
          cgpa: 8.0,
          batch: 2026,
          skills: ['React', 'Node.js', 'JavaScript'],
          isVerified: true
        });
      }
    }

    // Check for existing in_progress submission
    let submission = await AssessmentSubmission.findOne({
      assessment: assessment._id,
      student: studentProfile._id,
      status: 'in_progress'
    });

    if (!submission) {
      submission = await AssessmentSubmission.create({
        assessment: assessment._id,
        student: studentProfile._id,
        status: 'in_progress',
        startedAt: new Date(),
        maxScore: assessment.totalMarks || 100,
        mcqAnswers: [],
        codingSubmissions: []
      });
    }

    res.json({
      message: 'Assessment session started',
      submissionId: submission._id,
      startedAt: submission.startedAt,
      durationMinutes: assessment.durationMinutes || 60,
      proctoringRules: assessment.proctoringRules
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessments/run-code - Execute code in real-time sandbox
export const runCodeSandbox = async (req, res, next) => {
  try {
    const { language, code, testCases } = req.body;

    if (!code || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ message: 'Code and test cases array are required' });
    }

    const result = await runCodeAgainstTestCases(language || 'javascript', code, testCases, 2000);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/assessments/:id/submit - Final submit and grading
export const submitAssessment = async (req, res, next) => {
  try {
    const { submissionId, mcqAnswers, codingSubmissions, proctoringViolations } = req.body;

    const assessment = await findAssessmentByIdOrSeed(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    let studentProfile = null;
    if (req.user?.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }
    if (!studentProfile) {
      studentProfile = await StudentProfile.findOne();
      if (!studentProfile) {
        studentProfile = await StudentProfile.create({
          user: req.user?.id || new mongoose.Types.ObjectId(),
          rollNumber: '21BCSE000',
          branch: 'Computer Science & Engineering',
          cgpa: 8.0,
          batch: 2026,
          skills: ['React', 'Node.js', 'JavaScript'],
          isVerified: true
        });
      }
    }

    let submission = null;
    if (submissionId && mongoose.Types.ObjectId.isValid(submissionId)) {
      submission = await AssessmentSubmission.findById(submissionId);
    }
    if (!submission) {
      submission = await AssessmentSubmission.findOne({
        assessment: assessment._id,
        student: studentProfile._id,
        status: 'in_progress'
      });
    }

    let totalScore = 0;
    const evaluatedMcqs = [];

    // 1. Grade MCQs
    const mcqMap = new Map();
    assessment.mcqQuestions.forEach(q => mcqMap.set(q.id, q));

    if (Array.isArray(mcqAnswers)) {
      mcqAnswers.forEach(ans => {
        const question = mcqMap.get(ans.questionId);
        if (question) {
          const isCorrect = Number(ans.selectedOption) === Number(question.correctOption);
          const marksAwarded = isCorrect ? (question.marks || 2) : 0;
          totalScore += marksAwarded;
          evaluatedMcqs.push({
            questionId: ans.questionId,
            selectedOption: ans.selectedOption,
            isCorrect,
            marksAwarded
          });
        }
      });
    }

    // 2. Grade Coding Problems against ALL test cases (including hidden)
    const evaluatedCode = [];
    const problemMap = new Map();
    assessment.codingProblems.forEach(p => problemMap.set(p.id, p));

    if (Array.isArray(codingSubmissions)) {
      for (const sub of codingSubmissions) {
        const problem = problemMap.get(sub.problemId);
        if (problem) {
          const runResult = await runCodeAgainstTestCases(
            sub.language || 'javascript',
            sub.code || '',
            problem.testCases,
            2000
          );

          const maxProblemMarks = problem.marks || 20;
          const passRatio = runResult.totalTests > 0 ? (runResult.testsPassed / runResult.totalTests) : 0;
          const scoreAwarded = Math.round(passRatio * maxProblemMarks);
          totalScore += scoreAwarded;

          evaluatedCode.push({
            problemId: sub.problemId,
            language: sub.language || 'javascript',
            code: sub.code || '',
            testsPassed: runResult.testsPassed,
            totalTests: runResult.totalTests,
            score: scoreAwarded,
            status: runResult.status,
            testResults: runResult.results
          });
        }
      }
    }

    // 3. Proctoring violations
    const violations = Array.isArray(proctoringViolations) ? proctoringViolations : [];
    const violationsCount = violations.length;
    const isTerminated = violationsCount >= (assessment.proctoringRules?.maxTabSwitches || 3);

    const maxScore = assessment.totalMarks || 100;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = !isTerminated && percentage >= (assessment.passingMarks || 60);

    const updatePayload = {
      status: isTerminated ? 'terminated_proctoring' : 'completed',
      submittedAt: new Date(),
      mcqAnswers: evaluatedMcqs,
      codingSubmissions: evaluatedCode,
      totalScore,
      maxScore,
      percentage,
      passed,
      proctoringViolations: violations,
      proctoringViolationsCount: violationsCount
    };

    if (submission) {
      Object.assign(submission, updatePayload);
      await submission.save();
    } else {
      submission = await AssessmentSubmission.create({
        assessment: assessment._id,
        student: studentProfile._id,
        ...updatePayload
      });
    }

    // 4. Update linked application if present
    if (assessment.job) {
      const application = await Application.findOne({
        student: studentProfile._id,
        job: assessment.job
      });
      if (application) {
        application.atsScore = percentage;
        if (passed && application.status === 'applied') {
          application.status = 'shortlisted';
          application.recruiterNotes = `Online Technical Assessment cleared with score ${percentage}% (${totalScore}/${maxScore}). Automatically promoted to Shortlisted.`;
        }
        await application.save();
      }
    }

    // 5. Send Real-Time Notifications
    try {
      await notificationService.createNotification({
        recipient: req.user.id,
        role: 'student',
        title: passed ? '🎉 Technical Assessment Cleared!' : 'Technical Assessment Completed',
        message: `You scored ${percentage}% (${totalScore}/${maxScore}) on "${assessment.title}". Status: ${passed ? 'PASSED' : (isTerminated ? 'TERMINATED (Proctoring)' : 'NOT CLEARED')}.`,
        type: passed ? 'success' : 'warning',
        category: 'application',
        actionTarget: { role: 'student', tab: 'applications' }
      });

      // Notify admin if proctoring alert
      if (isTerminated) {
        await notificationService.broadcastToRole('admin', {
          title: '🚨 Anti-Cheating Violation Alert',
          message: `Candidate ${studentProfile.name || 'Student'} triggered ${violationsCount} proctoring violations during "${assessment.title}". Assessment auto-terminated.`,
          type: 'urgent',
          category: 'fraud',
          actionTarget: { role: 'admin', tab: 'fraud-monitor' }
        });
      }
    } catch (err) {
      console.warn('Notification trigger notice:', err.message);
    }

    res.json({
      message: 'Assessment submitted successfully',
      submission: {
        id: submission._id,
        totalScore,
        maxScore,
        percentage,
        passed,
        isTerminated,
        violationsCount,
        mcqScore: evaluatedMcqs.reduce((acc, q) => acc + (q.marksAwarded || 0), 0),
        codingScore: evaluatedCode.reduce((acc, c) => acc + (c.score || 0), 0),
        codingSubmissions: evaluatedCode.map(c => ({
          problemId: c.problemId,
          testsPassed: c.testsPassed,
          totalTests: c.totalTests,
          status: c.status,
          score: c.score
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessments/my-submissions - Fetch student's test history
export const getMySubmissions = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.json({ submissions: [] });
    }

    const submissions = await AssessmentSubmission.find({ student: studentProfile._id })
      .populate('assessment', 'title companyName companyLogo category totalMarks passingMarks durationMinutes')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessments/:id/submissions - Leaderboard for recruiters & TPO
export const getAssessmentSubmissions = async (req, res, next) => {
  try {
    let assessmentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      const asm = await findAssessmentByIdOrSeed(assessmentId);
      assessmentId = asm?._id || assessmentId;
    }

    let submissions = [];
    if (mongoose.Types.ObjectId.isValid(assessmentId)) {
      submissions = await AssessmentSubmission.find({ assessment: assessmentId })
        .populate('student', 'name rollNumber branch cgpa skills')
        .sort({ totalScore: -1, timeTakenSeconds: 1 });
    }

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};
