export const INITIAL_STUDENT = {
  id: 'stu-101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  phone: '+91 98765 43210',
  rollNumber: '21BCSE104',
  branch: 'Computer Science & Engineering',
  batch: '2026',
  cgpa: 8.85,
  skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Git', 'Data Structures', 'Python'],
  isPremium: false,
  resumeData: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/aaravsharma',
    github: 'github.com/aaravsharma',
    summary: 'Proactive final-year Computer Science undergraduate with strong foundation in full-stack web development, RESTful microservices, and distributed databases. Passionate about building high-performance scalable web systems.',
    education: [
      {
        institution: 'National Institute of Technology (NIT)',
        degree: 'B.Tech in Computer Science & Engineering',
        year: '2022 - 2026',
        score: 'CGPA: 8.85 / 10'
      },
      {
        institution: 'Delhi Public School',
        degree: 'Senior Secondary (Class XII CBSE)',
        year: '2020 - 2022',
        score: '96.2%'
      }
    ],
    experience: [
      {
        company: 'FinTech Labs',
        role: 'Software Engineer Intern',
        period: 'May 2025 - Jul 2025',
        details: [
          'Developed responsive payment analytics dashboard in React & Tailwind, reducing page load latency by 35%.',
          'Engineered Node.js REST endpoints integrated with PostgreSQL, handling 20,000+ daily mock transaction records.',
          'Wrote unit tests using Jest, achieving 88% code test coverage.'
        ]
      }
    ],
    projects: [
      {
        title: 'RecruitLoop — AI Placement Portal',
        tech: 'React, Node.js, Tailwind CSS, Gemini API',
        description: 'End-to-end campus recruitment ecosystem with ATS resume evaluation, mock interview speech analysis, and automated recruiter workflows.'
      },
      {
        title: 'Distributed Task Queue Engine',
        tech: 'Go, Redis, Docker, WebSockets',
        description: 'High-throughput async job runner with exponential backoff retries and live task status dashboards.'
      }
    ],
    skills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Docker', 'Git & CI/CD']
  }
};

export const INITIAL_COMPANIES = [
  {
    id: 'comp-1',
    name: 'Razorpay',
    logo: '💳',
    website: 'https://razorpay.com',
    industry: 'FinTech / Payments',
    location: 'Bangalore, Karnataka',
    status: 'Approved',
    registeredAt: '2026-08-15',
    contactPerson: 'Neha Kapoor (Senior Talent Partner)',
    contactEmail: 'neha.recruiter@razorpay.com'
  },
  {
    id: 'comp-2',
    name: 'Microsoft',
    logo: '💻',
    website: 'https://microsoft.com',
    industry: 'Cloud & Enterprise Software',
    location: 'Hyderabad, Telangana',
    status: 'Approved',
    registeredAt: '2026-08-10',
    contactPerson: 'Vikram Mehta (University Recruiting Lead)',
    contactEmail: 'vikram.mehta@microsoft.com'
  },
  {
    id: 'comp-3',
    name: 'Zomato',
    logo: '🍔',
    website: 'https://zomato.com',
    industry: 'Consumer Tech / Logistics',
    location: 'Gurugram, Haryana',
    status: 'Approved',
    registeredAt: '2026-08-20',
    contactPerson: 'Pooja Iyer (Technical Recruiter)',
    contactEmail: 'pooja.i@zomato.com'
  },
  {
    id: 'comp-4',
    name: 'Deloitte',
    logo: '🏢',
    website: 'https://deloitte.com',
    industry: 'Consulting & Technology',
    location: 'Mumbai, Maharashtra',
    status: 'Approved',
    registeredAt: '2026-08-25',
    contactPerson: 'Amitabh Sen (Campus Lead)',
    contactEmail: 'asen@deloitte.com'
  },
  {
    id: 'comp-5',
    name: 'Atlassian',
    logo: '🚀',
    website: 'https://atlassian.com',
    industry: 'Collaboration Software',
    location: 'Bangalore (Hybrid)',
    status: 'Approved',
    registeredAt: '2026-08-28',
    contactPerson: 'Ritika Roy (HR Specialist)',
    contactEmail: 'rroy@atlassian.com'
  },
  {
    id: 'comp-6',
    name: 'NovaScale AI',
    logo: '🤖',
    website: 'https://novascale.ai',
    industry: 'Generative AI Startup',
    location: 'Remote',
    status: 'Pending',
    registeredAt: '2026-09-02',
    contactPerson: 'Siddharth Rao (Founder & CTO)',
    contactEmail: 'sid@novascale.ai'
  }
];

export const INITIAL_JOBS = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'Razorpay',
    companyLogo: '💳',
    title: 'Software Development Engineer - I (Full Stack)',
    department: 'Core Payments Engineering',
    location: 'Bangalore, India',
    mode: 'Hybrid',
    salaryMin: 18,
    salaryMax: 22,
    salaryDisplay: '₹18 - ₹22 LPA',
    minCgpa: 7.5,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.'],
    eligibleBatch: '2026',
    deadline: '2026-09-25',
    openings: 8,
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'System Design Basics'],
    description: 'We are looking for enthusiastic SDE-1 engineers to join our Merchant Experience and Checkout platform team. You will build high-throughput UI workflows, integrate payment gateways, and optimize latency for millions of daily active users.',
    approved: true,
    listingFeePaid: true
  },
  {
    id: 'job-2',
    companyId: 'comp-2',
    companyName: 'Microsoft',
    companyLogo: '💻',
    title: 'Software Engineer (Cloud & Azure Services)',
    department: 'Azure Distributed Computing',
    location: 'Hyderabad / Bangalore',
    mode: 'On-site',
    salaryMin: 28,
    salaryMax: 32,
    salaryDisplay: '₹28 - ₹32 LPA',
    minCgpa: 8.0,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    eligibleBatch: '2026',
    deadline: '2026-09-20',
    openings: 12,
    requiredSkills: ['C++', 'Python', 'Distributed Systems', 'Data Structures', 'Docker', 'Linux Internals'],
    description: 'Join the Azure infrastructure core team. You will design, build, and deploy hyper-scale microservices, optimize distributed cache networks, and solve complex latency and resilience challenges across global datacenters.',
    approved: true,
    listingFeePaid: true
  },
  {
    id: 'job-3',
    companyId: 'comp-3',
    companyName: 'Zomato',
    companyLogo: '🍔',
    title: 'Backend Engineer - Platform & Growth',
    department: 'Food Delivery Marketplace',
    location: 'Gurugram, India',
    mode: 'On-site',
    salaryMin: 16,
    salaryMax: 20,
    salaryDisplay: '₹16 - ₹20 LPA',
    minCgpa: 7.0,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.'],
    eligibleBatch: '2026',
    deadline: '2026-09-18',
    openings: 5,
    requiredSkills: ['Node.js', 'Go', 'Redis', 'PostgreSQL', 'Kafka', 'Microservices'],
    description: 'Work on hyper-local order routing algorithms, real-time dispatch systems, and high-concurrency microservices processing 1,000+ orders per second during peak hours.',
    approved: true,
    listingFeePaid: true
  },
  {
    id: 'job-4',
    companyId: 'comp-4',
    companyName: 'Deloitte',
    companyLogo: '🏢',
    title: 'Associate Technology Consultant',
    department: 'Enterprise Technology & Strategy',
    location: 'Mumbai / Pune / Gurgaon',
    mode: 'Hybrid',
    salaryMin: 11,
    salaryMax: 14,
    salaryDisplay: '₹11 - ₹14 LPA',
    minCgpa: 6.8,
    eligibleBranches: ['All Branches (Open for Circuit & Non-Circuit)'],
    eligibleBatch: '2026',
    deadline: '2026-09-30',
    openings: 25,
    requiredSkills: ['Python', 'SQL', 'Cloud Fundamentals', 'Problem Solving', 'Communication'],
    description: 'Transform enterprise businesses by architecting digital cloud migrations, analyzing data ecosystems, and developing custom web solutions for Fortune 500 clients.',
    approved: true,
    listingFeePaid: true
  },
  {
    id: 'job-5',
    companyId: 'comp-5',
    companyName: 'Atlassian',
    companyLogo: '🚀',
    title: 'Product Engineer - Jira Ecosystem',
    department: 'Teamwork Cloud Platform',
    location: 'Bangalore (Remote-Friendly)',
    mode: 'Remote',
    salaryMin: 22,
    salaryMax: 26,
    salaryDisplay: '₹22 - ₹26 LPA',
    minCgpa: 7.8,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    eligibleBatch: '2026',
    deadline: '2026-10-05',
    openings: 6,
    requiredSkills: ['React', 'TypeScript', 'Java', 'REST APIs', 'GraphQL', 'Agile Principles'],
    description: 'Create rich, intuitive collaboration features for Jira and Confluence used by 250,000+ organizations worldwide.',
    approved: true,
    listingFeePaid: true
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-2',
    jobTitle: 'Software Engineer (Cloud & Azure Services)',
    companyName: 'Microsoft',
    companyLogo: '💻',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    studentRoll: '21BCSE104',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentSkills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'Docker'],
    status: 'Interview Scheduled',
    appliedDate: '2026-08-28',
    matchScore: 92,
    interviewDetails: {
      round: 'Technical Round 1 (Data Structures & Systems)',
      date: '2026-09-12',
      time: '11:00 AM IST',
      interviewer: 'Rohan Deshmukh (Principal Architect)',
      meetLink: 'https://meet.google.com/abc-recruit-loop',
      notes: 'Please keep an IDE ready for live coding and system design whiteboard.'
    },
    history: [
      { status: 'Applied', date: '2026-08-28', note: 'Application submitted with verified college resume' },
      { status: 'Shortlisted', date: '2026-08-31', note: 'Profile matched CGPA criteria (>=8.0) and online test score' },
      { status: 'Interview Scheduled', date: '2026-09-04', note: 'Technical Round 1 scheduled for Sep 12' }
    ]
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    jobTitle: 'Software Development Engineer - I (Full Stack)',
    companyName: 'Razorpay',
    companyLogo: '💳',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    studentRoll: '21BCSE104',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentSkills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    status: 'Shortlisted',
    appliedDate: '2026-08-30',
    matchScore: 96,
    interviewDetails: null,
    history: [
      { status: 'Applied', date: '2026-08-30', note: 'Applied via 1-click campus portal' },
      { status: 'Shortlisted', date: '2026-09-03', note: 'Selected for interview rounds. Slots to be announced shortly.' }
    ]
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'Backend Engineer - Platform & Growth',
    companyName: 'Zomato',
    companyLogo: '🍔',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    studentRoll: '21BCSE104',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentSkills: ['Node.js', 'Go', 'Redis', 'PostgreSQL'],
    status: 'Offer',
    appliedDate: '2026-08-22',
    matchScore: 89,
    interviewDetails: {
      round: 'Final HR & Offer Discussion Completed',
      date: '2026-09-01',
      time: 'Completed',
      interviewer: 'HR Operations',
      meetLink: '-',
      notes: 'Offer letter released! Base CTC: ₹18.5 LPA + Performance Bonus.'
    },
    offerDetails: {
      package: '₹18.5 LPA',
      designation: 'Backend Engineer - I',
      joiningDate: '2026-07-01',
      location: 'Gurugram',
      validTill: '2026-09-30'
    },
    history: [
      { status: 'Applied', date: '2026-08-22', note: 'Application submitted' },
      { status: 'Shortlisted', date: '2026-08-25', note: 'Online coding round cleared' },
      { status: 'Interview Scheduled', date: '2026-08-27', note: 'Technical Interview conducted' },
      { status: 'Offer', date: '2026-09-02', note: 'Official Campus Offer Letter extended!' }
    ]
  },
  {
    id: 'app-4',
    jobId: 'job-4',
    jobTitle: 'Associate Technology Consultant',
    companyName: 'Deloitte',
    companyLogo: '🏢',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    studentRoll: '21BCSE104',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentSkills: ['Python', 'SQL', 'Communication'],
    status: 'Applied',
    appliedDate: '2026-09-01',
    matchScore: 78,
    interviewDetails: null,
    history: [
      { status: 'Applied', date: '2026-09-01', note: 'Application under review by university recruiting' }
    ]
  },
  {
    id: 'app-5',
    jobId: 'job-1',
    jobTitle: 'Software Development Engineer - I (Full Stack)',
    companyName: 'Razorpay',
    companyLogo: '💳',
    studentId: 'stu-102',
    studentName: 'Priya Nambiar',
    studentEmail: 'priya.n@campus.edu',
    studentRoll: '21BIT045',
    studentBranch: 'Information Technology',
    studentCgpa: 9.12,
    studentSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js'],
    status: 'Shortlisted',
    appliedDate: '2026-08-29',
    matchScore: 94,
    interviewDetails: null,
    history: [{ status: 'Applied', date: '2026-08-29', note: 'Applied' }, { status: 'Shortlisted', date: '2026-09-02', note: 'Shortlisted' }]
  },
  {
    id: 'app-6',
    jobId: 'job-1',
    jobTitle: 'Software Development Engineer - I (Full Stack)',
    companyName: 'Razorpay',
    companyLogo: '💳',
    studentId: 'stu-103',
    studentName: 'Rohan Gupta',
    studentEmail: 'rohan.g@campus.edu',
    studentRoll: '21BECE078',
    studentBranch: 'Electronics & Comm.',
    studentCgpa: 7.65,
    studentSkills: ['C++', 'Python', 'React', 'HTML/CSS'],
    status: 'Applied',
    appliedDate: '2026-09-02',
    matchScore: 68,
    interviewDetails: null,
    history: [{ status: 'Applied', date: '2026-09-02', note: 'Applied' }]
  },
  {
    id: 'app-7',
    jobId: 'job-1',
    jobTitle: 'Software Development Engineer - I (Full Stack)',
    companyName: 'Razorpay',
    companyLogo: '💳',
    studentId: 'stu-104',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.v@campus.edu',
    studentRoll: '21BCSE012',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.42,
    studentSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    status: 'Interview Scheduled',
    appliedDate: '2026-08-29',
    matchScore: 88,
    interviewDetails: {
      round: 'Technical Round 1',
      date: '2026-09-14',
      time: '02:00 PM IST',
      interviewer: 'Sameer Verma (Tech Lead)',
      meetLink: 'https://meet.google.com/xyz-razor-slot',
      notes: 'System architecture review and React live problem solving.'
    },
    history: [
      { status: 'Applied', date: '2026-08-29', note: 'Applied' },
      { status: 'Shortlisted', date: '2026-09-01', note: 'Shortlisted' },
      { status: 'Interview Scheduled', date: '2026-09-03', note: 'Interview set for Sep 14' }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Microsoft Campus Placement Drive — Phase 1 Schedule',
    category: 'Placement Drive',
    date: '2026-09-06',
    author: 'Prof. S. K. Verma (Head, Training & Placement Cell)',
    content: 'All shortlisted candidates for Microsoft Azure SDE-1 role are instructed to attend the pre-placement talk on Sep 10th at 10:00 AM in the Main Auditorium. Formal dress code and verified college ID are mandatory.',
    pinned: true,
    badge: 'Urgent'
  },
  {
    id: 'ann-2',
    title: 'Resume Freezing & Verification Deadline for Batch 2026',
    category: 'Policy & Rules',
    date: '2026-09-04',
    author: 'Placement Executive Office',
    content: 'Students must verify that their CGPA, backlog clearance certificates, and master resume are updated on HireLoop before Sep 15th, 11:59 PM. Profiles not verified will not be sent to visiting Day-1 MNCs.',
    pinned: true,
    badge: 'Important'
  },
  {
    id: 'ann-3',
    title: 'Amazon & Atlassian Winter Internship / FTE Pre-Assessments',
    category: 'Upcoming Drive',
    date: '2026-09-02',
    author: 'Placement Cell Technical Committee',
    content: 'HackerEarth online screening links will be triggered to eligible CSE/IT/ECE students on Saturday, Sep 13 at 7:00 PM. Mock assessments are available on the HireLoop AI Mock Interview section.',
    pinned: false,
    badge: 'Info'
  }
];

export const PLACEMENT_STATS = {
  totalStudents: 850,
  placedStudents: 612,
  placementPercentage: 72.0,
  totalCompaniesVisited: 48,
  highestPackage: '₹48.0 LPA (Google)',
  averagePackage: '₹12.8 LPA',
  medianPackage: '₹10.5 LPA',
  totalOffers: 742,
  multipleOffers: 130,
  branchStats: [
    { branch: 'Computer Science (CSE)', total: 240, placed: 218, percentage: 90.8, avgCpa: '₹15.4 LPA' },
    { branch: 'Information Technology (IT)', total: 180, placed: 158, percentage: 87.7, avgCpa: '₹14.1 LPA' },
    { branch: 'Electronics & Comm. (ECE)', total: 160, placed: 122, percentage: 76.2, avgCpa: '₹11.2 LPA' },
    { branch: 'Electrical Engg. (EE)', total: 110, placed: 70, percentage: 63.6, avgCpa: '₹8.9 LPA' },
    { branch: 'Mechanical Engg. (ME)', total: 100, placed: 58, percentage: 58.0, avgCpa: '₹8.2 LPA' },
    { branch: 'Civil Engg. (CE)', total: 60, placed: 31, percentage: 51.6, avgCpa: '₹7.5 LPA' }
  ]
};

export const INITIAL_STUDENTS_LIST = [
  {
    id: 'stu-101',
    name: 'Aarav Sharma',
    rollNumber: '21BCSE104',
    email: 'aarav.sharma@campus.edu',
    phone: '+91 98765 43210',
    branch: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 8.85,
    backlogs: 0,
    isVerified: true,
    isBlocked: false,
    placedCompany: 'Zomato',
    placedCtc: '₹18.5 LPA',
    offerStatus: 'Placed (Dream)',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Python'],
    applicationsCount: 4
  },
  {
    id: 'stu-102',
    name: 'Priya Nambiar',
    rollNumber: '21BIT045',
    email: 'priya.n@campus.edu',
    phone: '+91 98123 45678',
    branch: 'Information Technology',
    batch: '2026',
    cgpa: 9.12,
    backlogs: 0,
    isVerified: true,
    isBlocked: false,
    placedCompany: null,
    placedCtc: null,
    offerStatus: 'In Pipeline',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js'],
    applicationsCount: 3
  },
  {
    id: 'stu-103',
    name: 'Rohan Gupta',
    rollNumber: '21BECE078',
    email: 'rohan.g@campus.edu',
    phone: '+91 98345 67890',
    branch: 'Electronics & Comm.',
    batch: '2026',
    cgpa: 7.65,
    backlogs: 1,
    isVerified: true,
    isBlocked: false,
    placedCompany: null,
    placedCtc: null,
    offerStatus: 'In Pipeline',
    skills: ['C++', 'Python', 'React', 'Embedded C'],
    applicationsCount: 2
  },
  {
    id: 'stu-104',
    name: 'Ananya Verma',
    rollNumber: '21BCSE012',
    email: 'ananya.v@campus.edu',
    phone: '+91 98456 78901',
    branch: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 8.42,
    backlogs: 0,
    isVerified: true,
    isBlocked: false,
    placedCompany: null,
    placedCtc: null,
    offerStatus: 'Interviewing',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    applicationsCount: 3
  },
  {
    id: 'stu-105',
    name: 'Devendra Patel',
    rollNumber: '21BME034',
    email: 'devendra.p@campus.edu',
    phone: '+91 98567 89012',
    branch: 'Mechanical Engg.',
    batch: '2026',
    cgpa: 6.95,
    backlogs: 2,
    isVerified: false,
    isBlocked: false,
    placedCompany: null,
    placedCtc: null,
    offerStatus: 'Pending Verification',
    skills: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Python Basics'],
    applicationsCount: 1
  },
  {
    id: 'stu-106',
    name: 'Sneha Reddy',
    rollNumber: '21BEE056',
    email: 'sneha.r@campus.edu',
    phone: '+91 98678 90123',
    branch: 'Electrical Engg.',
    batch: '2026',
    cgpa: 8.70,
    backlogs: 0,
    isVerified: true,
    isBlocked: false,
    placedCompany: 'Deloitte',
    placedCtc: '₹12.0 LPA',
    offerStatus: 'Placed (Standard)',
    skills: ['Python', 'SQL', 'Power Systems', 'IoT'],
    applicationsCount: 3
  },
  {
    id: 'stu-107',
    name: 'Yash Vardhan',
    rollNumber: '21BCSE088',
    email: 'yash.v@campus.edu',
    phone: '+91 98789 01234',
    branch: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 8.10,
    backlogs: 0,
    isVerified: true,
    isBlocked: true,
    blockReason: 'Policy violation: Uninformed absence from Microsoft interview round.',
    placedCompany: null,
    placedCtc: null,
    offerStatus: 'Blocked',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    applicationsCount: 2
  },
  {
    id: 'stu-108',
    name: 'Tanvi Chawla',
    rollNumber: '21BIT099',
    email: 'tanvi.c@campus.edu',
    phone: '+91 98890 12345',
    branch: 'Information Technology',
    batch: '2026',
    cgpa: 9.45,
    backlogs: 0,
    isVerified: true,
    isBlocked: false,
    placedCompany: 'Microsoft',
    placedCtc: '₹30.0 LPA',
    offerStatus: 'Placed (Super Dream)',
    skills: ['C++', 'Python', 'Distributed Systems', 'Cloud Computing'],
    applicationsCount: 5
  }
];

export const INITIAL_DRIVES = [
  {
    id: 'drive-1',
    companyId: 'comp-2',
    companyName: 'Microsoft',
    companyLogo: '💻',
    roleTitle: 'Software Engineer (Cloud & Azure Services)',
    ctcDisplay: '₹28 - ₹32 LPA',
    currentPhase: 'Technical Round 1',
    phases: ['Pre-Placement Talk', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR & Offer'],
    scheduledDate: '2026-09-12',
    venue: 'Main Auditorium & Google Meet',
    eligibleCount: 142,
    shortlistedCount: 28,
    status: 'Live',
    tier: 'Super Dream'
  },
  {
    id: 'drive-2',
    companyId: 'comp-1',
    companyName: 'Razorpay',
    companyLogo: '💳',
    roleTitle: 'Software Development Engineer - I (Full Stack)',
    ctcDisplay: '₹18 - ₹22 LPA',
    currentPhase: 'Online Assessment',
    phases: ['Pre-Placement Talk', 'Online Assessment', 'Technical Interview', 'Executive Round', 'Offer Extension'],
    scheduledDate: '2026-09-15',
    venue: 'Campus Lab 4 & CodePair Virtual',
    eligibleCount: 210,
    shortlistedCount: 45,
    status: 'Live',
    tier: 'Dream'
  },
  {
    id: 'drive-3',
    companyId: 'comp-3',
    companyName: 'Zomato',
    companyLogo: '🍔',
    roleTitle: 'Backend Engineer - Platform & Growth',
    ctcDisplay: '₹16 - ₹20 LPA',
    currentPhase: 'Offer Extension',
    phases: ['Coding Test', 'Technical Round', 'HR Discussion', 'Offer Extension'],
    scheduledDate: '2026-08-30',
    venue: 'Campus Placement Office Room 102',
    eligibleCount: 120,
    shortlistedCount: 12,
    status: 'Completed',
    tier: 'Dream'
  },
  {
    id: 'drive-4',
    companyId: 'comp-4',
    companyName: 'Deloitte',
    companyLogo: '🏢',
    roleTitle: 'Associate Technology Consultant',
    ctcDisplay: '₹11 - ₹14 LPA',
    currentPhase: 'Pre-Placement Talk',
    phases: ['Pre-Placement Talk', 'Aptitude Test', 'Group Discussion', 'Personal Interview'],
    scheduledDate: '2026-09-22',
    venue: 'Campus Amphitheatre',
    eligibleCount: 480,
    shortlistedCount: 180,
    status: 'Upcoming',
    tier: 'Standard'
  }
];

export const INITIAL_ELIGIBILITY_POLICY = {
  minCgpa: 7.0,
  maxBacklogs: 0,
  eligibleBatch: '2026',
  allowedBranches: [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Comm.',
    'Electrical Engg.',
    'Mechanical Engg.',
    'Civil Engg.'
  ],
  allowMultipleOffers: true,
  dreamThreshold: 15.0,
  superDreamThreshold: 25.0,
  minAttendancePercentage: 75,
  resumeFreezeDate: '2026-09-15'
};

export const INITIAL_FRAUD_ALERTS = [
  {
    id: 'alert-1',
    type: 'Dual Offer Policy Breach',
    studentName: 'Yash Vardhan',
    studentRoll: '21BCSE088',
    severity: 'High',
    description: 'Student attempted to apply for another Dream drive after already securing placement, violating campus One-Student-One-Dream policy.',
    timestamp: '2026-09-08 14:30',
    status: 'Under Investigation'
  },
  {
    id: 'alert-2',
    type: 'CGPA Discrepancy Flag',
    studentName: 'Devendra Patel',
    studentRoll: '21BME034',
    severity: 'Critical',
    description: 'Student declared 7.80 CGPA on application profile, but college ERP academic database records 6.95 CGPA with 2 active backlogs.',
    timestamp: '2026-09-07 10:15',
    status: 'Action Required'
  },
  {
    id: 'alert-3',
    type: 'Proxy Assessment Warning',
    studentName: 'Rohan Gupta',
    studentRoll: '21BECE078',
    severity: 'Medium',
    description: 'HackerEarth assessment session detected multi-device IP hopping during live coding assessment.',
    timestamp: '2026-09-05 19:42',
    status: 'Resolved (Cleared with Warning)'
  }
];

export const INITIAL_TPO_STAFF = [
  {
    id: 'staff-1',
    name: 'Prof. S. K. Verma',
    role: 'Dean / Head of Placement Directorate',
    email: 'skverma@campus.edu',
    phone: '+91 98111 22334',
    department: 'Central TPO Office',
    accessLevel: 'Super Admin',
    permissions: ['All Permissions', 'Company Approvals', 'Job Approvals', 'Policy Editing', 'Report Generation']
  },
  {
    id: 'staff-2',
    name: 'Dr. Radhika Sen',
    role: 'Assistant TPO Officer',
    email: 'radhika.sen@campus.edu',
    phone: '+91 98222 33445',
    department: 'Circuit Branches (CSE/IT/ECE)',
    accessLevel: 'TPO Staff',
    permissions: ['Student Verification', 'Drive Management', 'Interview Scheduling', 'Announcements']
  },
  {
    id: 'staff-3',
    name: 'Amit Chaurasia',
    role: 'Senior Student Placement Coordinator',
    email: 'amit.spc@campus.edu',
    phone: '+91 98333 44556',
    department: 'Student Placement Team',
    accessLevel: 'Placement Coordinator',
    permissions: ['Drive Logistics', 'Attendance Tracking', 'Interview Room Allocation']
  }
];

export const INITIAL_NOTIFICATIONS = [
  // Student Notifications
  {
    id: 'notif-s-1',
    role: 'student',
    title: 'Interview Scheduled — Razorpay',
    message: 'Technical Round 1 scheduled for Sep 14, 02:00 PM IST with Sameer Verma. Google Meet link is active in your applications card.',
    type: 'success',
    category: 'interview',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    actionTarget: { role: 'student', tab: 'applications' }
  },
  {
    id: 'notif-s-2',
    role: 'student',
    title: 'Application Shortlisted — Swiggy',
    message: 'Your profile has cleared round 1 screening for Associate Software Engineer (₹16 LPA). Online test link will be enabled shortly.',
    type: 'info',
    category: 'application',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    actionTarget: { role: 'student', tab: 'applications' }
  },
  {
    id: 'notif-s-3',
    role: 'student',
    title: 'New Placement Drive — Microsoft',
    message: 'Microsoft Campus Placement Drive (Batch 2026) is officially announced! Pre-Placement Talk on Sep 10 in the Main Auditorium.',
    type: 'info',
    category: 'drive',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
    actionTarget: { role: 'student', tab: 'jobs' }
  },
  {
    id: 'notif-s-4',
    role: 'student',
    title: 'ATS Scanner Report Ready',
    message: 'Your Master Tech Resume scored 88/100 for Full Stack roles. 4 high-value keywords suggested.',
    type: 'info',
    category: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    actionTarget: { role: 'student', tab: 'resume-analyzer' }
  },

  // Recruiter Notifications
  {
    id: 'notif-r-1',
    role: 'recruiter',
    title: 'New Candidate Application',
    message: 'Ananya Verma (CGPA 8.42, CSE) applied for Software Development Engineer - I with match score of 88%.',
    type: 'info',
    category: 'application',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actionTarget: { role: 'recruiter', tab: 'applicants' }
  },
  {
    id: 'notif-r-2',
    role: 'recruiter',
    title: 'TPC Corporate Authorization Cleared',
    message: 'Placement Directorate Dean Prof. S. K. Verma verified your organization profile and recruitment authority.',
    type: 'success',
    category: 'approval',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    actionTarget: { role: 'recruiter', tab: 'dashboard' }
  },
  {
    id: 'notif-r-3',
    role: 'recruiter',
    title: 'Job Posting Approved & Live',
    message: 'Your job opening "Software Development Engineer - I (Full Stack)" is now approved by TPO and visible to 450+ eligible students.',
    type: 'success',
    category: 'approval',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actionTarget: { role: 'recruiter', tab: 'dashboard' }
  },

  // Admin / TPO Notifications
  {
    id: 'notif-a-1',
    role: 'admin',
    title: 'Pending Company Verification',
    message: 'Swiggy Recruitment Cell submitted corporate documentation for campus hiring approval.',
    type: 'warning',
    category: 'approval',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actionTarget: { role: 'admin', tab: 'approvals' }
  },
  {
    id: 'notif-a-2',
    role: 'admin',
    title: 'Pending Job Moderation',
    message: 'Uber Technologies posted "Product Analyst (₹22 LPA)" waiting for CTC clearance and branch eligibility check.',
    type: 'info',
    category: 'approval',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    actionTarget: { role: 'admin', tab: 'job-approvals' }
  },
  {
    id: 'notif-a-3',
    role: 'admin',
    title: 'Integrity Surveillance Alert',
    message: 'Dual-offer policy trigger: Candidate Sneha K. holds Dream Offer at Amazon and applied for Flipkart.',
    type: 'urgent',
    category: 'fraud',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actionTarget: { role: 'admin', tab: 'fraud-monitor' }
  },
  {
    id: 'notif-a-4',
    role: 'admin',
    title: 'Drive Progression — Microsoft',
    message: 'Online Coding Test completed: 42 candidates met cut-off and advanced to Technical Interview stage.',
    type: 'success',
    category: 'drive',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    actionTarget: { role: 'admin', tab: 'drives' }
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'asm-1',
    title: 'Razorpay SDE-1 Campus Coding & Aptitude Challenge',
    description: 'Official screening round for SDE-1 (Full Stack) 2026 Batch. Tests algorithmic efficiency, core CS theory, and quantitative speed.',
    companyName: 'Razorpay',
    companyLogo: '💳',
    jobId: 'job-1',
    category: 'hybrid',
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 60,
    instructions: [
      'The assessment consists of 10 Core CS & Aptitude MCQs (20 marks) and 2 Algorithmic Coding Challenges (80 marks).',
      'Anti-cheating surveillance is active: full-screen exit or tab switching will trigger automated proctoring alerts.',
      'Max 3 proctoring warnings allowed before automatic test submission.',
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
        correctOption: 1,
        explanation: 'Speed = 240/24 = 10 m/s. Total distance = 240 + 650 = 890 m. Time = 890/10 = 89 seconds.',
        marks: 2
      },
      {
        id: 'mcq-2',
        category: 'Logical',
        question: 'In a certain code, "MONKEY" is written as "XDJMNL". How is "TIGER" written in that code?',
        options: ['QDFHS', 'SDFHS', 'SHFDQ', 'UJHFS'],
        correctOption: 0,
        explanation: 'Each letter is shifted by -1 and reversed in order.',
        marks: 2
      },
      {
        id: 'mcq-3',
        category: 'DBMS',
        question: 'Which normal form deals with removing multivalued dependencies (MVD)?',
        options: ['1NF', '2NF', '3NF', '4NF'],
        correctOption: 3,
        explanation: 'Fourth Normal Form (4NF) specifically eliminates multivalued dependencies.',
        marks: 2
      },
      {
        id: 'mcq-4',
        category: 'OS',
        question: 'Which of the following conditions is NOT required for a deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOption: 2,
        explanation: 'Deadlock requires Non-Preemption (processes cannot be forcefully deprived of allocated resources).',
        marks: 2
      },
      {
        id: 'mcq-5',
        category: 'Networks',
        question: 'What is the default TCP port used for Secure Shell (SSH)?',
        options: ['21', '22', '23', '80'],
        correctOption: 1,
        explanation: 'Port 22 is assigned for SSH remote administration.',
        marks: 2
      },
      {
        id: 'mcq-6',
        category: 'DSA',
        question: 'What is the worst-case search complexity of a Balanced Binary Search Tree (AVL Tree)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctOption: 1,
        explanation: 'AVL trees maintain height balance within ±1, guaranteeing O(log n) search time.',
        marks: 2
      },
      {
        id: 'mcq-7',
        category: 'DBMS',
        question: 'In ACID transaction properties, what does the "I" stand for?',
        options: ['Integrity', 'Isolation', 'Iteration', 'Indexing'],
        correctOption: 1,
        explanation: 'Isolation ensures concurrent transactions execute independently without mutual interference.',
        marks: 2
      },
      {
        id: 'mcq-8',
        category: 'OS',
        question: 'Belady’s anomaly occurs in which page replacement algorithm?',
        options: ['FIFO (First-In First-Out)', 'LRU (Least Recently Used)', 'Optimal Algorithm', 'LFU'],
        correctOption: 0,
        explanation: 'Under FIFO, increasing the number of page frames can unexpectedly increase page faults.',
        marks: 2
      },
      {
        id: 'mcq-9',
        category: 'Networks',
        question: 'How many packets are exchanged in a standard TCP connection handshake?',
        options: ['2-way handshake', '3-way handshake', '4-way handshake', '1 packet'],
        correctOption: 1,
        explanation: 'SYN, SYN-ACK, ACK comprise the 3-way handshake.',
        marks: 2
      },
      {
        id: 'mcq-10',
        category: 'DSA',
        question: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree'],
        correctOption: 1,
        explanation: 'A FIFO Queue is used in Breadth-First Search graph traversal.',
        marks: 2
      }
    ],
    codingProblems: [
      {
        id: 'code-1',
        title: 'Two Sum / Target Index Finder',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        inputFormat: 'An array nums and integer target, e.g. [2, 7, 11, 15], 9',
        outputFormat: 'Array of two indices, e.g. [0, 1]',
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
            explanation: 'Duplicate value edge case.'
          },
          {
            input: '[-1, -2, -3, -4, -5], -8',
            expectedOutput: '[2, 4]',
            isHidden: true,
            explanation: 'Negative integer array.'
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
    id: 'asm-2',
    title: 'Microsoft Azure Cloud & Systems Architecture Test',
    description: 'Technical screening round assessing distributed microservices, Linux process management, and interval algorithms.',
    companyName: 'Microsoft',
    companyLogo: '💻',
    jobId: 'job-2',
    category: 'hybrid',
    durationMinutes: 45,
    totalMarks: 60,
    passingMarks: 40,
    instructions: [
      'Assessment consists of 2 Advanced Systems MCQs (10 marks) and 1 Interval Algorithm Problem (50 marks).',
      'Browser tab changes and window minimizations are tracked.'
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
        explanation: 'Many-to-Many multiplexes many user threads to an appropriate number of kernel threads.',
        marks: 5
      },
      {
        id: 'ms-mcq-2',
        category: 'Networks',
        question: 'In DNS, which record type maps a domain name directly to an IPv6 address?',
        options: ['A Record', 'AAAA Record', 'CNAME Record', 'MX Record'],
        correctOption: 1,
        explanation: 'AAAA records map hostnames to 128-bit IPv6 addresses.',
        marks: 5
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
        inputFormat: '2D array of intervals, e.g. [[1,3],[2,6],[8,10],[15,18]]',
        outputFormat: 'Merged 2D array, e.g. [[1,6],[8,10],[15,18]]',
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
            explanation: 'Intervals [1,3] and [2,6] overlap and are merged into [1,6].'
          },
          {
            input: '[[1,4],[4,5]]',
            expectedOutput: '[[1,5]]',
            isHidden: false,
            explanation: 'Intervals [1,4] and [4,5] touch at 4.'
          },
          {
            input: '[[1,4],[2,3]]',
            expectedOutput: '[[1,4]]',
            isHidden: true,
            explanation: 'Subsumed interval.'
          }
        ],
        marks: 50
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-1',
    assessmentId: 'asm-2',
    assessmentTitle: 'Microsoft Azure Cloud & Systems Architecture Test',
    companyName: 'Microsoft',
    companyLogo: '💻',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    totalScore: 55,
    maxScore: 60,
    percentage: 92,
    passed: true,
    status: 'completed',
    submittedAt: '2026-08-25T11:45:00.000Z',
    mcqScore: 10,
    codingScore: 45,
    violationsCount: 0,
    codingSubmissions: [
      {
        problemId: 'ms-code-1',
        title: 'Merge Overlapping Intervals',
        testsPassed: 3,
        totalTests: 3,
        status: 'Accepted',
        score: 45
      }
    ]
  }
];


