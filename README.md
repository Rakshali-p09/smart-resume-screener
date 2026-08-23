# Smart Resume Screener

An AI-powered resume screening web application that helps analyze resumes against job requirements, identify matching and missing skills, and generate a candidate match score.

## 🚀 Project Overview

Smart Resume Screener is a full-stack web application developed as an internship project.

The system allows users to:

- Create and manage job requirements
- Upload candidate resumes
- Extract text from PDF resumes
- Detect technical skills from resumes
- Compare resume skills with job requirements
- Calculate a resume-job match score
- Identify matched and missing skills
- Generate a screening recommendation
- View detailed screening results

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Protected application routes

### 💼 Job Management
- Create new job positions
- Store job descriptions
- Define required skills
- Specify experience requirements
- View and search available jobs

### 📄 Resume Management
- Upload resumes in PDF format
- Extract resume text
- Detect technical skills
- Store resume information in MongoDB

### 🎯 Resume Screening
- Select a resume
- Select a job
- Compare required skills with detected resume skills
- Identify matched skills
- Identify missing skills
- Calculate match percentage
- Generate screening recommendations

### 📊 Candidate Analysis
- View candidate screening results
- Match score visualization
- Matched skill analysis
- Missing skill analysis
- Resume information
- Extracted resume content

## 🛠️ Technology Stack

### Frontend

- React.js
- React Router
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- PDF parsing

### Development Tools

- VS Code
- Git
- GitHub
- MongoDB Compass

## 🏗️ Project Structure

```text
smart-resume-screener/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Job.js
│   │   ├── Resume.js
│   │   ├── Screening.js
│   │   └── User.js
│   │
│   ├── utils/
│   │   └── skillExtractor.js
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
