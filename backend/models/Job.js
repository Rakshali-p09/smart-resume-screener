const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    requiredSkills: {
      type: [String],
      default: []
    },

    experience: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;