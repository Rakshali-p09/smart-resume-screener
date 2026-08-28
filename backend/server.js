require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { GoogleGenAI } = require("@google/genai");

// =====================================================
// MODELS
// =====================================================

const User = require("./models/User");
const Resume = require("./models/Resume");
const Job = require("./models/Job");
const Screening = require("./models/Screening");

// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require("./middleware/authMiddleware");

// =====================================================
// UTILITIES
// =====================================================

const extractSkills = require("./utils/skillExtractor");

// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// GEMINI CONFIGURATION
// =====================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// BASIC MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// MONGODB CONNECTION
// =====================================================
// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({

  storage:
    multer.memoryStorage(),

  fileFilter:
    (req, file, cb) => {

      if (
        file.mimetype ===
        "application/pdf"
      ) {

        cb(null, true);

      }

      else {

        cb(
          new Error(
            "Only PDF files are allowed"
          )
        );

      }

    }

});


// =====================================================
// TEST ROUTE
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.send(
      "Smart Resume Screener Backend is Running"
    );

  }
);


// =====================================================
// REGISTER
// =====================================================

app.post(
  "/api/auth/register",

  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;


      console.log(
        "-----------------------------------"
      );

      console.log(
        "Registration request received"
      );


      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Name, email and password are required"

        });

      }


      if (
        password.length < 6
      ) {

        return res.status(400).json({

          message:
            "Password must be at least 6 characters"

        });

      }


      const existingUser =
        await User.findOne({

          email:
            email.toLowerCase()

        });


      if (existingUser) {

        return res.status(400).json({

          message:
            "User with this email already exists"

        });

      }


      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      const newUser =
        new User({

          name:
            name,

          email:
            email.toLowerCase(),

          password:
            hashedPassword

        });


      const savedUser =
        await newUser.save();


      console.log(
        "User registered successfully!"
      );


      res.status(201).json({

        message:
          "Registration successful",

        user: {

          id:
            savedUser._id,

          name:
            savedUser.name,

          email:
            savedUser.email

        }

      });

    }

    catch (error) {

      console.error(
        "Registration error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error during registration",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// LOGIN
// =====================================================

app.post(
  "/api/auth/login",

  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      console.log(
        "-----------------------------------"
      );

      console.log(
        "Login request received"
      );


      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Email and password are required"

        });

      }


      const user =
        await User.findOne({

          email:
            email.toLowerCase()

        });


      if (!user) {

        return res.status(401).json({

          message:
            "Invalid email or password"

        });

      }


      const passwordMatch =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!passwordMatch) {

        return res.status(401).json({

          message:
            "Invalid email or password"

        });

      }


      const token =
        jwt.sign(

          {

            userId:
              user._id,

            email:
              user.email

          },

          "smart_resume_secret_key",

          {

            expiresIn:
              "1d"

          }

        );


      console.log(
        "Login successful!"
      );


      res.status(200).json({

        message:
          "Login successful",

        token:
          token,

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email

        }

      });

    }

    catch (error) {

      console.error(
        "Login error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error during login",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// UPLOAD RESUME
// =====================================================

app.post(

  "/api/resumes/upload",

  authMiddleware,

  upload.single("resume"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          message:
            "No resume uploaded"

        });

      }


      console.log(
        "-----------------------------------"
      );

      console.log(
        "Authenticated user:",
        req.user.userId
      );


      console.log(
        "File received:",
        req.file.originalname
      );


      console.log(
        "Extracting resume text..."
      );


      const pdfData =
        await pdfParse(
          req.file.buffer
        );


      const extractedText =
        pdfData.text;


      console.log(
        "Resume text extracted successfully"
      );


      const skills =
        extractSkills(
          extractedText
        );


      console.log(
        "Extracted skills:",
        skills
      );


      const newResume =
        new Resume({

          userId:
            req.user.userId,

          filename:
            req.file.originalname,

          originalName:
            req.file.originalname,

          extractedText:
            extractedText,

          skills:
            skills

        });


      const savedResume =
        await newResume.save();


      console.log(
        "Resume saved successfully!"
      );


      res.status(200).json({

        message:
          "Resume uploaded and saved successfully",

        resumeId:
          savedResume._id,

        filename:
          savedResume.filename,

        skills:
          savedResume.skills,

        text:
          savedResume.extractedText

      });

    }

    catch (error) {

      console.error(
        "Resume processing error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error processing resume",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// GET RESUMES
// =====================================================

app.get(

  "/api/resumes",

  authMiddleware,

  async (req, res) => {

    try {

      const resumes =
        await Resume.find({

          userId:
            req.user.userId

        })

        .sort({

          createdAt:
            -1

        });


      res.status(200).json(
        resumes
      );

    }

    catch (error) {

      console.error(
        "Error fetching resumes:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error fetching resumes",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// CREATE JOB
// =====================================================

app.post(

  "/api/jobs",

  authMiddleware,

  async (req, res) => {

    try {

      const {
        title,
        description,
        requiredSkills,
        experience
      } = req.body;


      console.log(
        "-----------------------------------"
      );

      console.log(
        "Job data received:",
        req.body
      );


      if (
        !title ||
        !description
      ) {

        return res.status(400).json({

          message:
            "Job title and description are required"

        });

      }


      if (!requiredSkills) {

        return res.status(400).json({

          message:
            "Required skills are required"

        });

      }


      let skillsArray;


      if (
        Array.isArray(
          requiredSkills
        )
      ) {

        skillsArray =
          requiredSkills

            .map(
              (skill) =>
                String(skill).trim()
            )

            .filter(Boolean);

      }

      else {

        skillsArray =
          String(
            requiredSkills
          )

            .split(",")

            .map(
              (skill) =>
                skill.trim()
            )

            .filter(Boolean);

      }


      const newJob =
        new Job({

          userId:
            req.user.userId,

          title:
            title,

          description:
            description,

          requiredSkills:
            skillsArray,

          experience:
            experience || ""

        });


      const savedJob =
        await newJob.save();


      console.log(
        "Job saved successfully!"
      );


      res.status(201).json({

        message:
          "Job created successfully",

        job:
          savedJob

      });

    }

    catch (error) {

      console.error(
        "Job creation error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error creating job",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// GET JOBS
// =====================================================

app.get(

  "/api/jobs",

  authMiddleware,

  async (req, res) => {

    try {

      const jobs =
        await Job.find({

          userId:
            req.user.userId

        })

        .sort({

          createdAt:
            -1

        });


      res.status(200).json(
        jobs
      );

    }

    catch (error) {

      console.error(
        "Error fetching jobs:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error fetching jobs",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// AI RESUME SCREENING
// =====================================================

app.post(

  "/api/match",

  authMiddleware,

  async (req, res) => {

    try {

      const {
        resumeId,
        jobId
      } = req.body;


      console.log(
        "-----------------------------------"
      );

      console.log(
        "AI RESUME SCREENING REQUEST"
      );


      // =========================================
      // VALIDATE REQUEST
      // =========================================

      if (
        !resumeId ||
        !jobId
      ) {

        return res.status(400).json({

          message:
            "Resume ID and Job ID are required"

        });

      }


      // =========================================
      // CHECK GEMINI KEY
      // =========================================

      if (
        !process.env.GEMINI_API_KEY
      ) {

        return res.status(500).json({

          message:
            "Gemini API key is not configured"

        });

      }


      // =========================================
      // FIND RESUME
      // =========================================

      const resume =
        await Resume.findOne({

          _id:
            resumeId,

          userId:
            req.user.userId

        });


      if (!resume) {

        return res.status(404).json({

          message:
            "Resume not found"

        });

      }


      // =========================================
      // FIND JOB
      // =========================================

      const job =
        await Job.findOne({

          _id:
            jobId,

          userId:
            req.user.userId

        });


      if (!job) {

        return res.status(404).json({

          message:
            "Job not found"

        });

      }


      console.log(
        "Resume:",
        resume.originalName
      );


      console.log(
        "Job:",
        job.title
      );


      // =========================================
      // PREPARE DATA
      // =========================================

      const resumeText =
        resume.extractedText || "";


      const resumeSkills =
        Array.isArray(
          resume.skills
        )
          ? resume.skills
          : [];


      const jobDescription =
        job.description || "";


      const jobSkills =
        Array.isArray(
          job.requiredSkills
        )
          ? job.requiredSkills
          : [];


      const jobExperience =
        job.experience || "";


      // =========================================
      // GEMINI PROMPT
      // =========================================

      const prompt = `

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

SKILL NORMALIZATION:

Treat common formatting variations as the same skill.

Examples:

Spring Boot = SpringBoot = spring-boot = spring boot

Node.js = NodeJS = Node JS

React = React.js = ReactJS

JavaScript = JS

MongoDB = Mongo DB = Mongo

C++ = CPP

Do not consider a skill matched merely because it is conceptually related.

A skill should be matched when the resume provides evidence of that skill.

Missing skills must come from the job requirements.

MATCH SCORE:

0-20 = Very Poor Match
21-40 = Poor Match
41-60 = Partial Match
61-80 = Good Match
81-100 = Excellent Match

The recommendation must be one of:

"Strong Match"
"Good Match"
"Review"
"Low Match"

JOB TITLE:

${job.title}

JOB DESCRIPTION:

${jobDescription}

REQUIRED SKILLS:

${jobSkills.join(", ")}

REQUIRED EXPERIENCE:

${jobExperience}

EXTRACTED RESUME SKILLS:

${resumeSkills.join(", ")}

FULL RESUME TEXT:

${resumeText}

Return ONLY the requested JSON object.

`;


      // =========================================
      // CALL GEMINI
      // =========================================

      console.log(
        "Sending resume and job data to Gemini..."
      );


      const response =
        await ai.models.generateContent({

          model:
            "gemini-3.6-flash",

          contents:
            prompt,

          config: {

            responseMimeType:
              "application/json",

            responseSchema: {

              type:
                "object",

              properties: {

                matchScore: {

                  type:
                    "number"

                },

                matchedSkills: {

                  type:
                    "array",

                  items: {

                    type:
                      "string"

                  }

                },

                missingSkills: {

                  type:
                    "array",

                  items: {

                    type:
                      "string"

                  }

                },

                experienceAnalysis: {

                  type:
                    "string"

                },

                educationAnalysis: {

                  type:
                    "string"

                },

                strengths: {

                  type:
                    "array",

                  items: {

                    type:
                      "string"

                  }

                },

                concerns: {

                  type:
                    "array",

                  items: {

                    type:
                      "string"

                  }

                },

                justification: {

                  type:
                    "string"

                },

                recommendation: {

                  type:
                    "string"

                }

              },

              required: [

                "matchScore",

                "matchedSkills",

                "missingSkills",

                "experienceAnalysis",

                "educationAnalysis",

                "strengths",

                "concerns",

                "justification",

                "recommendation"

              ]

            }

          }

        });


      console.log(
        "Gemini response received."
      );


      // =========================================
      // PARSE GEMINI RESULT
      // =========================================

      const aiResult =
        JSON.parse(
          response.text
        );


      // =========================================
      // VALIDATE SCORE
      // =========================================

      let matchScore =
        Number(
          aiResult.matchScore
        );


      if (
        Number.isNaN(
          matchScore
        )
      ) {

        matchScore = 0;

      }


      matchScore =
        Math.max(

          0,

          Math.min(

            100,

            Math.round(
              matchScore
            )

          )

        );


      // =========================================
      // SAFE ARRAYS
      // =========================================

      const matchedSkills =
        Array.isArray(
          aiResult.matchedSkills
        )
          ? aiResult.matchedSkills
          : [];


      const missingSkills =
        Array.isArray(
          aiResult.missingSkills
        )
          ? aiResult.missingSkills
          : [];


      const strengths =
        Array.isArray(
          aiResult.strengths
        )
          ? aiResult.strengths
          : [];


      const concerns =
        Array.isArray(
          aiResult.concerns
        )
          ? aiResult.concerns
          : [];


      // =========================================
      // TEXT RESULTS
      // =========================================

      const experienceAnalysis =
        aiResult.experienceAnalysis ||
        "";


      const educationAnalysis =
        aiResult.educationAnalysis ||
        "";


      const justification =
        aiResult.justification ||
        "";


      // =========================================
      // RECOMMENDATION
      // =========================================

      let recommendation =
        aiResult.recommendation ||
        "Review";


      const validRecommendations = [

        "Strong Match",

        "Good Match",

        "Review",

        "Low Match"

      ];


      if (
        !validRecommendations.includes(
          recommendation
        )
      ) {

        if (
          matchScore >= 81
        ) {

          recommendation =
            "Strong Match";

        }

        else if (
          matchScore >= 61
        ) {

          recommendation =
            "Good Match";

        }

        else if (
          matchScore >= 41
        ) {

          recommendation =
            "Review";

        }

        else {

          recommendation =
            "Low Match";

        }

      }


      // =========================================
      // SAVE SCREENING
      // =========================================

      const screening =
        new Screening({

          resumeId:
            resume._id,

          jobId:
            job._id,

          candidateName:
            resume.originalName,

          jobTitle:
            job.title,

          matchedSkills:
            matchedSkills,

          missingSkills:
            missingSkills,

          matchScore:
            matchScore,

          experienceAnalysis:
            experienceAnalysis,

          educationAnalysis:
            educationAnalysis,

          strengths:
            strengths,

          concerns:
            concerns,

          justification:
            justification,

          recommendation:
            recommendation

        });


      const savedScreening =
        await screening.save();


      console.log(
        "AI screening saved successfully!"
      );


      console.log(
        "Screening ID:",
        savedScreening._id
      );


      // =========================================
      // RESPONSE
      // =========================================

      res.status(200).json({

        screeningId:
          savedScreening._id,

        resumeId:
          resume._id,

        jobId:
          job._id,

        candidateName:
          resume.originalName,

        jobTitle:
          job.title,

        matchScore:
          matchScore,

        matchedSkills:
          matchedSkills,

        missingSkills:
          missingSkills,

        experienceAnalysis:
          experienceAnalysis,

        educationAnalysis:
          educationAnalysis,

        strengths:
          strengths,

        concerns:
          concerns,

        justification:
          justification,

        recommendation:
          recommendation

      });

    }

    catch (error) {

      console.error(
        "AI resume screening error:"
      );

      console.error(
        error
      );


      res.status(500).json({

        message:
          "Error during AI resume screening",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// GET SCREENINGS
// =====================================================

app.get(

  "/api/screenings",

  authMiddleware,

  async (req, res) => {

    try {

      const userResumes =
        await Resume.find({

          userId:
            req.user.userId

        })

        .select("_id");


      const resumeIds =
        userResumes.map(

          (resume) =>
            resume._id

        );


      const screenings =
        await Screening.find({

          resumeId: {

            $in:
              resumeIds

          }

        })

        .sort({

          createdAt:
            -1

        });


      console.log(
        "User screenings:",
        screenings.length
      );


      res.status(200).json(
        screenings
      );

    }

    catch (error) {

      console.error(
        "Error fetching screenings:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error fetching screenings",

        error:
          error.message

      });

    }

  }

);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Unhandled server error:"
    );

    console.error(error);


    res.status(500).json({

      message:
        error.message ||
        "Internal server error"

    });

  }
);


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});