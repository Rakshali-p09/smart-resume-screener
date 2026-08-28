import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    // Validation

    if (!email || !password) {

      setError(
        "Please enter email and password."
      );

      return;

    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


      const data = await response.json();


      // Successful login

      if (response.ok) {

        // Save JWT token
        localStorage.setItem(
          "token",
          data.token
        );


        // Save user information
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );


        // Go to dashboard
        navigate("/dashboard");

      } else {

        setError(
          data.message ||
          "Login failed."
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
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

    <div className="login-page">

      <div className="login-container">

        <h1>
          Welcome Back
        </h1>

        <p>
          Login to Smart Resume Screener
        </p>

        <form onSubmit={handleLogin}>

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
              placeholder="Enter your password"
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


          {/* Login */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>


        </form>


        {/* Register */}

        <p>

          Don't have an account?

          {" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;