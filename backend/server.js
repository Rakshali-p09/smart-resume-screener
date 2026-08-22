const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/User");
const Resume = require("./models/Resume");
const Job = require("./models/Job");
const Screening = require("./models/Screening");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Utilities
const extractSkills = require("./utils/skillExtractor");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());


// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect("mongodb://localhost:27017/smartResumeDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:");
    console.error(error);
  });


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }

  }
});


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.send(
    "Smart Resume Screener Backend is Running"
  );

});


// =====================================================
// REGISTER USER
// =====================================================

app.post("/api/auth/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    console.log("-----------------------------------");
    console.log("Registration request received");


    // Validation

    if (!name || !email || !password) {

      return res.status(400).json({
        message:
          "Name, email and password are required"
      });

    }


    if (password.length < 6) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });

    }


    // Check existing user

    const existingUser =
      await User.findOne({
        email: email.toLowerCase()
      });


    if (existingUser) {

      return res.status(400).json({
        message:
          "User with this email already exists"
      });

    }


    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // Create user

    const newUser = new User({

      name: name,

      email: email.toLowerCase(),

      password: hashedPassword

    });


    // Save user

    const savedUser =
      await newUser.save();


    console.log(
      "User registered successfully!"
    );

    console.log(
      "User ID:",
      savedUser._id
    );


    res.status(201).json({

      message:
        "Registration successful",

      user: {

        id: savedUser._id,

        name: savedUser.name,

        email: savedUser.email

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

});


// =====================================================
// LOGIN USER
// =====================================================

app.post("/api/auth/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    console.log("-----------------------------------");
    console.log("Login request received");


    // Validation

    if (!email || !password) {

      return res.status(400).json({

        message:
          "Email and password are required"

      });

    }


    // Find user

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


    // Check password

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


    // Create JWT

    const token =
      jwt.sign(

        {
          userId: user._id,
          email: user.email
        },

        "smart_resume_secret_key",

        {
          expiresIn: "1d"
        }

      );


    console.log(
      "Login successful!"
    );

    console.log(
      "User:",
      user.email
    );


    res.status(200).json({

      message:
        "Login successful",

      token:

        token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email

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

});


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


      console.log("-----------------------------------");

      console.log(
        "Authenticated user:",
        req.user.userId
      );

      console.log(
        "File received:"
      );

      console.log(
        req.file.originalname
      );


      // -----------------------------------------
      // Extract PDF text
      // -----------------------------------------

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


      // -----------------------------------------
      // Extract skills
      // -----------------------------------------

      const skills =
        extractSkills(
          extractedText
        );


      console.log(
        "Extracted skills:"
      );

      console.log(skills);


      // -----------------------------------------
      // Create Resume
      // -----------------------------------------

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


      // -----------------------------------------
      // Save Resume
      // -----------------------------------------

      console.log(
        "Saving resume to MongoDB..."
      );


      const savedResume =
        await newResume.save();


      console.log(
        "Resume saved successfully!"
      );


      console.log(
        "Resume ID:",
        savedResume._id
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
// GET USER'S RESUMES
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
          createdAt: -1
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


      console.log("-----------------------------------");

      console.log(
        "Authenticated user:",
        req.user.userId
      );

      console.log(
        "Job data received:"
      );

      console.log(req.body);


      // -----------------------------------------
      // Validation
      // -----------------------------------------

      if (!title || !description) {

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


      // -----------------------------------------
      // Convert skills string to array
      // -----------------------------------------

      const skillsArray =
        requiredSkills
          .split(",")
          .map(
            (skill) =>
              skill.trim()
          )
          .filter(
            (skill) =>
              skill !== ""
          );


      console.log(
        "Required skills:"
      );

      console.log(
        skillsArray
      );


      // -----------------------------------------
      // Create Job
      // -----------------------------------------

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


      // -----------------------------------------
      // Save Job
      // -----------------------------------------

      console.log(
        "Saving job to MongoDB..."
      );


      const savedJob =
        await newJob.save();


      console.log(
        "Job saved successfully!"
      );


      console.log(
        "Job ID:",
        savedJob._id
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
// GET USER'S JOBS
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
          createdAt: -1
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
// MATCH RESUME WITH JOB
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


      console.log("-----------------------------------");

      console.log(
        "MATCHING REQUEST"
      );

      console.log(
        "User ID:",
        req.user.userId
      );

      console.log(
        "Resume ID:",
        resumeId
      );

      console.log(
        "Job ID:",
        jobId
      );


      // -----------------------------------------
      // Find resume belonging to user
      // -----------------------------------------

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


      // -----------------------------------------
      // Find job belonging to user
      // -----------------------------------------

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


      // -----------------------------------------
      // Normalize skills
      // -----------------------------------------

      const normalizeSkill =
        (skill) => {

          const value =
            skill
              .toLowerCase()
              .trim();


          const aliases = {

            "react.js":
              "react",

            "reactjs":
              "react",

            "node":
              "node.js",

            "nodejs":
              "node.js",

            "js":
              "javascript",

            "html5":
              "html",

            "css3":
              "css",

            "mongo":
              "mongodb",

            "mongo db":
              "mongodb",

            "cpp":
              "c++",

            "rest":
              "rest api",

            "restful api":
              "rest api"

          };


          return (
            aliases[value] ||
            value
          );

        };


      // -----------------------------------------
      // Resume skills
      // -----------------------------------------

      const resumeSkills = [
        ...new Set(

          resume.skills.map(
            normalizeSkill
          )

        )
      ];


      // -----------------------------------------
      // Job skills
      // -----------------------------------------

      const jobSkills = [
        ...new Set(

          job.requiredSkills.map(
            normalizeSkill
          )

        )
      ];


      console.log(
        "Resume Skills:"
      );

      console.log(
        resumeSkills
      );


      console.log(
        "Job Skills:"
      );

      console.log(
        jobSkills
      );


      // -----------------------------------------
      // Matched skills
      // -----------------------------------------

      const matchedSkills =
        jobSkills.filter(
          (skill) =>
            resumeSkills.includes(
              skill
            )
        );


      // -----------------------------------------
      // Missing skills
      // -----------------------------------------

      const missingSkills =
        jobSkills.filter(
          (skill) =>
            !resumeSkills.includes(
              skill
            )
        );


      // -----------------------------------------
      // Match score
      // -----------------------------------------

      let matchScore = 0;


      if (jobSkills.length > 0) {

        matchScore =
          (
            matchedSkills.length /
            jobSkills.length
          ) * 100;

      }


      matchScore =
        Math.round(
          matchScore
        );


      // -----------------------------------------
      // Recommendation
      // -----------------------------------------

      let recommendation;


      if (matchScore >= 80) {

        recommendation =
          "Shortlist";

      }

      else if (matchScore >= 50) {

        recommendation =
          "Review";

      }

      else {

        recommendation =
          "Reject";

      }


      console.log("-----------------------------------");

      console.log(
        "Matched Skills:"
      );

      console.log(
        matchedSkills
      );


      console.log(
        "Missing Skills:"
      );

      console.log(
        missingSkills
      );


      console.log(
        "Match Score:",
        matchScore + "%"
      );


      console.log(
        "Recommendation:",
        recommendation
      );


      // -----------------------------------------
      // Save screening
      // -----------------------------------------

      console.log(
        "Saving screening result..."
      );


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

          recommendation:
            recommendation

        });


      const savedScreening =
        await screening.save();


      console.log(
        "Screening result saved successfully!"
      );


      console.log(
        "Screening ID:",
        savedScreening._id
      );


      // -----------------------------------------
      // Response
      // -----------------------------------------

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

        matchedSkills:
          matchedSkills,

        missingSkills:
          missingSkills,

        matchScore:
          matchScore,

        recommendation:
          recommendation

      });

    }

    catch (error) {

      console.error(
        "Matching error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Error matching resume with job",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// GET USER'S SCREENING RESULTS
// =====================================================

app.get(
  "/api/screenings",
  authMiddleware,

  async (req, res) => {

    try {

      // Get user's resumes
      const userResumes =
        await Resume.find({

          userId:
            req.user.userId

        }).select("_id");


      const resumeIds =
        userResumes.map(
          (resume) =>
            resume._id
        );


      // Get screenings related to
      // user's resumes

      const screenings =
        await Screening.find({

          resumeId: {
            $in: resumeIds
          }

        })
        .sort({
          createdAt: -1
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
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);