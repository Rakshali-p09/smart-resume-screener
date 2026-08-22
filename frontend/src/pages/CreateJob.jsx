import "../App.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateJob() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experience, setExperience] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");


    if (!title || !description || !requiredSkills) {

      setError(
        "Please fill in all required fields."
      );

      return;
    }


    const token =
      localStorage.getItem("token");


    if (!token) {

      setError(
        "Please login before creating a job."
      );

      navigate("/login");

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            title,
            description,
            requiredSkills,
            experience
          })
        }
      );


      const data =
        await response.json();


      if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Session expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }


      if (!response.ok) {

        setError(
          data.message ||
          "Failed to create job."
        );

        return;
      }


      setMessage(
        "Job created successfully!"
      );


      setTitle("");
      setDescription("");
      setRequiredSkills("");
      setExperience("");


      setTimeout(() => {

        navigate("/dashboard");

      }, 1000);


    } catch (error) {

      console.error(
        "Create job error:",
        error
      );

      setError(
        "Cannot connect to backend."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="create-job-page">

      <div className="create-job-card">


        {/* Back */}

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Back to Dashboard
        </Link>


        {/* Header */}

        <div className="create-job-header">

          <h1>
            Create New Job
          </h1>

          <p>
            Add a job and define the skills
            required for the position.
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="create-job-form"
        >


          {/* Job Title */}

          <div className="form-group">

            <label>
              Job Title *
            </label>

            <input
              type="text"
              placeholder="e.g. Java Developer"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          {/* Description */}

          <div className="form-group">

            <label>
              Job Description *
            </label>

            <textarea
              rows="6"
              placeholder="Enter the job description..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>


          {/* Skills */}

          <div className="form-group">

            <label>
              Required Skills *
            </label>

            <input
              type="text"
              placeholder="Java, SQL, Git, Spring Boot"
              value={requiredSkills}
              onChange={(e) =>
                setRequiredSkills(
                  e.target.value
                )
              }
            />

            <small>
              Separate multiple skills with commas.
            </small>

          </div>


          {/* Experience */}

          <div className="form-group">

            <label>
              Experience
            </label>

            <input
              type="text"
              placeholder="e.g. 0-2 years"
              value={experience}
              onChange={(e) =>
                setExperience(
                  e.target.value
                )
              }
            />

          </div>


          {/* Error */}

          {error && (

            <div className="form-error">
              {error}
            </div>

          )}


          {/* Success */}

          {message && (

            <div className="form-success">
              {message}
            </div>

          )}


          {/* Buttons */}

          <div className="job-form-buttons">

            <Link to="/dashboard">

              <button
                type="button"
                className="cancel-button"
              >
                Cancel
              </button>

            </Link>


            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >

              {loading
                ? "Creating..."
                : "Create Job"
              }

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}

export default CreateJob;