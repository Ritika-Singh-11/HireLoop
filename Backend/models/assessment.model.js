import mongoose from 'mongoose';

const mcqQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Quantitative', 'Logical', 'OS', 'DBMS', 'Networks', 'DSA', 'General'],
    default: 'General'
  },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // 0-indexed integer
  explanation: { type: String },
  marks: { type: Number, default: 2 }
}, { _id: false });

const codingProblemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  description: { type: String, required: true },
  constraints: [{ type: String }],
  inputFormat: { type: String },
  outputFormat: { type: String },
  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    explanation: { type: String }
  }],
  marks: { type: Number, default: 20 }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '🏢' },
  category: { 
    type: String, 
    enum: ['coding', 'aptitude', 'hybrid'], 
    default: 'hybrid' 
  },
  durationMinutes: { type: Number, required: true, default: 60 },
  totalMarks: { type: Number, required: true, default: 100 },
  passingMarks: { type: Number, required: true, default: 60 },
  instructions: [{ type: String }],
  proctoringRules: {
    maxTabSwitches: { type: Number, default: 3 },
    fullScreenEnforced: { type: Boolean, default: true },
    copyPasteDisabled: { type: Boolean, default: true }
  },
  mcqQuestions: [mcqQuestionSchema],
  codingProblems: [codingProblemSchema],
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

assessmentSchema.index({ isPublished: 1, job: 1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
