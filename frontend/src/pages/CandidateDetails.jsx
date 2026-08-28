import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CandidateDetails() {
  const { id } = useParams();

  const [screening, setScreening] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /* ========================================
         GET SCREENING
      ======================================== */

      const screeningResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/screenings`,
        {
          headers,
        }
      );

      if (screeningResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const screeningData = await screeningResponse.json();

      if (!screeningResponse.ok) {
        setError(
          screeningData.message ||
            "Unable to load screening details."
        );
        return;
      }

      const selectedScreening = screeningData.find(
        (item) => item._id === id
      );

      if (!selectedScreening) {
        setError("Screening result not found.");
        return;
      }

      setScreening(selectedScreening);

      /* ========================================
         GET RESUME
      ======================================== */

      const resumeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resumes`,
        {
          headers,
        }
      );

      if (resumeResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const resumeData = await resumeResponse.json();

      if (resumeResponse.ok && Array.isArray(resumeData)) {
        const selectedResume = resumeData.find(
          (item) =>
            item._id === selectedScreening.resumeId
        );

        setResume(selectedResume || null);
      }
    } catch (err) {
      console.error(
        "Candidate details error:",
        err
      );

      setError(
        "Unable to load candidate details."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <div className="candidate-page">
        <div className="candidate-loading">
          <div className="candidate-spinner"></div>

          <h2>
            Loading screening report...
          </h2>

          <p>
            Please wait while we prepare the
            candidate details.
          </p>
        </div>
      </div>
    );
  }

  /* ========================================
     ERROR
  ======================================== */

  if (error || !screening) {
    return (
      <div className="candidate-page">
        <div className="candidate-error-card">

          <div className="candidate-error-icon">
            !
          </div>

          <h2>
            {error || "Candidate not found."}
          </h2>

          <p>
            We couldn't load this screening
            result.
          </p>

          <Link
            to="/dashboard"
            className="candidate-primary-button"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  const matchedSkills =
    Array.isArray(screening.matchedSkills)
      ? screening.matchedSkills
      : [];

  const missingSkills =
    Array.isArray(screening.missingSkills)
      ? screening.missingSkills
      : [];

  const matchScore = Number(
    screening.matchScore || 0
  );

  const recommendation =
    screening.recommendation ||
    "Review";

  const recommendationClass =
    recommendation
      .toLowerCase()
      .replace(/\s+/g, "-");

  /* ========================================
     PAGE
  ======================================== */

  return (
    <div className="candidate-page">

      {/* ==================================
          HEADER
      ================================== */}

      <header className="candidate-header">

        <Link
          to="/dashboard"
          className="candidate-back-link"
        >
          ← Back to Dashboard
        </Link>

        <div className="candidate-header-content">

          <div>
            <span className="candidate-eyebrow">
              SCREENING REPORT
            </span>

            <h1>
              Candidate Details
            </h1>

            <p>
              Detailed analysis of the resume
              against the selected job requirements.
            </p>
          </div>

          <div className="candidate-report-status">
            <span className="status-dot"></span>
            Analysis Complete
          </div>

        </div>

      </header>


      {/* ==================================
          CANDIDATE SUMMARY
      ================================== */}

      <section className="candidate-summary-card">

        <div className="candidate-avatar">
          {(
            screening.candidateName ||
            "C"
          )
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="candidate-summary-info">

          <span>
            CANDIDATE
          </span>

          <h2>
            {screening.candidateName ||
              "Candidate"}
          </h2>

          <p>
            Evaluated for
            {" "}
            <strong>
              {screening.jobTitle ||
                "Selected Job"}
            </strong>
          </p>

        </div>

        <div className="candidate-summary-score">

          <span>
            MATCH SCORE
          </span>

          <strong>
            {matchScore}%
          </strong>

        </div>

      </section>


      {/* ==================================
          MAIN GRID
      ================================== */}

      <section className="candidate-main-grid">

        {/* SCORE CARD */}

        <div className="candidate-panel score-panel">

          <div className="panel-heading">

            <div>
              <span>
                OVERVIEW
              </span>

              <h2>
                Match Analysis
              </h2>
            </div>

            <div className="score-mini-icon">
              %
            </div>

          </div>


          <div className="large-score">

            <div
              className="score-ring"
              style={{
                "--score":
                  `${matchScore * 3.6}deg`,
              }}
            >
              <div className="score-ring-inner">
                <strong>
                  {matchScore}%
                </strong>

                <span>
                  Match
                </span>
              </div>
            </div>

          </div>


          <div className="score-progress">

            <div className="score-progress-label">

              <span>
                Compatibility
              </span>

              <strong>
                {matchScore}%
              </strong>

            </div>

            <div className="score-progress-track">

              <div
                className="score-progress-fill"
                style={{
                  width:
                    `${Math.min(
                      Math.max(
                        matchScore,
                        0
                      ),
                      100
                    )}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* RECOMMENDATION */}

        <div className="candidate-panel recommendation-panel">

          <div className="panel-heading">

            <div>
              <span>
                SCREENING DECISION
              </span>

              <h2>
                Recommendation
              </h2>
            </div>

          </div>


          <div
            className={`recommendation-result ${recommendationClass}`}
          >

            <div className="recommendation-icon">
              ✓
            </div>

            <div>

              <strong>
                {recommendation}
              </strong>

              <p>
                Based on the current resume
                and job requirements.
              </p>

            </div>

          </div>


          <div className="recommendation-note">

            <span>
              AI Screening Insight
            </span>

            <p>
              The recommendation is generated
              from the candidate's skill match
              against the selected job.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================
          SKILLS
      ================================== */}

      <section className="candidate-skills-grid">

        {/* MATCHED SKILLS */}

        <div className="candidate-panel skills-panel">

          <div className="skills-panel-header">

            <div>

              <span className="matched-label">
                MATCHED
              </span>

              <h2>
                Matched Skills
              </h2>

            </div>

            <div className="skill-count matched-count">
              {matchedSkills.length}
            </div>

          </div>


          {matchedSkills.length > 0 ? (

            <div className="candidate-skill-list">

              {matchedSkills.map(
                (skill, index) => (
                  <span
                    className="candidate-skill matched"
                    key={index}
                  >
                    <span>✓</span>
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <div className="no-skills-state">
              No matched skills found.
            </div>

          )}

        </div>


        {/* MISSING SKILLS */}

        <div className="candidate-panel skills-panel">

          <div className="skills-panel-header">

            <div>

              <span className="missing-label">
                GAP ANALYSIS
              </span>

              <h2>
                Missing Skills
              </h2>

            </div>

            <div className="skill-count missing-count">
              {missingSkills.length}
            </div>

          </div>


          {missingSkills.length > 0 ? (

            <div className="candidate-skill-list">

              {missingSkills.map(
                (skill, index) => (
                  <span
                    className="candidate-skill missing"
                    key={index}
                  >
                    <span>+</span>
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <div className="no-skills-state success">
              ✓ No major skill gaps detected.
            </div>

          )}

        </div>

      </section>


      {/* ==================================
          RESUME INFORMATION
      ================================== */}

      {resume && (

        <section className="candidate-panel resume-details-panel">

          <div className="panel-heading">

            <div>

              <span>
                RESUME
              </span>

              <h2>
                Resume Information
              </h2>

            </div>

          </div>


          <div className="resume-file-info">

            <div className="resume-file-icon">
              PDF
            </div>

            <div>

              <strong>
                {resume.originalName ||
                  "Resume.pdf"}
              </strong>

              <span>
                Uploaded resume
              </span>

            </div>

          </div>


          {resume.skills &&
            resume.skills.length > 0 && (

              <div className="resume-detected-skills">

                <span>
                  DETECTED SKILLS
                </span>

                <div>

                  {resume.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="detected-skill"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}

        </section>

      )}


      {/* ==================================
          EXTRACTED TEXT
      ================================== */}

      {resume?.extractedText && (

        <section className="candidate-panel extracted-text-panel">

          <div className="panel-heading">

            <div>

              <span>
                DOCUMENT ANALYSIS
              </span>

              <h2>
                Extracted Resume Content
              </h2>

            </div>

          </div>


          <div className="extracted-text-box">
            {resume.extractedText}
          </div>

        </section>

      )}


      {/* ==================================
          FOOTER ACTION
      ================================== */}

      <div className="candidate-footer">

        <Link
          to="/screen-resume"
          className="candidate-secondary-button"
        >
          ← Screen Another Resume
        </Link>

        <Link
          to="/dashboard"
          className="candidate-primary-button"
        >
          Back to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default CandidateDetails;