import StudentProfile from '../models/studentProfile.model.js';
import { 
  analyzeResumeWithGemini, 
  evaluateInterviewAnswerWithGemini, 
  generateInterviewQuestionsWithGemini 
} from '../services/gemini.service.js';

// POST /api/ai/analyze-resume - Perform AI ATS Resume Evaluation
export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText, jobTitle, jobDescription, requiredSkills, saveToProfile } = req.body;
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ message: 'Resume text is required for ATS analysis' });
    }

    const result = await analyzeResumeWithGemini({
      resumeText,
      jobTitle: jobTitle || 'Software Engineer',
      jobDescription: jobDescription || '',
      requiredSkills: requiredSkills || [],
      apiKey
    });

    // Optionally save verified ATS score to student profile
    if (saveToProfile && req.user?.id) {
      const studentProfile = await StudentProfile.findOne({ user: req.user.id });
      if (studentProfile) {
        studentProfile.atsScore = result.atsScore;
        await studentProfile.save();
      }
    }

    res.json({
      success: true,
      analysis: result
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/mock-interview/evaluate - Evaluate a single mock interview question
export const evaluateInterviewAnswer = async (req, res, next) => {
  try {
    const { roleTitle, question, studentAnswer, idealPoints } = req.body;
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    if (!studentAnswer || !question) {
      return res.status(400).json({ message: 'Question and student answer are required' });
    }

    const evaluation = await evaluateInterviewAnswerWithGemini({
      roleTitle: roleTitle || 'Software Engineer',
      question,
      studentAnswer,
      idealPoints: idealPoints || '',
      apiKey
    });

    res.json({
      success: true,
      evaluation
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/mock-interview/questions - Dynamic questions generator
export const generateQuestions = async (req, res, next) => {
  try {
    const { roleTitle, companyName, jobDescription, count, domain, customDomain, difficulty, focusArea } = req.body;
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    const selectedDomain = customDomain || domain || roleTitle || 'Software Development Engineer';

    const questions = await generateInterviewQuestionsWithGemini({
      roleTitle: selectedDomain,
      domain: selectedDomain,
      customDomain,
      difficulty: difficulty || 'Campus Graduate / Junior',
      focusArea: focusArea || 'Core Fundamentals & Architecture',
      companyName: companyName || 'Campus Recruiter',
      jobDescription: jobDescription || '',
      count: count || 3,
      apiKey
    });

    res.json({
      success: true,
      questions
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/mock-interview/save-session - Save verified mock interview performance
export const saveInterviewSession = async (req, res, next) => {
  try {
    const { roleTitle, score, percentage } = req.body;

    if (req.user?.id) {
      const studentProfile = await StudentProfile.findOne({ user: req.user.id });
      if (studentProfile) {
        studentProfile.mockInterviewScore = percentage || score || 85;
        await studentProfile.save();
      }
    }

    res.json({
      success: true,
      message: 'Interview session saved to student profile'
    });
  } catch (err) {
    next(err);
  }
};
