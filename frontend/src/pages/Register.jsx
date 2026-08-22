import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ---------------------------------------
    // Validation
    // ---------------------------------------

    if (!name || !email || !password) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);


      // ---------------------------------------
      // Send data to backend
      // ---------------------------------------

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        }
      );


      const data = await response.json();


      // ---------------------------------------
      // Registration successful
      // ---------------------------------------

      if (response.ok) {

        setMessage(
          "Registration successful! Redirecting to login..."
        );


        // Clear fields

        setName("");
        setEmail("");
        setPassword("");


        // Go to login after 1 second

        setTimeout(() => {

          navigate("/login");

        }, 1000);

      }

      // ---------------------------------------
      // Registration failed
      // ---------------------------------------

      else {

        setError(
          data.message ||
          "Registration failed."
        );

      }

    }

    catch (error) {

      console.error(
        "Registration error:",
        error
      );

      setError(
        "Cannot connect to backend. Make sure the backend server is running."
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="register-page">

      <div className="register-container">

        <h1>
          Create Account
        </h1>

        <p>
          Register for Smart Resume Screener
        </p>


        <form onSubmit={handleRegister}>


          {/* Name */}

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          {/* Error */}

          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          {/* Success */}

          {message && (

            <p className="success-message">
              {message}
            </p>

          )}


          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Registering..."
              : "Register"
            }

          </button>


        </form>


        {/* Login Link */}

        <p>

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;