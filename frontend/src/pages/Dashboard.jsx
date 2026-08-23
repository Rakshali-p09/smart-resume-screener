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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resumeResponse.status === 401) {
        logout();
        return;
      }

      const resumes = await resumeResponse.json();

      if (Array.isArray(resumes)) {
        setResumeCount(resumes.length);
      }

      // ====================================
      // GET JOBS
      // ====================================

      const jobResponse = await fetch(
        "http://localhost:5000/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (jobResponse.status === 401) {
        logout();
        return;
      }

      const jobs = await jobResponse.json();

      if (Array.isArray(jobs)) {
        setJobCount(jobs.length);
      }

      // ====================================
      // GET SCREENINGS
      // ====================================

      const screeningResponse = await fetch(
        "http://localhost:5000/api/screenings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (screeningResponse.status === 401) {
        logout();
        return;
      }

      const screeningData =
        await screeningResponse.json();

      if (Array.isArray(screeningData)) {
        setScreenings(screeningData);

        // ==================================
        // SHORTLISTED
        // ==================================

        const shortlisted =
          screeningData.filter(
            (screening) =>
              screening.recommendation === "Shortlist"
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
  // EXTRA STATISTICS
  // ========================================

  const totalScreenings =
    screenings.length;

  const reviewCount =
    screenings.filter(
      (screening) =>
        screening.recommendation === "Review"
    ).length;

  const rejectedCount =
    screenings.filter(
      (screening) =>
        screening.recommendation === "Reject"
    ).length;

  // ========================================
  // UI
  // ========================================

  return (
    <div className="advanced-dashboard">

      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside className="dashboard-sidebar">

        {/* Brand */}

        <div className="sidebar-brand">

          <div className="brand-icon">
            SR
          </div>

          <div>
            <h2>
              Smart Resume
            </h2>

            <span>
              Screener
            </span>
          </div>

        </div>

        {/* Navigation */}

        <nav className="sidebar-nav">

          <p className="nav-label">
            WORKSPACE
          </p>

          {/* Dashboard */}

          <Link
            to="/dashboard"
            className="sidebar-link active"
          >
            <span>▦</span>
            Dashboard
          </Link>

          {/* Resumes */}

          <Link
            to="/upload-resume"
            className="sidebar-link"
          >
            <span>▤</span>
            Resumes
          </Link>

          {/* Jobs */}

          <Link
            to="/jobs"
            className="sidebar-link"
          >
            <span>▣</span>
            Jobs
          </Link>

          {/* Screening */}

          <Link
            to="/screen-resume"
            className="sidebar-link"
          >
            <span>◉</span>
            Screening
          </Link>

          <p className="nav-label">
            ANALYSIS
          </p>

          {/* Candidates */}

          <Link
            to="/upload-resume"
            className="sidebar-link"
          >
            <span>♙</span>
            Candidates
          </Link>

          {/* Analytics */}

          <Link
            to="/screen-resume"
            className="sidebar-link"
          >
            <span>◫</span>
            Analytics
          </Link>

        </nav>

        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>
                Need Help?
              </strong>

              <p>
                 Explore the screening workspace
              </p>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="dashboard-main">

        {/* =================================
            TOPBAR
        ================================= */}

        <header className="dashboard-topbar">

          <div className="mobile-brand">
            Smart Resume Screener
          </div>

          <div className="topbar-right">

            <button
              className="notification-button"
              type="button"
            >
              🔔
            </button>

            <div className="topbar-user">

              <div className="user-avatar">

                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "R"}

              </div>

              <div className="topbar-user-info">

                <strong>
                  {user?.name || "Recruiter"}
                </strong>

                <span>
                  Team Member
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =================================
            DASHBOARD CONTENT
        ================================= */}

        <div className="dashboard-content">

          {/* =================================
              WELCOME SECTION
          ================================= */}

          <section className="welcome-section">

            <div>

              <p className="welcome-label">
                SMART RESUME SCREENING
              </p>

              <h1>
                Welcome back, {user?.name || "User"} 👋
              </h1>

              <p>
                Manage resumes, jobs and AI-powered
                candidate screening from one place.
              </p>

            </div>

            <Link
              to="/create-job"
              className="primary-action"
            >
              + Create New Job
            </Link>

          </section>

          {/* Error */}

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {/* =================================
              STATISTICS
          ================================= */}

          <section className="advanced-stats">

            {/* Total Resumes */}

            <div className="advanced-stat-card">

              <div className="stat-top">

                <div className="stat-icon blue">
                  📄
                </div>

                <span className="stat-change">
                  Total
                </span>

              </div>

              <h2>
                {loading
                  ? "..."
                  : resumeCount}
              </h2>

              <p>
                Total Resumes
              </p>

              <div className="stat-footer">
                Candidate resumes
              </div>

            </div>

            {/* Total Jobs */}

            <div className="advanced-stat-card">

              <div className="stat-top">

                <div className="stat-icon purple">
                  💼
                </div>

                <span className="stat-change">
                  Active
                </span>

              </div>

              <h2>
                {loading
                  ? "..."
                  : jobCount}
              </h2>

              <p>
                Total Jobs
              </p>

              <div className="stat-footer">
                Job positions
              </div>

            </div>

            {/* Shortlisted */}

            <div className="advanced-stat-card">

              <div className="stat-top">

                <div className="stat-icon green">
                  ✓
                </div>

                <span className="stat-change">
                  Selected
                </span>

              </div>

              <h2>
                {loading
                  ? "..."
                  : shortlistedCount}
              </h2>

              <p>
                Shortlisted
              </p>

              <div className="stat-footer">
                Recommended candidates
              </div>

            </div>

            {/* Average Match */}

            <div className="advanced-stat-card">

              <div className="stat-top">

                <div className="stat-icon orange">
                  %
                </div>

                <span className="stat-change">
                  Average
                </span>

              </div>

              <h2>
                {loading
                  ? "..."
                  : `${averageMatch}%`}
              </h2>

              <p>
                Average Match
              </p>

              <div className="stat-footer">
                Resume-job compatibility
              </div>

            </div>

          </section>

          {/* =================================
              QUICK ACTIONS
          ================================= */}

          <section className="dashboard-actions">

            <div className="section-heading">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Get started with your
                  recruitment workflow.
                </p>

              </div>

            </div>

            <div className="action-grid">

              {/* Create Job */}

              <Link
                to="/create-job"
                className="action-card"
              >

                <div className="action-icon blue">
                  +
                </div>

                <div>

                  <h3>
                    Create Job
                  </h3>

                  <p>
                    Define a new job and
                    required skills.
                  </p>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </Link>

              {/* Upload Resume */}

              <Link
                to="/upload-resume"
                className="action-card"
              >

                <div className="action-icon purple">
                  ↑
                </div>

                <div>

                  <h3>
                    Upload Resume
                  </h3>

                  <p>
                    Add a candidate resume
                    for screening.
                  </p>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </Link>

              {/* Screen Resume */}

              <Link
                to="/screen-resume"
                className="action-card"
              >

                <div className="action-icon green">
                  ✓
                </div>

                <div>

                  <h3>
                    Screen Resume
                  </h3>

                  <p>
                    Match a candidate
                    with a job.
                  </p>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </Link>

            </div>

          </section>

          {/* =================================
              ANALYTICS
          ================================= */}

          <section className="analytics-grid">

            {/* Screening Overview */}

            <div className="analytics-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Screening Overview
                  </h2>

                  <p>
                    Candidate screening
                    statistics
                  </p>

                </div>

              </div>

              <div className="screening-overview">

                <div className="overview-item">

                  <div className="overview-number blue-text">
                    {totalScreenings}
                  </div>

                  <span>
                    Total Screenings
                  </span>

                </div>

                <div className="overview-item">

                  <div className="overview-number green-text">
                    {shortlistedCount}
                  </div>

                  <span>
                    Shortlisted
                  </span>

                </div>

                <div className="overview-item">

                  <div className="overview-number orange-text">
                    {reviewCount}
                  </div>

                  <span>
                    Under Review
                  </span>

                </div>

                <div className="overview-item">

                  <div className="overview-number red-text">
                    {rejectedCount}
                  </div>

                  <span>
                    Rejected
                  </span>

                </div>

              </div>

              {/* Match Progress */}

              <div className="match-progress-section">

                <div className="progress-header">

                  <span>
                    Average candidate match
                  </span>

                  <strong>
                    {averageMatch}%
                  </strong>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-value"
                    style={{
                      width: `${Math.min(
                        averageMatch,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Recruitment Summary */}

            <div className="analytics-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Recruitment Summary
                  </h2>

                  <p>
                    Current screening pipeline
                  </p>

                </div>

              </div>

              <div className="pipeline">

                <div className="pipeline-row">

                  <div className="pipeline-label">

                    <span className="pipeline-dot blue-dot" />

                    Resumes

                  </div>

                  <strong>
                    {resumeCount}
                  </strong>

                </div>

                <div className="pipeline-row">

                  <div className="pipeline-label">

                    <span className="pipeline-dot purple-dot" />

                    Jobs

                  </div>

                  <strong>
                    {jobCount}
                  </strong>

                </div>

                <div className="pipeline-row">

                  <div className="pipeline-label">

                    <span className="pipeline-dot green-dot" />

                    Shortlisted

                  </div>

                  <strong>
                    {shortlistedCount}
                  </strong>

                </div>

                <div className="pipeline-row">

                  <div className="pipeline-label">

                    <span className="pipeline-dot orange-dot" />

                    Review

                  </div>

                  <strong>
                    {reviewCount}
                  </strong>

                </div>

              </div>

            </div>

          </section>

          {/* =================================
              RECENT CANDIDATES
          ================================= */}

          <section className="candidates-section">

            <div className="section-heading">

              <div>

                <h2>
                  Recent Candidates
                </h2>

                <p>
                  Latest resume screening
                  results
                </p>

              </div>

              {screenings.length > 0 && (

                <Link
                  to="/screen-resume"
                  className="view-all-link"
                >
                  Screen More →
                </Link>

              )}

            </div>

            {/* Loading */}

            {loading ? (

              <div className="empty-state">

                <div className="loading-spinner" />

                <p>
                  Loading candidates...
                </p>

              </div>

            ) : screenings.length === 0 ? (

              /* No candidates */

              <div className="empty-state">

                <div className="empty-icon">
                  📄
                </div>

                <h3>
                  No candidates yet
                </h3>

                <p>
                  Start screening resumes
                  to see candidates here.
                </p>

                <Link
                  to="/screen-resume"
                  className="primary-action"
                >
                  Screen a Resume
                </Link>

              </div>

            ) : (

              /* Candidate Table */

              <div className="candidate-table-wrapper">

                <table className="advanced-candidate-table">

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
                      .slice(0, 6)
                      .map((screening) => {

                        const score =
                          Number(
                            screening.matchScore || 0
                          );

                        const recommendation =
                          screening.recommendation ||
                          "Review";

                        return (

                          <tr
                            key={screening._id}
                          >

                            {/* Candidate */}

                            <td>

                              <div className="candidate-info">

                                <div className="candidate-avatar">

                                  {screening.candidateName
                                    ? screening.candidateName
                                        .charAt(0)
                                        .toUpperCase()
                                    : "C"}

                                </div>

                                <div>

                                  <Link
                                    to={`/candidate/${screening._id}`}
                                    className="candidate-name"
                                  >
                                    {screening.candidateName ||
                                      "Unknown Candidate"}
                                  </Link>

                                  <span>
                                    Candidate
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* Position */}

                            <td>

                              <span className="position-text">

                                {screening.jobTitle ||
                                  "Not specified"}

                              </span>

                            </td>

                            {/* Score */}

                            <td>

                              <div className="score-wrapper">

                                <div className="mini-progress">

                                  <div
                                    className="mini-progress-value"
                                    style={{
                                      width: `${Math.min(
                                        score,
                                        100
                                      )}%`,
                                    }}
                                  />

                                </div>

                                <strong>
                                  {score}%
                                </strong>

                              </div>

                            </td>

                            {/* Status */}

                            <td>

                              <span
                                className={
                                  `advanced-status status-${recommendation.toLowerCase()}`
                                }
                              >
                                {recommendation}
                              </span>

                            </td>

                            {/* Action */}

                            <td>

                              <Link
                                to={`/candidate/${screening._id}`}
                                className="view-button"
                              >
                                View
                              </Link>

                            </td>

                          </tr>

                        );

                      })}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* =================================
              FOOTER
          ================================= */}

          <footer className="advanced-dashboard-footer">

            <span>
              Smart Resume Screener
            </span>

            <span>
              AI-powered resume screening platform
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;