import { useState } from "react";
import { Link } from "react-router-dom";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a resume first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before uploading a resume.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setUploading(true);
      setMessage("");

      const response = await fetch(
        "https://smart-resume-screener-6r0u.onrender.com/api/resumes/upload",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);

        return;
      }

      if (response.ok) {
        setMessage("Resume uploaded successfully!");

        setFile(null);

        // Reset file input
        const fileInput =
          document.getElementById("resume-file");

        if (fileInput) {
          fileInput.value = "";
        }

        console.log(data);
      } else {
        setMessage(
          data.message || "Upload failed."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);

      setMessage(
        "Could not connect to backend."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-resume-page">

      {/* Back to Dashboard */}

      <Link
        to="/dashboard"
        className="upload-back-link"
      >
        ← Back to Dashboard
      </Link>


      {/* Main Card */}

      <div className="upload-resume-card">

        {/* Header */}

        <div className="upload-resume-header">

          <div className="upload-resume-icon">
            📄
          </div>

          <div>

            <p className="upload-label">
              CANDIDATE MANAGEMENT
            </p>

            <h1>
              Upload Resume
            </h1>

            <p>
              Upload a candidate's resume
              for screening and analysis.
            </p>

          </div>

        </div>


        {/* Upload Area */}

        <form
          onSubmit={handleUpload}
          className="upload-resume-form"
        >

          <label
            htmlFor="resume-file"
            className="resume-upload-box"
          >

            <div className="upload-cloud">
              ↑
            </div>

            <h2>
              Upload candidate resume
            </h2>

            <p>
              Click here to choose a PDF file
            </p>

            <span className="upload-file-limit">
              Supported formats: PDF
            </span>

            <input
              id="resume-file"
              type="file"
              accept=".pdf.application/pdf"
              onChange={handleFileChange}
              hidden
            />

            <span className="choose-file-button">
              Choose Resume
            </span>

          </label>


          {/* Selected File */}

          {file && (

            <div className="selected-resume">

              <div className="selected-file-icon">
                📄
              </div>

              <div className="selected-file-info">

                <strong>
                  {file.name}
                </strong>

                <span>
                  {(file.size / 1024 / 1024).toFixed(2)}
                  {" "}
                  MB
                </span>

              </div>

              <button
                type="button"
                className="remove-file-button"
                onClick={() => {
                  setFile(null);
                  setMessage("");

                  const fileInput =
                    document.getElementById(
                      "resume-file"
                    );

                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
              >
                ×
              </button>

            </div>

          )}


          {/* Upload Button */}

          <button
            type="submit"
            className="resume-upload-button"
            disabled={uploading}
          >

            {uploading ? (
              <>
                <span className="button-spinner" />
                Uploading...
              </>
            ) : (
              <>
                ↑ Upload Resume
              </>
            )}

          </button>


          {/* Message */}

          {message && (

            <div
              className={
                message.includes(
                  "successfully"
                )
                  ? "upload-message success"
                  : "upload-message error"
              }
            >
              {message}
            </div>

          )}

        </form>

      </div>


      {/* Information */}

      <div className="upload-info">

        <div>
          <span>✓</span>
          Resume parsing
        </div>

        <div>
          <span>✓</span>
          Skill extraction
        </div>

        <div>
          <span>✓</span>
          AI screening ready
        </div>

      </div>

    </div>
  );
}

export default UploadResume;