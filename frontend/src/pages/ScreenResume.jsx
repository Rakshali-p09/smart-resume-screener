import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ScreenResume() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // ========================================
  // LOAD RESUMES + JOBS
  // ========================================

  const fetchData = async () => {
    setPageLoading(true);

    await Promise.all([
      fetchResumes(),
      fetchJobs(),
    ]);

    setPageLoading(false);
  };

  // ========================================
  // GET RESUMES
  // ========================================

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resumes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setResumes(data);
      } else {
        setMessage(
          data.message || "Unable to load resumes."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching resumes:",
        error
      );

      setMessage("Unable to load resumes.");
    }
  };

  // ========================================
  // GET JOBS
  // ========================================

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setMessage(
          data.message || "Unable to load jobs."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error
      );

      setMessage("Unable to load jobs.");
    }
  };

  // ========================================
  // SCREEN RESUME
  // ========================================

  const handleScreening = async () => {
    setMessage("");
    setResult(null);

    if (!selectedResume) {
      setMessage("Please select a resume.");
      return;
    }

    if (!selectedJob) {
      setMessage("Please select a job.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/match`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            resumeId: selectedResume,
            jobId: selectedJob,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setMessage(
          data.message || "Screening failed."
        );
      }
    } catch (error) {
      console.error(
        "Screening error:",
        error
      );

      setMessage(
        "Could not connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SELECTED DATA
  // ========================================

  const selectedResumeData =
    resumes.find(
      (resume) =>
        resume._id === selectedResume
    );

  const selectedJobData =
    jobs.find(
      (job) =>
        job._id === selectedJob
    );

  // ========================================
  // UI
  // ========================================

  return (
    <div className="screening-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="screening-header">

        <Link
          to="/dashboard"
          className="screening-back-link"
        >
          ← Back to Dashboard
        </Link>

        <div className="screening-title-row">

          <div className="screening-title-icon">
            ✦
          </div>

          <div>

            <p className="screening-label">
              AI RESUME SCREENING
            </p>

            <h1>
              Screen Resume
            </h1>

            <p>
              Compare a candidate's resume
              against job requirements using
              intelligent skill matching.
            </p>

          </div>

        </div>

      </div>


      {/* ==================================
          MAIN WORKSPACE
      ================================== */}

      <div className="screening-workspace">

        {/* ==================================
            STEP 1 — RESUME
        ================================== */}

        <section className="screening-card">

          <div className="screening-step">

            <div className="step-number">
              1
            </div>

            <div>

              <h2>
                Select Candidate Resume
              </h2>

              <p>
                Choose the resume you want
                to analyze.
              </p>

            </div>

          </div>


          <div className="screening-field">

            <label>
              Resume
            </label>

            <select
              value={selectedResume}
              onChange={(e) => {
                setSelectedResume(
                  e.target.value
                );
                setResult(null);
                setMessage("");
              }}
              disabled={pageLoading}
            >

              <option value="">
                {pageLoading
                  ? "Loading resumes..."
                  : "-- Select Resume --"}
              </option>

              {resumes.map(
                (resume) => (

                  <option
                    key={resume._id}
                    value={resume._id}
                  >
                    {resume.originalName ||
                      resume.name ||
                      "Unnamed Resume"}
                  </option>

                )
              )}

            </select>

            {resumes.length === 0 &&
              !pageLoading && (
                <small className="field-hint">
                  No resumes available. Upload
                  a resume first.
                </small>
              )}

          </div>


          {/* Selected Resume */}

          {selectedResumeData && (

            <div className="selected-item">

              <div className="selected-item-icon">
                📄
              </div>

              <div>

                <span>
                  Selected Resume
                </span>

                <strong>
                  {selectedResumeData.originalName ||
                    selectedResumeData.name ||
                    "Resume"}
                </strong>

              </div>

              <div className="selected-check">
                ✓
              </div>

            </div>

          )}

        </section>


        {/* ==================================
            STEP 2 — JOB
        ================================== */}

        <section className="screening-card">

          <div className="screening-step">

            <div className="step-number">
              2
            </div>

            <div>

              <h2>
                Select Job Position
              </h2>

              <p>
                Choose the job requirements
                to compare against.
              </p>

            </div>

          </div>


          <div className="screening-field">

            <label>
              Job Position
            </label>

            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(
                  e.target.value
                );
                setResult(null);
                setMessage("");
              }}
              disabled={pageLoading}
            >

              <option value="">
                {pageLoading
                  ? "Loading jobs..."
                  : "-- Select Job --"}
              </option>

              {jobs.map(
                (job) => (

                  <option
                    key={job._id}
                    value={job._id}
                  >
                    {job.title}
                  </option>

                )
              )}

            </select>

            {jobs.length === 0 &&
              !pageLoading && (
                <small className="field-hint">
                  No jobs available. Create a
                  job first.
                </small>
              )}

          </div>


          {/* Selected Job */}

          {selectedJobData && (

            <div className="selected-item">

              <div className="selected-item-icon job">
                💼
              </div>

              <div>

                <span>
                  Selected Position
                </span>

                <strong>
                  {selectedJobData.title}
                </strong>

              </div>

              <div className="selected-check">
                ✓
              </div>

            </div>

          )}

        </section>


        {/* ==================================
            SCREENING ACTION
        ================================== */}

        <section className="screening-action-card">

          <div className="ai-icon">
            ✦
          </div>

          <div className="screening-action-content">

            <h2>
              Ready to Analyze?
            </h2>

            <p>
              Our screening engine will compare
              skills and requirements to calculate
              a compatibility score.
            </p>

          </div>

          <button
            className="screening-button"
            onClick={handleScreening}
            disabled={
              loading ||
              !selectedResume ||
              !selectedJob
            }
          >

            {loading ? (
              <>
                <span className="screening-spinner" />
                Analyzing...
              </>
            ) : (
              <>
                ✦ Analyze Resume
              </>
            )}

          </button>

        </section>


        {/* ==================================
            MESSAGE
        ================================== */}

        {message && (

          <div className="screening-message">
            ⚠ {message}
          </div>

        )}


        {/* ==================================
            RESULT
        ================================== */}

        {result && (

          <section className="screening-result-card">

            {/* Result Header */}

            <div className="result-header">

              <div>

                <p className="result-label">
                  SCREENING COMPLETE
                </p>

                <h2>
                  Screening Result
                </h2>

                <p>
                  AI-powered comparison results
                  for the selected candidate.
                </p>

              </div>

              <div className="match-score">

                <span>
                  Match Score
                </span>

                <strong>
                  {result.matchScore}%
                </strong>

              </div>

            </div>


            {/* Candidate / Job */}

            <div className="result-summary">

              <div className="result-summary-item">

                <span>
                  Candidate
                </span>

                <strong>
                  {result.candidateName ||
                    "Unknown Candidate"}
                </strong>

              </div>

              <div className="result-summary-item">

                <span>
                  Job Position
                </span>

                <strong>
                  {result.jobTitle ||
                    "Unknown Position"}
                </strong>

              </div>

              <div className="result-summary-item">

                <span>
                  Recommendation
                </span>

                <strong
                  className={
                    `recommendation-${String(
                      result.recommendation ||
                        "Review"
                    ).toLowerCase()}`
                  }
                >
                  {result.recommendation ||
                    "Review"}
                </strong>

              </div>

            </div>


            {/* Skill Analysis */}

            <div className="skill-analysis">

              {/* Matched */}

              <div className="skill-analysis-card matched">

                <div className="analysis-title">

                  <div className="analysis-icon">
                    ✓
                  </div>

                  <div>

                    <h3>
                      Matched Skills
                    </h3>

                    <span>
                      Skills found in both
                      resume and job
                    </span>

                  </div>

                </div>


                <div className="analysis-tags">

                  {Array.isArray(
                    result.matchedSkills
                  ) &&
                  result.matchedSkills.length >
                    0 ? (

                    result.matchedSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="matched-tag"
                        >
                          ✓ {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="no-analysis">
                      No matched skills found.
                    </p>

                  )}

                </div>

              </div>


              {/* Missing */}

              <div className="skill-analysis-card missing">

                <div className="analysis-title">

                  <div className="analysis-icon">
                    !
                  </div>

                  <div>

                    <h3>
                      Missing Skills
                    </h3>

                    <span>
                      Required skills not found
                      in the resume
                    </span>

                  </div>

                </div>


                <div className="analysis-tags">

                  {Array.isArray(
                    result.missingSkills
                  ) &&
                  result.missingSkills.length >
                    0 ? (

                    result.missingSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="missing-tag"
                        >
                          + {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="no-analysis">
                      No missing skills.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* Candidate Details */}

            {result.screeningId && (

              <div className="result-footer">

                <p>
                  Want to see the complete
                  screening information?
                </p>

                <Link
                  to={`/candidate/${result.screeningId}`}
                  className="details-button"
                >
                  View Full Candidate Details →
                </Link>

              </div>

            )}

          </section>

        )}

      </div>

    </div>
  );
}

export default ScreenResume;