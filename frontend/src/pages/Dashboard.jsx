import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {

  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [averageMatch, setAverageMatch] = useState(0);

  const [screenings, setScreenings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================

  useEffect(() => {

    fetchDashboardData();

  }, []);


  const fetchDashboardData = async () => {

    try {

      setLoading(true);
      setError("");


      // Get JWT token

      const token =
        localStorage.getItem("token");


      // If token doesn't exist

      if (!token) {

        window.location.href = "/login";

        return;

      }


      // ====================================
      // GET RESUMES
      // ====================================

      const resumeResponse = await fetch(
        "http://localhost:5000/api/resumes",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (resumeResponse.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const resumes =
        await resumeResponse.json();


      if (Array.isArray(resumes)) {

        setResumeCount(
          resumes.length
        );

      }


      // ====================================
      // GET JOBS
      // ====================================

      const jobResponse = await fetch(
        "http://localhost:5000/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (jobResponse.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const jobs =
        await jobResponse.json();


      if (Array.isArray(jobs)) {

        setJobCount(
          jobs.length
        );

      }


      // ====================================
      // GET SCREENINGS
      // ====================================

      const screeningResponse =
        await fetch(
          "http://localhost:5000/api/screenings",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


      if (screeningResponse.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;

      }


      const screeningData =
        await screeningResponse.json();


      if (Array.isArray(screeningData)) {

        setScreenings(
          screeningData
        );


        // ==================================
        // SHORTLISTED
        // ==================================

        const shortlisted =
          screeningData.filter(
            (screening) =>
              screening.recommendation ===
              "Shortlist"
          );


        setShortlistedCount(
          shortlisted.length
        );


        // ==================================
        // AVERAGE MATCH
        // ==================================

        if (screeningData.length > 0) {

          const totalScore =
            screeningData.reduce(
              (total, screening) =>
                total +
                Number(
                  screening.matchScore || 0
                ),
              0
            );


          const average =
            totalScore /
            screeningData.length;


          setAverageMatch(
            Math.round(average)
          );

        } else {

          setAverageMatch(0);

        }

      }

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

      setError(
        "Unable to load dashboard data."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";

  };


  // ========================================
  // USER
  // ========================================

  const userData =
    localStorage.getItem("user");

  let user = null;


  try {

    user = userData
      ? JSON.parse(userData)
      : null;

  } catch (error) {

    user = null;

  }


  // ========================================
  // UI
  // ========================================

  return (

    <div className="dashboard">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Smart Resume Screener
          </h1>

          <p>
            AI-powered resume screening and
            candidate matching
          </p>

        </div>


        <div className="user-section">

          {user && (

            <p>
              Welcome,{" "}
              <strong>
                {user.name}
              </strong>
            </p>

          )}


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* ====================================
          TITLE
      ==================================== */}

      <div className="dashboard-title">

        <h2>
          Recruiter Dashboard
        </h2>

        <p>
          Manage jobs, resumes and candidate
          screening.
        </p>

      </div>


      {/* ====================================
          ERROR
      ==================================== */}

      {error && (

        <p className="error-message">
          {error}
        </p>

      )}


      {/* ====================================
          STATISTICS
      ==================================== */}

      <div className="stats-container">


        <div className="stat-card">

          <h3>
            {loading
              ? "..."
              : resumeCount}
          </h3>

          <p>
            Total Resumes
          </p>

        </div>


        <div className="stat-card">

          <h3>
            {loading
              ? "..."
              : jobCount}
          </h3>

          <p>
            Total Jobs
          </p>

        </div>


        <div className="stat-card">

          <h3>
            {loading
              ? "..."
              : shortlistedCount}
          </h3>

          <p>
            Shortlisted
          </p>

        </div>


        <div className="stat-card">

          <h3>
            {loading
              ? "..."
              : `${averageMatch}%`}
          </h3>

          <p>
            Average Match
          </p>

        </div>

      </div>


      {/* ====================================
          QUICK ACTIONS
      ==================================== */}

      <div className="quick-actions">

        <h2>
          Quick Actions
        </h2>


        <div className="action-buttons">

          <Link to="/create-job">

            <button>
              Create New Job
            </button>

          </Link>


          <Link to="/upload-resume">

            <button>
              Upload Resume
            </button>

          </Link>


          <Link to="/screen-resume">

            <button>
              Screen Resume
            </button>

          </Link>

        </div>

      </div>


      {/* ====================================
          RECENT CANDIDATES
      ==================================== */}

      <div className="recent-candidates">

        <h2>
          Recent Candidates
        </h2>


        {loading ? (

          <p>
            Loading candidates...
          </p>

        ) : screenings.length === 0 ? (

          <div>

            <p>
              No candidates have been screened yet.
            </p>

            <Link to="/screen-resume">

              <button>
                Screen a Resume
              </button>

            </Link>

          </div>

        ) : (

          <div className="candidate-table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Candidate
                  </th>

                  <th>
                    Position
                  </th>

                  <th>
                    Match Score
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {screenings
                  .slice(0, 5)
                  .map((screening) => (

                    <tr
                      key={screening._id}
                    >

                      <td>

                        <Link
                          to={`/candidate/${screening._id}`}
                        >
                          {screening.candidateName}
                        </Link>

                      </td>


                      <td>
                        {screening.jobTitle}
                      </td>


                      <td>
                        <strong>
                          {screening.matchScore}%
                        </strong>
                      </td>


                      <td>

                        <span
                          className={
                            `status-${screening.recommendation
                              .toLowerCase()}`
                          }
                        >
                          {screening.recommendation}
                        </span>

                      </td>


                      <td>

                        <Link
                          to={`/candidate/${screening._id}`}
                        >

                          <button>
                            View
                          </button>

                        </Link>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ====================================
          FOOTER
      ==================================== */}

      <div className="dashboard-footer">

        <p>
          Smart Resume Screener
        </p>

      </div>

    </div>

  );

}

export default Dashboard;