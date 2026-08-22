import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ScreenResume() {

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedResume, setSelectedResume] =
    useState("");

  const [selectedJob, setSelectedJob] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ========================================
  // LOAD RESUMES AND JOBS
  // ========================================

  useEffect(() => {

    fetchResumes();
    fetchJobs();

  }, []);


  // ========================================
  // GET RESUMES
  // ========================================

  const fetchResumes = async () => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        window.location.href = "/login";

        return;

      }


      const response =
        await fetch(
          "http://localhost:5000/api/resumes",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const data =
        await response.json();


      if (Array.isArray(data)) {

        setResumes(data);

      } else {

        console.error(
          "Invalid resume data:",
          data
        );

      }

    } catch (error) {

      console.error(
        "Error fetching resumes:",
        error
      );

      setMessage(
        "Unable to load resumes."
      );

    }

  };


  // ========================================
  // GET JOBS
  // ========================================

  const fetchJobs = async () => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        window.location.href = "/login";

        return;

      }


      const response =
        await fetch(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const data =
        await response.json();


      if (Array.isArray(data)) {

        setJobs(data);

      } else {

        console.error(
          "Invalid job data:",
          data
        );

      }

    } catch (error) {

      console.error(
        "Error fetching jobs:",
        error
      );

      setMessage(
        "Unable to load jobs."
      );

    }

  };


  // ========================================
  // SCREEN RESUME
  // ========================================

  const handleScreening = async () => {

    setMessage("");
    setResult(null);


    if (!selectedResume) {

      setMessage(
        "Please select a resume."
      );

      return;

    }


    if (!selectedJob) {

      setMessage(
        "Please select a job."
      );

      return;

    }


    try {

      setLoading(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        window.location.href = "/login";

        return;

      }


      const response =
        await fetch(
          "http://localhost:5000/api/match",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body: JSON.stringify({

              resumeId:
                selectedResume,

              jobId:
                selectedJob

            })

          }
        );


      if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const data =
        await response.json();


      if (response.ok) {

        setResult(data);

      } else {

        setMessage(
          data.message ||
          "Screening failed."
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
  // UI
  // ========================================

  return (

    <div className="screen-resume-page">


      {/* HEADER */}

      <div>

        <Link to="/dashboard">
          ← Back to Dashboard
        </Link>

        <h1>
          Screen Resume
        </h1>

        <p>
          Compare a candidate's resume
          with a job.
        </p>

      </div>


      {/* ==================================
          SELECT RESUME
      ================================== */}

      <div className="form-group">

        <label>
          Select Resume
        </label>

        <select
          value={selectedResume}
          onChange={(e) =>
            setSelectedResume(
              e.target.value
            )
          }
        >

          <option value="">
            -- Select Resume --
          </option>


          {resumes.map(
            (resume) => (

              <option
                key={resume._id}
                value={resume._id}
              >
                {resume.originalName}
              </option>

            )
          )}

        </select>

      </div>


      {/* ==================================
          SELECT JOB
      ================================== */}

      <div className="form-group">

        <label>
          Select Job
        </label>

        <select
          value={selectedJob}
          onChange={(e) =>
            setSelectedJob(
              e.target.value
            )
          }
        >

          <option value="">
            -- Select Job --
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

      </div>


      {/* ==================================
          SCREEN BUTTON
      ================================== */}

      <button
        onClick={handleScreening}
        disabled={loading}
      >

        {loading
          ? "Screening..."
          : "Screen Resume"
        }

      </button>


      {/* MESSAGE */}

      {message && (

        <p className="error-message">
          {message}
        </p>

      )}


      {/* ==================================
          RESULT
      ================================== */}

      {result && (

        <div className="screening-result">

          <hr />

          <h2>
            Screening Result
          </h2>


          <h3>
            Candidate:
          </h3>

          <p>
            {result.candidateName}
          </p>


          <h3>
            Job:
          </h3>

          <p>
            {result.jobTitle}
          </p>


          <h1>
            Match Score:
            {" "}
            {result.matchScore}%
          </h1>


          {/* MATCHED SKILLS */}

          <h3>
            Matched Skills
          </h3>


          {result.matchedSkills.length >
          0 ? (

            <ul>

              {result.matchedSkills.map(
                (skill, index) => (

                  <li key={index}>
                    ✓ {skill}
                  </li>

                )
              )}

            </ul>

          ) : (

            <p>
              No matched skills.
            </p>

          )}


          {/* MISSING SKILLS */}

          <h3>
            Missing Skills
          </h3>


          {result.missingSkills.length >
          0 ? (

            <ul>

              {result.missingSkills.map(
                (skill, index) => (

                  <li key={index}>
                    ✗ {skill}
                  </li>

                )
              )}

            </ul>

          ) : (

            <p>
              No missing skills.
            </p>

          )}


          {/* RECOMMENDATION */}

          <h2>
            Recommendation:
            {" "}
            {result.recommendation}
          </h2>


          {/* CANDIDATE DETAILS */}

          {result.screeningId && (

            <Link
              to={`/candidate/${result.screeningId}`}
            >

              <button>
                View Full Candidate Details
              </button>

            </Link>

          )}

        </div>

      )}

    </div>

  );

}

export default ScreenResume;