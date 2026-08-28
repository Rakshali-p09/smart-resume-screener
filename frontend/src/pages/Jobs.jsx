import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://smart-resume-screener-6r0u.onrender.com/api/jobs",
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

      if (!response.ok) {
        setError(
          data.message || "Unable to load jobs."
        );
        return;
      }

      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Jobs error:", err);
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    return (
      (job.title || "")
        .toLowerCase()
        .includes(searchText) ||
      (job.description || "")
        .toLowerCase()
        .includes(searchText) ||
      String(job.requiredSkills || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="jobs-page">

      {/* Header */}

      <header className="jobs-header">

        <div>
          <Link
            to="/dashboard"
            className="jobs-back-link"
          >
            ← Dashboard
          </Link>

          <p className="jobs-label">
                JOB WORKSPACE
          </p>

        <p>
            Manage job positions and define
            the requirements for resume screening.
        </p>
        </div>

        <Link
          to="/create-job"
          className="jobs-create-button"
        >
          + Create New Job
        </Link>

      </header>


      {/* Search */}

      <section className="jobs-toolbar">

        <div className="jobs-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search jobs, skills or descriptions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="jobs-count">

          {filteredJobs.length}
          {" "}
          {filteredJobs.length === 1
            ? "Job"
            : "Jobs"}

        </div>

      </section>


      {/* Error */}

      {error && (
        <div className="jobs-error">
          {error}
        </div>
      )}


      {/* Jobs */}

      {loading ? (

        <div className="jobs-empty">

          <div className="jobs-spinner" />

          <p>
            Loading jobs...
          </p>

        </div>

      ) : filteredJobs.length === 0 ? (

        <div className="jobs-empty">

          <div className="jobs-empty-icon">
            💼
          </div>

          <h2>
            {search
              ? "No jobs found"
              : "No jobs created yet"}
          </h2>

          <p>
            {search
              ? "Try another search term."
              : "Create your first job to start screening candidates."}
          </p>

          {!search && (
            <Link
              to="/create-job"
              className="jobs-create-button"
            >
              + Create Your First Job
            </Link>
          )}

        </div>

      ) : (

        <div className="jobs-grid">

          {filteredJobs.map((job) => {

            let skills = [];

            if (Array.isArray(job.requiredSkills)) {
              skills = job.requiredSkills;
            } else if (
              typeof job.requiredSkills === "string"
            ) {
              skills =
                job.requiredSkills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean);
            }

            return (

              <article
                className="job-card"
                key={job._id}
              >

                <div className="job-card-top">

                  <div className="job-icon">
                    💼
                  </div>

                  <span className="job-status">
                    Active
                  </span>

                </div>


                <h2>
                  {job.title ||
                    "Untitled Job"}
                </h2>


                <p className="job-description">

                  {job.description
                    ? job.description.length > 150
                      ? `${job.description.slice(
                          0,
                          150
                        )}...`
                      : job.description
                    : "No description provided."}

                </p>


                {/* Skills */}

                <div className="job-skills">

                  <p>
                    Required Skills
                  </p>

                  <div className="skill-tags">

                    {skills.length > 0 ? (

                      skills
                        .slice(0, 6)
                        .map((skill, index) => (

                          <span
                            className="skill-tag"
                            key={index}
                          >
                            {skill}
                          </span>

                        ))

                    ) : (

                      <span className="no-skills">
                        No skills specified
                      </span>

                    )}

                  </div>

                </div>


                {/* Experience */}

                <div className="job-meta">

                  <div>

                    <span>
                      Experience
                    </span>

                    <strong>
                      {job.experience ||
                        "Not specified"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Created
                    </span>

                    <strong>
                      {job.createdAt
                        ? new Date(
                            job.createdAt
                          ).toLocaleDateString()
                        : "Recently"}
                    </strong>

                  </div>

                </div>


                {/* Footer */}

                <div className="job-card-footer">

                  <span>
                    Job ID:{" "}
                    {job._id
                      ? job._id.slice(-6)
                      : "------"}
                  </span>

                  <button
                    type="button"
                    className="job-view-button"
                    onClick={() => {
                      alert(
                        `Job: ${
                          job.title ||
                          "Untitled Job"
                        }\n\n${
                          job.description ||
                          "No description"
                        }`
                      );
                    }}
                  >
                    View Details →
                  </button>

                </div>

              </article>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Jobs;