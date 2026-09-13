# 🎓 RecruitLoop (HireLoop) — Next-Gen AI Campus Placement Suite

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20Gateway-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

> An end-to-end, enterprise-grade Campus Placement and Recruitment Automation Platform connecting **University TPO Directorates**, **Students**, and **Corporate Employers** with AI-driven intelligence, automated eligibility gates, digital hall tickets, and real-time analytics.

---

## 📑 Table of Contents
- [✨ Key Features by Portal](#-key-features-by-portal)
  - [👨‍🎓 Student Career Suite](#-student-career-suite)
  - [🏛️ University TPO Command Center](#️-university-tpo-command-center)
  - [💼 Recruiter Talent Portal](#-recruiter-talent-portal)
- [🧠 Core Architectural Highlights](#-core-architectural-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [🔑 Demo & Seed Credentials](#-demo--seed-credentials)
- [📡 Key API Endpoints](#-key-api-endpoints)
- [💳 Razorpay Payment Gateway](#-razorpay-payment-gateway)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features by Portal

### 👨‍🎓 Student Career Suite
* **Active Campus Drives & Digital Hall Tickets**: View on-campus drives, eligibility checks in real-time, register with 1 click, and generate a dynamic **Digital Placement Hall Ticket** complete with security pass codes and venue timings.
* **Interactive Online Assessment (OA) Sandbox**: Timed test environment with categorized aptitude and technical questions, multiple-choice sandboxing, real-time timer, and automated scorecard generation.
* **AI Resume ATS Analyzer**: Diagnostic tool powered by Google Gemini AI providing 0–100 ATS scores, keyword matching, format suggestions, and tailored improvement roadmaps.
* **AI Mock Interview Room**: Voice/Text simulated behavioral and technical rounds with real-time feedback, STAR methodology scoring, and improvement insights.
* **Job Board & AI Cover Letter Generator**: Filter company openings by tier, package, and domain. Auto-generate tailored cover letters aligned with the candidate's resume and job requirements.
* **Application Tracker & Digital Offer Letter Acceptance**: Kanban-style status tracker (Applied → OA → Technical → HR → Offered). View and digitally sign official corporate Offer Letters with celebratory animations.

---

### 🏛️ University TPO Command Center
* **Real-Time Analytics Dashboard**: Real, unmanipulated metrics tracking enrolled students, verified offers, overall placement percentage, NIRF-compliant median packages, and highest CTCs.
* **Institutional Eligibility Policy Gatekeeper**:
  * Configurable minimum CGPA, maximum backlogs, approved department whitelist, and multi-offer rules.
  * **Strict Institutional Precedence**: University policy strictly overrides lenient corporate cutoffs.
* **Academic Discipline Placement Matrix**: Live performance breakdowns per engineering branch (total enrolled, placed counts, placement rates, average CTCs).
* **AI Talent Matching & Direct HR Recommendations**:
  * Calculates real-time candidate match scores against job openings.
  * Direct "Recommend to HR" endorsement pipeline with persistent badges visible to recruiters.
* **Corporate & Job Approvals**: Multi-tier vetting system to approve or reject visiting companies and job postings before they go live on campus.
* **Accredited NIRF / NAAC Placement Reports**: Export live placement audit rosters to CSV with filters by branch, batch, and company tier.

---

### 💼 Recruiter Talent Portal
* **Job Posting & Entrance Fee Checkout**: Post openings with detailed eligibility cutoffs, CTC compensation structures, and built-in Razorpay checkout.
* **Corporate Candidate Pipeline**: Filter candidates by CGPA, branch, ATS score, and view candidates marked with the **⭐ TPO Recommended** endorsement badge.
* **Interview Scheduler & Live Virtual Interview Room**: Schedule technical and HR rounds, issue calendar invites, and launch interactive live interview rooms.
* **Digital Offer Extension**: Issue branded corporate Offer Letters with salary breakdown, joining location, and role terms directly to successful candidates.

---

## 🧠 Core Architectural Highlights

```
                       ┌───────────────────────────────┐
                       │  University TPO Directorate   │
                       │    (Global College Policy)    │
                       └───────────────┬───────────────┘
                                       │ (Strict Institutional Overrides)
                                       ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│       Corporate Partner      │              │      Student Candidate       │
│      (Company Criteria)      │              │      (Academic Profile)      │
└──────────────┬───────────────┘              └──────────────┬───────────────┘
               │                                             │
               └───────────────────────┬─────────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Synchronized Precedence      │
                      │       Eligibility Engine        │
                      └────────────────┬────────────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              ▼                                                 ▼
      [ PASSES CRITERIA ]                              [ RESTRICTED ]
• Digital Hall Ticket Issued                    • Clear College Policy Reasons
• 1-Click Apply Enabled                         • Apply Button Disabled
• Online Assessment Access                      • Blocked from Application
```

* **Synchronized Eligibility Precedence Engine**:
  $$\text{Effective Min CGPA} = \max(\text{Company Cutoff}, \text{College Policy Cutoff})$$
  $$\text{Effective Max Backlogs} = \min(\text{Company Backlogs}, \text{College Policy Backlogs})$$
  Ensures students cannot bypass institutional eligibility thresholds regardless of high employer compensation packages.
* **Persistent Notification System**: In-app notifications with persistent local storage and database sync for mark-as-read states.
* **Embedded Multi-Option Payment Gateway**: UPI (GPay, PhonePe, Paytm QR code), Debit/Credit Cards, and NetBanking via Razorpay.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, JWT, bcryptjs |
| **Database** | MongoDB (Local / Atlas) |
| **AI Engine** | Google Gemini Generative AI (`@google/genai` & REST) |
| **Payments** | Razorpay REST API & Embedded Checkout Gateway |
| **Authentication** | JWT Access & Refresh Token sessions, Google & GitHub OAuth |

---

## 📁 Repository Structure

```text
RecruitLoop/
├── Backend/                       # Express + MongoDB API Server
│   ├── config/                    # MongoDB, Passport & Auth configurations
│   ├── controllers/               # Route controllers (Admin, Drive, Job, AI, Auth, Payment)
│   ├── middleware/                # JWT Auth, Roles, Rate Limiting, Error Handlers
│   ├── models/                    # Mongoose Schemas (User, StudentProfile, Job, Drive, Policy...)
│   ├── routes/                    # Express REST endpoints (/api/auth, /api/drives, /api/payment...)
│   ├── services/                  # Eligibility gatekeeper, Gemini AI, Notification services
│   ├── app.js                     # Express app setup and middleware pipeline
│   └── server.js                  # HTTP server entry point (Port 5000)
│
├── Frontend/                      # React SPA with Vite & Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/             # TPO Dashboard, Reports, AI Intelligence, Eligibility Manager
│   │   │   ├── recruiter/         # Job Posting, Applicant Pipeline, Interview Scheduler
│   │   │   ├── student/           # Drives Portal, OA Sandbox, Resume AI, Job Board, Mock Interview
│   │   │   ├── auth/              # Login, Registration, Welcome Gate
│   │   │   └── common/            # Navbar, Notifications, PaymentModal, OfferLetterModal
│   │   ├── context/               # Global AppContext state store
│   │   ├── services/              # Axios API clients
│   │   ├── utils/                 # eligibilityHelper.js (Rule of Precedence)
│   │   └── App.jsx                # Core root router and view layout
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB**: Community Server running locally on `localhost:27017` or a MongoDB Atlas URI

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `Backend/.env` file:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/recruitloop

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_12345
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_67890
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini AI (Optional for AI Resume & Mock Interview)
GEMINI_API_KEY=your_gemini_api_key_here

# Razorpay Credentials (Test keys)
RAZORPAY_KEY_ID=rzp_test_5173HireLoop
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Admin Access Whitelist
ADMIN_EMAIL_WHITELIST=tpo@university.edu,admin@hireloop.io
```

Start the backend server:
```bash
# Start with auto-reload (nodemon)
npm run dev
```
Backend will be live at `http://localhost:5000`. Verify with `http://localhost:5000/api/health`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 🔑 Demo & Seed Credentials

You can test the platform instantly using the built-in demo profiles:

| Role | Username / Email | Password | Access Highlights |
|---|---|---|---|
| **👨‍🎓 Student** | `student@demo.com` | `password123` | Placement Drives, Hall Tickets, OA Round, Resume ATS, Job Applications |
| **🏛️ Admin / TPO** | `admin@demo.com` | `admin123` | Institutional Eligibility Policy, Placement Analytics, NIRF Reports, AI Matching |
| **💼 Recruiter** | `recruiter@demo.com` | `recruiter123` | Post Jobs, Razorpay Corporate Checkout, Talent Pipeline, Digital Offer Letters |

*(You can also use the **Quick Persona Switcher** in the top navigation bar to toggle roles without logging out).*

---

## 📡 Key API Endpoints

### Authentication & Profiles
* `POST /api/auth/register` — Register student or recruiter account
* `POST /api/auth/login` — Sign in and obtain JWT access + refresh tokens
* `GET  /api/auth/me` — Retrieve active session profile

### University Drives & Hall Tickets
* `GET  /api/drives` — List active campus drives with candidate counts
* `GET  /api/drives/:id` — Get drive details and candidate list
* `POST /api/drives/:id/register` — Register student with automated eligibility check
* `PATCH /api/drives/:id/phase` — Advance recruitment stage (PPT → OA → Tech → HR)

### Jobs & Applications
* `GET  /api/jobs` — Browse approved campus listings
* `POST /api/jobs` — Post a new job opportunity
* `POST /api/applications` — Submit application with synchronized eligibility check
* `GET  /api/applications/student` — Retrieve student's application history

### Institutional Policy & Admin Analytics
* `GET  /api/admin/stats` — Real-time placement and salary analytics
* `GET  /api/admin/eligibility-policy` — Fetch active University Directorate rules
* `PUT  /api/admin/eligibility-policy` — Publish updated placement policy
* `GET  /api/drives/reports/summary` — Generate NIRF/NAAC compliant placement audit

### Payments & Razorpay
* `GET  /api/payment/key` — Get public Razorpay Key ID
* `POST /api/payment/create-order` — Initialize Razorpay order with INR currency
* `POST /api/payment/verify` — Verify cryptographic HMAC-SHA256 signature

---

## 💳 Razorpay Payment Gateway

RecruitLoop incorporates an authentic, production-ready payment flow:
* **Embedded Razorpay Modal**: Accepts UPI QR Code, major cards (Visa, Mastercard, RuPay), and Indian NetBanking.
* **Instant In-App Key Configuration**: Easily provide your own API Key ID and Secret via the UI modal settings drawer.
* **Local Sandbox Mode**: Built-in developer testing mode for zero-cost offline workflow verification.

---

## 🤝 Contributing & License

Contributions are welcome! Please feel free to submit issues and Pull Requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by the RecruitLoop Engineering Team. Empowering university campuses and talent recruitment worldwide.</sub>
</div>
