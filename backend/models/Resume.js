const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    extractedText: {
      type: String,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

module.exports = Resume;