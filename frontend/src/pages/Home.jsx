import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Smart Resume Screener</h1>

      <p>
        AI-powered resume screening and candidate matching system.
      </p>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default Home;