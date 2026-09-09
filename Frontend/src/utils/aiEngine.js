// AI Engine Utility for ATS Scanning, Mock Interviews, Cover Letters & Smart Recommendations

// Standard tech keywords for scanning
const COMMON_TECH_KEYWORDS = [
  'react', 'node.js', 'typescript', 'javascript', 'python', 'java', 'c++',
  'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'azure',
  'git', 'ci/cd', 'rest apis', 'graphql', 'system design', 'data structures',
  'algorithms', 'redis', 'kafka', 'microservices', 'tailwind css', 'html', 'css'
];

/**
 * Smart ATS Resume Analyzer
 * Evaluates resume text against a Job Description or benchmark
 */
export function analyzeResumeATS(resumeText, jobDescription = '', requiredSkills = []) {
  const textLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // 1. Extract target keywords
  let targetKeywords = [...requiredSkills.map(s => s.toLowerCase())];
  if (targetKeywords.length === 0 && jobDescription) {
    targetKeywords = COMMON_TECH_KEYWORDS.filter(kw => jdLower.includes(kw));
  }
  if (targetKeywords.length === 0) {
    targetKeywords = ['react', 'node.js', 'typescript', 'postgresql', 'docker', 'git', 'data structures', 'rest apis'];
  }

  // 2. Determine matches and missing
  const matchedKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // 3. Compute score metrics
  const keywordMatchRatio = targetKeywords.length > 0 
    ? matchedKeywords.length / targetKeywords.length 
    : 0.8;
  
  // Action verbs check
  const actionVerbs = ['developed', 'engineered', 'built', 'led', 'optimized', 'architected', 'reduced', 'increased', 'managed', 'deployed'];
  const verbsFound = actionVerbs.filter(v => textLower.includes(v));
  const actionScore = Math.min(100, verbsFound.length * 15 + 25);

  // Metrics / Numbers check
  const numbersPresent = (resumeText.match(/\d+[\%|k|\+|x|\.]?/gi) || []).length;
  const impactScore = Math.min(100, Math.round(numbersPresent * 8 + 30));

  // Overall ATS Score (weighted average)
  const baseKeywordScore = Math.round(keywordMatchRatio * 60);
  const formattingScore = 20; // Structured JSON gives full layout score
  const atsScore = Math.min(98, Math.max(45, Math.round(baseKeywordScore + (actionScore * 0.15) + (impactScore * 0.1) + 10)));

  // Improvement Suggestions
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Integrate missing keywords such as "${missingKeywords.slice(0, 3).join(', ')}" in your skills and project descriptions.`);
  }
  if (impactScore < 65) {
    suggestions.push('Add more quantifiable metrics (e.g., "improved latency by 35%", "handled 10k requests/sec").');
  }
  if (verbsFound.length < 4) {
    suggestions.push('Use strong action verbs like "Architected", "Engineered", "Spearheaded" at the start of bullet points.');
  }
  if (!textLower.includes('github') || !textLower.includes('linkedin')) {
    suggestions.push('Include verifiable portfolio links (GitHub, LinkedIn, live demo links).');
  }
  suggestions.push('Ensure section headers (Experience, Projects, Education, Skills) are standard for parsing.');

  return {
    score: atsScore,
    matchPercentage: Math.round(keywordMatchRatio * 100),
    matchedKeywords,
    missingKeywords,
    metrics: {
      actionVerbScore: actionScore,
      impactScore,
      structureScore: 92,
      keywordDensity: Math.round((matchedKeywords.length / Math.max(1, (resumeText.split(/\s+/).length))) * 1000)
    },
    suggestions
  };
}

/**
 * Calculate job match score between Student Profile and Job
 */
export function calculateJobMatchScore(student, job) {
  let score = 50;
  
  // CGPA match
  if (student.cgpa >= job.minCgpa) {
    score += 20;
  } else {
    score -= 20;
  }

  // Branch match
  const branchEligible = job.eligibleBranches.some(b => 
    b.toLowerCase().includes(student.branch.toLowerCase()) || 
    b.toLowerCase().includes('all branches')
  );
  if (branchEligible) score += 15;

  // Skills overlap
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());
  
  let matches = 0;
  jobSkills.forEach(js => {
    if (studentSkills.some(ss => ss.includes(js) || js.includes(ss))) {
      matches++;
    }
  });

  const skillMatchRatio = jobSkills.length > 0 ? matches / jobSkills.length : 0.8;
  score += Math.round(skillMatchRatio * 25);

  return Math.min(98, Math.max(40, score));
}

/**
 * Auto-Generate Professional Cover Letter Draft
 */
export function generateCoverLetter(student, job) {
  const skillsList = (student.skills || []).slice(0, 5).join(', ');
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return `Date: ${date}

Hiring Team / Campus Recruitment
${job.companyName}
${job.location || 'India'}

Subject: Application for ${job.title} (Batch ${student.batch})

Dear Hiring Manager at ${job.companyName},

I am writing to express my strong enthusiasm for the ${job.title} position at ${job.companyName}, recently announced through our university placement portal. As a final-year student pursuing ${student.branch} with a current CGPA of ${student.cgpa}/10.0, I have honed hands-on technical skills in ${skillsList}.

${job.companyName}'s work in ${job.department || 'technology innovation'} aligns closely with my career aspirations. During my academic coursework and software projects, I have focused on building scalable, performant systems, writing clean maintainable code, and collaborating in fast-paced sprint cycles.

Given my strong problem-solving mindset and practical experience with modern development workflows, I am confident in my ability to hit the ground running and create meaningful impact for your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my qualifications align with the needs of ${job.companyName}.

Warm regards,

${student.name}
Roll No: ${student.rollNumber || '21BCSE104'}
Email: ${student.email}
Phone: ${student.phone}`;
}

/**
 * Role-specific AI Mock Interview Questions & Feedback Model
 */
export const MOCK_INTERVIEW_ROLES = {
  'frontend': {
    title: 'Frontend Engineer (React / Web UI)',
    questions: [
      {
        id: 1,
        question: 'Can you explain the Virtual DOM in React and how the reconciliation algorithm (Fiber) optimizes rendering performance?',
        expectedKeywords: ['virtual dom', 'diffing', 'reconciliation', 're-render', 'fiber', 'batching'],
        idealPoints: 'Mention Virtual DOM tree representation, diffing O(n) heuristic, state batching, and key props optimization.'
      },
      {
        id: 2,
        question: 'How do you prevent unnecessary re-renders in a large React application? When would you use useMemo, useCallback, or React.memo?',
        expectedKeywords: ['usememo', 'usecallback', 'react.memo', 'referential equality', 'props', 'profiler'],
        idealPoints: 'Explain referential equality of callbacks and objects, component memoization, and measuring performance bottlenecks.'
      },
      {
        id: 3,
        question: 'Describe how the browser Critical Rendering Path works from HTML parsing to pixel paint, and how you optimize Largest Contentful Paint (LCP).',
        expectedKeywords: ['dom', 'cssom', 'render tree', 'layout', 'paint', 'lcp', 'fetch priority', 'defer'],
        idealPoints: 'Discuss DOM/CSSOM creation, layout/reflow, paint, async/defer scripts, and preloading hero images.'
      }
    ]
  },
  'backend': {
    title: 'Backend / Systems Engineer (Node.js / Distributed)',
    questions: [
      {
        id: 1,
        question: 'How does Node.js handle concurrency despite having a single main execution thread? Explain the Event Loop and libuv thread pool.',
        expectedKeywords: ['event loop', 'libuv', 'call stack', 'microtask queue', 'thread pool', 'non-blocking i/o'],
        idealPoints: 'Break down call stack, timers, poll phase, setImmediate vs process.nextTick, and offloading heavy tasks to libuv pool.'
      },
      {
        id: 2,
        question: 'What is the difference between SQL and NoSQL databases, and how do you decide indexing strategies to avoid slow queries under load?',
        expectedKeywords: ['acid', 'schema', 'b-tree index', 'sharding', 'normalization', 'read vs write heavy'],
        idealPoints: 'Compare relational ACID transactions vs document store elasticity, composite indices, and query execution plans (EXPLAIN ANALYZE).'
      },
      {
        id: 3,
        question: 'How would you architect a distributed rate-limiter for a public campus API to prevent DDoS attacks?',
        expectedKeywords: ['redis', 'token bucket', 'leaky bucket', 'sliding window', 'ip rate limiting', 'http 429'],
        idealPoints: 'Propose Redis sliding-window log or token bucket algorithm, HTTP 429 Too Many Requests response, and fallback strategies.'
      }
    ]
  },
  'datascience': {
    title: 'Data Science & AI / ML Engineer',
    questions: [
      {
        id: 1,
        question: 'How do you address overfitting in a machine learning model, and what is the difference between L1 (Lasso) and L2 (Ridge) regularization?',
        expectedKeywords: ['overfitting', 'cross-validation', 'l1 lasso', 'l2 ridge', 'sparsity', 'weights penalty'],
        idealPoints: 'Explain penalizing high model variance, L1 driving weights to absolute zero for feature selection, L2 shrinking weights.'
      },
      {
        id: 2,
        question: 'Explain the Transformer architecture and why the Self-Attention mechanism outperforms traditional RNNs/LSTMs in handling long-range dependencies.',
        expectedKeywords: ['self-attention', 'query key value', 'parallelization', 'vanishing gradient', 'positional encoding'],
        idealPoints: 'Highlight O(1) sequential path distance, multi-head attention matrix multiplication, and training parallelization on GPUs.'
      }
    ]
  },
  'consultant': {
    title: 'Associate Tech Consultant / Product',
    questions: [
      {
        id: 1,
        question: 'Tell me about a time you handled a critical technical bottleneck or conflict within a project team. How did you resolve it?',
        expectedKeywords: ['communication', 'prioritization', 'root cause', 'stakeholders', 'compromise', 'outcome'],
        idealPoints: 'Use STAR method (Situation, Task, Action, Result) with clear team impact and lessons learned.'
      },
      {
        id: 2,
        question: 'If a client wants to launch a new feature in 2 weeks but the engineering team estimates it takes 6 weeks, how do you handle this trade-off?',
        expectedKeywords: ['mvp', 'scope negotiation', 'phased rollout', 'core value', 'timeline', 'expectations'],
        idealPoints: 'Define an MVP focusing on the top 20% critical user journeys, phase non-critical features for v1.1, and align stakeholders transparently.'
      }
    ]
  }
};

/**
 * Evaluate single mock interview answer
 */
export function evaluateAnswer(question, studentAnswer) {
  const answerLower = studentAnswer.toLowerCase().trim();
  const wordCount = answerLower.split(/\s+/).filter(Boolean).length;

  if (wordCount < 6) {
    return {
      score: 30,
      feedback: 'The answer is too brief. Elaborate with concrete architectural principles, examples, and technical trade-offs.',
      strengths: ['Promptness'],
      improvements: ['Explain underlying mechanisms in detail', 'Provide a real-world example from your projects']
    };
  }

  // Keywords matched
  const matched = question.expectedKeywords.filter(kw => answerLower.includes(kw));
  const keywordScore = Math.min(50, Math.round((matched.length / question.expectedKeywords.length) * 50));
  
  // Length & depth score
  const depthScore = Math.min(35, Math.round(wordCount * 0.7));
  
  // Structure & clarity
  const structureScore = 15;
  const totalScore = Math.min(96, Math.max(40, keywordScore + depthScore + structureScore));

  const strengths = [];
  if (matched.length > 0) strengths.push(`Mentioned core concepts: ${matched.slice(0, 3).join(', ')}`);
  if (wordCount > 40) strengths.push('Good descriptive explanation with appropriate depth');
  if (answerLower.includes('example') || answerLower.includes('for instance')) strengths.push('Included practical contextual examples');

  const improvements = [];
  const missing = question.expectedKeywords.filter(kw => !answerLower.includes(kw));
  if (missing.length > 0) {
    improvements.push(`Could also touch upon: ${missing.slice(0, 2).join(', ')}`);
  }
  if (totalScore < 70) {
    improvements.push(question.idealPoints);
  }

  return {
    score: totalScore,
    matchedKeywords: matched,
    feedback: totalScore >= 80 
      ? 'Outstanding response! Demonstrates clear conceptual understanding and articulates technical decisions well.'
      : totalScore >= 60 
      ? 'Good solid answer. Covering edge cases and internal workings will make it stand out even more.'
      : 'Acceptable starting point, but needs deeper technical accuracy and reference to core engineering concepts.',
    strengths,
    improvements
  };
}
