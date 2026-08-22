import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CandidateDetails() {

  const { id } = useParams();

  const [screening, setScreening] =
    useState(null);

  const [resume, setResume] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ========================================
  // FETCH CANDIDATE
  // ========================================

  useEffect(() => {

    fetchCandidateDetails();

  }, [id]);


  const fetchCandidateDetails =
    async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          window.location.href =
            "/login";

          return;

        }


        // ==================================
        // GET SCREENINGS
        // ==================================

        const screeningResponse =
          await fetch(
            "http://localhost:5000/api/screenings",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (
          screeningResponse.status ===
          401
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href =
            "/login";

          return;

        }


        const screenings =
          await screeningResponse.json();


        const selectedScreening =
          screenings.find(
            (item) =>
              item._id === id
          );


        if (!selectedScreening) {

          setError(
            "Candidate not found."
          );

          return;

        }


        setScreening(
          selectedScreening
        );


        // ==================================
        // GET RESUMES
        // ==================================

        const resumeResponse =
          await fetch(
            "http://localhost:5000/api/resumes",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (
          resumeResponse.status ===
          401
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href =
            "/login";

          return;

        }


        const resumes =
          await resumeResponse.json();


        const selectedResume =
          resumes.find(
            (item) =>
              item._id ===
              selectedScreening.resumeId
          );


        setResume(
          selectedResume
        );

      }

      catch (error) {

        console.error(
          "Candidate details error:",
          error
        );

        setError(
          "Unable to load candidate details."
        );

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="candidate-page">

        <h2>
          Loading candidate...
        </h2>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !screening) {

    return (

      <div className="candidate-page">

        <h2>
          {error ||
            "Candidate not found."}
        </h2>


        <Link to="/dashboard">

          <button>
            Back to Dashboard
          </button>

        </Link>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="candidate-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="candidate-header">

        <Link to="/dashboard">
          ← Back to Dashboard
        </Link>


        <h1>
          Candidate Details
        </h1>


        <p>
          Detailed resume screening result
        </p>

      </div>


      {/* ==================================
          CANDIDATE CARD
      ================================== */}

      <div className="candidate-card">

        <h2>
          {screening.candidateName}
        </h2>


        <p>

          Applied for:

          {" "}

          <strong>
            {screening.jobTitle}
          </strong>

        </p>

      </div>


      {/* ==================================
          SCORE
      ================================== */}

      <div className="score-card">

        <h2>
          Match Score
        </h2>


        <div className="score-number">

          {screening.matchScore}%

        </div>


        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width:
                `${screening.matchScore}%`
            }}
          />

        </div>

      </div>


      {/* ==================================
          RECOMMENDATION
      ================================== */}

      <div className="recommendation-card">

        <h2>
          Recommendation
        </h2>


        <div
          className={
            `recommendation ${
              screening.recommendation
                .toLowerCase()
            }`
          }
        >

          {screening.recommendation}

        </div>

      </div>


      {/* ==================================
          SKILLS
      ================================== */}

      <div className="skills-container">


        {/* MATCHED */}

        <div className="skills-card">

          <h2>
            Matched Skills
          </h2>


          {screening.matchedSkills.length >
          0 ? (

            <div className="skill-list">

              {screening.matchedSkills.map(
                (skill, index) => (

                  <span
                    className="matched-skill"
                    key={index}
                  >

                    ✓ {skill}

                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              No matched skills.
            </p>

          )}

        </div>


        {/* MISSING */}

        <div className="skills-card">

          <h2>
            Missing Skills
          </h2>


          {screening.missingSkills.length >
          0 ? (

            <div className="skill-list">

              {screening.missingSkills.map(
                (skill, index) => (

                  <span
                    className="missing-skill"
                    key={index}
                  >

                    ✗ {skill}

                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              No missing skills.
            </p>

          )}

        </div>

      </div>


      {/* ==================================
          RESUME TEXT
      ================================== */}

      {resume && (

        <div className="resume-card">

          <h2>
            Extracted Resume
          </h2>


          <div className="resume-text">

            {resume.extractedText}

          </div>

        </div>

      )}


      {/* ==================================
          BACK
      ================================== */}

      <div className="back-button">

        <Link to="/dashboard">

          <button>
            Back to Dashboard
          </button>

        </Link>

      </div>

    </div>

  );

}

export default CandidateDetails;