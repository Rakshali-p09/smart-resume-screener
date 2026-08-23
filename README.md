# Smart Resume Screener

An AI-powered resume screening web application that analyzes candidate resumes against job requirements, identifies matching and missing skills, calculates a compatibility score, and provides an AI-generated screening recommendation.

---

## 📌 Project Overview

Smart Resume Screener is designed to help recruiters evaluate candidates more efficiently.

The application allows a recruiter to:

- Upload a candidate resume in PDF format
- Extract text and technical skills from the resume
- Create job positions with required skills and experience
- Compare a candidate resume with a selected job
- Use Gemini AI for semantic resume-job matching
- Generate a match score
- Identify matched and missing skills
- Analyze candidate experience and education
- Generate strengths, concerns, justification, and recommendation
- Store screening results in MongoDB
- View candidate screening results through a web dashboard

---

## 🎯 Objective

The main objective of the project is to intelligently parse resumes and compare candidate profiles with job requirements.

The system combines:

- Resume text extraction
- Skill extraction
- Skill normalization
- Database storage
- AI-based semantic matching
- Candidate screening visualization

This helps recruiters make faster and more consistent screening decisions.

---

## ✨ Key Features

### 1. User Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected backend APIs

### 2. Resume Upload

Recruiters can upload candidate resumes in PDF format.

The system:

1. Receives the PDF
2. Extracts text using `pdf-parse`
3. Extracts technical skills
4. Stores the resume information in MongoDB

### 3. Skill Extraction

The application automatically identifies technical skills from the extracted resume text.

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

### 4. Skill Normalization

The system handles common variations of the same technology.

Examples:

```text
Spring Boot
SpringBoot
spring-boot
spring boot
