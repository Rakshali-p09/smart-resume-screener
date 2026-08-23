# Smart Resume Screener

An AI-powered resume screening web application that analyzes candidate resumes against job requirements, identifies matching and missing skills, calculates a compatibility score, and provides an AI-generated screening recommendation.

---

## 🎯 Objective

The objective of Smart Resume Screener is to intelligently parse resumes and compare candidate profiles with job descriptions.

The system helps recruiters:

- Upload PDF resumes
- Extract resume text
- Extract technical skills
- Create and manage job positions
- Compare resumes with job requirements
- Use Gemini AI for semantic resume-job matching
- Generate a compatibility score
- Identify matched and missing skills
- Analyze experience and education
- Generate strengths and concerns
- Provide a screening justification and recommendation
- Store screening results in MongoDB
- View candidate screening results through a web dashboard

---

# ✨ Features

## 1. User Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected backend APIs

## 2. Resume Upload

Recruiters can upload candidate resumes in PDF format.

The system:

1. Receives the PDF
2. Extracts text using `pdf-parse`
3. Extracts technical skills
4. Stores resume information in MongoDB

## 3. Skill Extraction

The system identifies technical skills from resume text.

Supported examples include:

- Java
- Python
- C
- C++
- JavaScript
- TypeScript
- HTML
- CSS
- React
- Node.js
- Express
- MongoDB
- MySQL
- SQL
- Git
- GitHub
- Spring Boot
- REST API
- Docker
- AWS
- Azure
- Machine Learning
- Data Structures
- Algorithms

## 4. Skill Normalization

Common variations of the same technology are treated as the same skill.

For example:

```text
Spring Boot
SpringBoot
spring-boot
spring boot
```

are treated as:

```text
Spring Boot
```

Similarly:

```text
React
React.js
ReactJS
```

and:

```text
Node.js
NodeJS
Node JS
```

are normalized before comparison.

## 5. Job Management

Recruiters can create jobs containing:

- Job title
- Job description
- Required skills
- Required experience

## 6. AI Resume Screening

Gemini AI compares:

```text
Candidate Resume
        +
Job Description
        +
Required Skills
        +
Required Experience
```

and generates:

- Match score
- Matched skills
- Missing skills
- Experience analysis
- Education analysis
- Strengths
- Concerns
- Justification
- Recommendation

## 7. Candidate Screening Dashboard

The dashboard displays:

- Candidate name
- Job position
- Match score
- Matched skills
- Missing skills
- Experience analysis
- Education analysis
- Strengths
- Concerns
- AI justification
- Recommendation

---

# 🧠 AI / LLM Integration

The project uses **Google Gemini** for AI-based resume screening.

The system sends the extracted resume information and job requirements to Gemini.

## AI Processing Flow

```text
                    RESUME
                       │
                       ▼
              PDF Text Extraction
                       │
                       ▼
               Skill Extraction
                       │
                       ▼
              Candidate Resume
                       │
                       │
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
 Job Description                Required Skills
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
                  GEMINI AI
                       │
                       ▼
             Semantic Comparison
                       │
                       ▼
              Structured JSON
                       │
                       ▼
                  MongoDB
                       │
                       ▼
             Screening Dashboard
```

---

# 🤖 LLM Prompt

Gemini is instructed to act as an expert technical recruiter and resume screening assistant.

The main prompt contains instructions such as:

```text
You are an expert technical recruiter and resume screening assistant.

Compare the candidate resume with the job description.

Your analysis must be based ONLY on the information provided.

Do not invent information.

Evaluate:

1. Technical skills
2. Relevant experience
3. Education
4. Projects and responsibilities
5. Overall suitability
```

## Skill Normalization

The prompt also instructs Gemini to recognize common variations.

```text
Spring Boot = SpringBoot = spring-boot = spring boot

Node.js = NodeJS = Node JS

React = React.js = ReactJS

JavaScript = JS

MongoDB = Mongo DB = Mongo

C++ = CPP
```

This prevents formatting differences from incorrectly causing a skill to be classified as missing.

## Match Score

The AI generates a score from 0–100.

| Score | Interpretation |
|---|---|
| 0–20 | Very Poor Match |
| 21–40 | Poor Match |
| 41–60 | Partial Match |
| 61–80 | Good Match |
| 81–100 | Excellent Match |

## Recommendation

The system uses:

```text
Strong Match
Good Match
Review
Low Match
```

---

# 📊 AI Output

Gemini returns structured JSON.

Example:

```json
{
  "matchScore": 82,
  "matchedSkills": [
    "Java",
    "SQL",
    "Spring Boot",
    "Git"
  ],
  "missingSkills": [
    "Docker"
  ],
  "experienceAnalysis": "The candidate has relevant software development experience.",
  "educationAnalysis": "The candidate has a relevant technical education background.",
  "strengths": [
    "Strong Java knowledge",
    "Good backend development skills",
    "Relevant project experience"
  ],
  "concerns": [
    "Docker experience is not clearly demonstrated"
  ],
  "justification": "The candidate matches most of the required technical skills and demonstrates relevant experience.",
  "recommendation": "Strong Match"
}
```

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────┐
│             React Frontend            │
│                                       │
│  Login                                │
│  Register                             │
│  Dashboard                            │
│  Resume Upload                        │
│  Job Management                       │
│  Resume Screening                     │
│  Candidate Details                    │
└───────────────────┬───────────────────┘
                    │
                    │ HTTP / REST API
                    ▼
┌───────────────────────────────────────┐
│          Node.js + Express            │
│                                       │
│  Authentication                       │
│  Resume Processing                    │
│  PDF Text Extraction                  │
│  Skill Extraction                     │
│  Job Management                       │
│  AI Screening                         │
└───────────────┬───────────┬───────────┘
                │           │
                │           │
                ▼           ▼
┌─────────────────────┐   ┌─────────────────────┐
│       MongoDB       │   │     Gemini AI       │
│                     │   │                     │
│ Users               │   │ Resume Analysis     │
│ Resumes             │   │ Job Comparison      │
│ Jobs                │   │ Semantic Matching   │
│ Screenings          │   │ AI Recommendation   │
└─────────────────────┘   └─────────────────────┘
```

---

# 🔄 Complete Application Workflow

```text
1. User Registration / Login
              ↓
2. Dashboard
              ↓
3. Create Job
              ↓
4. Upload Candidate Resume
              ↓
5. PDF Text Extraction
              ↓
6. Skill Extraction
              ↓
7. Select Resume + Job
              ↓
8. Click "Analyze Resume"
              ↓
9. Gemini AI Analysis
              ↓
10. Match Score + AI Analysis
              ↓
11. Save Screening Result
              ↓
12. Candidate Details
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- React Router
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs
- Multer
- pdf-parse

## Database

- MongoDB
- Mongoose

## AI

- Google Gemini API
- `@google/genai`

## Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB Compass

---

# 📁 Project Structure

```text
smart-resume-screener/
│
├── backend/
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Job.js
│   │   └── Screening.js
│   │
│   ├── utils/
│   │   └── skillExtractor.js
│   │
│   ├── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Jobs.jsx
│       │   ├── UploadResume.jsx
│       │   ├── ScreenResume.jsx
│       │   └── CandidateDetails.jsx
│       │
│       ├── App.jsx
│       └── App.css
│
├── .gitignore
└── README.md
```

> `.env` exists only locally inside `backend/` and must never be committed to GitHub.

---

# 🗄️ Database Design

The application uses MongoDB with four main collections.

## User

```text
User
├── name
├── email
└── password
```

## Resume

```text
Resume
├── userId
├── filename
├── originalName
├── extractedText
├── skills
└── timestamps
```

## Job

```text
Job
├── userId
├── title
├── description
├── requiredSkills
├── experience
└── timestamps
```

## Screening

```text
Screening
├── resumeId
├── jobId
├── candidateName
├── jobTitle
├── matchedSkills
├── missingSkills
├── matchScore
├── experienceAnalysis
├── educationAnalysis
├── strengths
├── concerns
├── justification
├── recommendation
└── timestamps
```

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Resume

### Upload Resume

```http
POST /api/resumes/upload
```

Authentication required.

### Get Resumes

```http
GET /api/resumes
```

Authentication required.

---

## Jobs

### Create Job

```http
POST /api/jobs
```

Authentication required.

### Get Jobs

```http
GET /api/jobs
```

Authentication required.

---

## Screening

### Analyze Resume

```http
POST /api/match
```

Authentication required.

Request:

```json
{
  "resumeId": "resume_id",
  "jobId": "job_id"
}
```

### Get Screening Results

```http
GET /api/screenings
```

Authentication required.

---

# 🔐 Environment Variables

Create the following file locally:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The `.env` file must never be pushed to GitHub.

The `.gitignore` contains:

```text
.env
.env.local
```

to prevent accidental API key exposure.

---

# 🚀 Installation and Setup

## 1. Clone the repository

```bash
git clone https://github.com/Rakshali-p09/smart-resume-screener.git
```

```bash
cd smart-resume-screener
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Configure Gemini

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the value with your actual Gemini API key.

Never commit this key to GitHub.

---

## 4. Start MongoDB

Make sure your local MongoDB server is running.

The application connects to:

```text
mongodb://localhost:27017/smartResumeDB
```

---

## 5. Start Backend

From the backend directory:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

---

## 6. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 7. Start Frontend

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# 🎯 Example Screening

Suppose a job requires:

```text
Java
Spring Boot
SQL
Git
Docker
```

and the resume contains:

```text
Java
SpringBoot
SQL
Git
React
```

The system can normalize:

```text
SpringBoot
```

to:

```text
Spring Boot
```

and generate:

```text
Matched Skills

✓ Java
✓ Spring Boot
✓ SQL
✓ Git
```

and:

```text
Missing Skills

✗ Docker
```

Gemini then evaluates the candidate's overall suitability using:

- Skills
- Experience
- Education
- Projects
- Job responsibilities
- Job description

rather than relying only on exact keyword matching.

---

# 🔒 Security

The application follows basic security practices:

- Passwords are hashed using bcrypt.
- Protected APIs use JWT authentication.
- Resume and job data are associated with the authenticated user.
- Gemini API key is stored in `.env`.
- `.env` is excluded using `.gitignore`.
- API keys are never hardcoded in source code.
- `node_modules` is excluded from GitHub.

---

# 📈 Evaluation Alignment

The project addresses the company's assignment requirements.

| Requirement | Implementation |
|---|---|
| PDF/Text Resume Input | PDF upload + `pdf-parse` |
| Resume Data Extraction | Text and skill extraction |
| Job Description | Job creation and storage |
| Backend API | Node.js + Express |
| Database | MongoDB + Mongoose |
| LLM | Google Gemini |
| Semantic Matching | Gemini-based resume/job analysis |
| Match Score | AI-generated 0–100 score |
| Matched Skills | AI-generated skill comparison |
| Missing Skills | AI-generated missing requirements |
| Justification | AI-generated explanation |
| Candidate Screening | React dashboard |
| GitHub | Repository with commits |
| README | Architecture + LLM prompt + setup |
| Demo | 2–3 minute application walkthrough |

---

# 🚧 Future Improvements

Possible future improvements include:

- DOC/DOCX resume support
- Advanced experience extraction
- Better education extraction
- Multiple candidate comparison
- Candidate ranking
- Recruiter filtering and sorting
- Email notifications
- Resume parsing using advanced NLP
- AI-generated interview questions
- Cloud deployment
- Role-based recruiter/admin access

---

# 👩‍💻 Author

**Rakshali Patidar**

B.Tech – Computer Science / Software Engineering

VIT-AP University

---

# 📌 Project Status

**Completed AI-powered resume screening prototype**

The system currently supports:

- User authentication
- PDF resume upload
- Resume text extraction
- Skill extraction
- Skill normalization
- Job creation
- Job management
- Gemini AI resume screening
- Match scoring
- Matched and missing skills
- Experience analysis
- Education analysis
- Strengths and concerns
- AI justification
- Candidate recommendation
- MongoDB storage
- Candidate screening dashboard
