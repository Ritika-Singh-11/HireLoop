import mongoose from 'mongoose';

const mcqAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOption: { type: Number, default: -1 }, // -1 means unattempted
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 }
}, { _id: false });

const codeSubmissionSchema = new mongoose.Schema({
  problemId: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  code: { type: String, default: '' },
  testsPassed: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Unattempted'],
    default: 'Unattempted'
  },
  executionTimeMs: { type: Number, default: 0 },
  testResults: [{
    caseIndex: Number,
    passed: Boolean,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    executionTimeMs: Number,
    error: String,
    isHidden: Boolean
  }]
}, { _id: false });

const proctoringViolationSchema = new mongoose.Schema({
  event: { 
    type: String, 
    enum: ['tab_switch', 'fullscreen_exit', 'paste_attempt', 'blur', 'multiple_faces', 'dev_tools_opened'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
}, { _id: false });

const assessmentSubmissionSchema = new mongoose.Schema({
  assessment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assessment', 
    required: true,
    index: true
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true,
    index: true
  },
  application: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application' 
  },
  status: { 
    type: String, 
    enum: ['in_progress', 'completed', 'terminated_proctoring'], 
    default: 'in_progress' 
  },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeTakenSeconds: { type: Number, default: 0 },
  mcqAnswers: [mcqAnswerSchema],
  codingSubmissions: [codeSubmissionSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  proctoringViolations: [proctoringViolationSchema],
  proctoringViolationsCount: { type: Number, default: 0 }
}, { timestamps: true });

assessmentSubmissionSchema.index({ student: 1, assessment: 1 });
assessmentSubmissionSchema.index({ assessment: 1, totalScore: -1 });

const AssessmentSubmission = mongoose.model('AssessmentSubmission', assessmentSubmissionSchema);
export default AssessmentSubmission;
