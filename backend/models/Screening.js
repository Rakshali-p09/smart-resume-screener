const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    candidateName: {
      type: String,
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    },

    matchedSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    matchScore: {
      type: Number,
      required: true
    },

    experienceAnalysis: {
      type: String,
      default: ""
    },

    educationAnalysis: {
      type: String,
      default: ""
    },

    strengths: {
      type: [String],
      default: []
    },

    concerns: {
      type: [String],
      default: []
    },

    justification: {
      type: String,
      default: ""
    },

    recommendation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Screening = mongoose.model(
  "Screening",
  screeningSchema
);

module.exports = Screening;