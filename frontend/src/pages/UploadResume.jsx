import { useState } from "react";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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

    const formData = new FormData();

    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/resumes/upload",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Resume uploaded successfully!");
        console.log(data);
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend.");
    }
  };

  return (
    <div>
      <h1>Upload Resume</h1>

      <p>Upload a candidate's resume for screening.</p>

      <form onSubmit={handleUpload}>
        <label>Select Resume</label>

        <br />
        <br />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <br />
        <br />

        {file && (
          <p>
            Selected File: {file.name}
          </p>
        )}

        <button type="submit">
          Upload Resume
        </button>
      </form>

      {message && (
        <p>
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadResume;