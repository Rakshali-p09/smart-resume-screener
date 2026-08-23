import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="home-navbar">

        <Link
          to="/"
          className="home-logo"
        >
          <span className="logo-icon">
            ✦
          </span>

          <span>
            SmartResume
          </span>
        </Link>


        <div className="home-nav-links">

          <Link to="/login">
            Sign In
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* ================================
          HERO SECTION
      ================================= */}

      <main className="home-hero">

        {/* Left Content */}

        <section className="hero-content">

          <div className="hero-badge">
            <span>✦</span>
            AI-POWERED RESUME SCREENING
          </div>


          <h1>
            Smart Resume
            <span>
              Screening Made Simple
            </span>
          </h1>


          <p className="hero-description">
            Analyze resumes, compare candidate
            skills with job requirements, and
            generate intelligent screening results
            through one streamlined platform.
          </p>


          <div className="hero-buttons">

            <Link
              to="/register"
              className="hero-primary-button"
            >
              Get Started
              <span>→</span>
            </Link>


            <Link
              to="/login"
              className="hero-secondary-button"
            >
              Sign In
            </Link>

          </div>


          <div className="hero-trust">

            <div>
              <span>✓</span>
              Resume Analysis
            </div>

            <div>
              <span>✓</span>
              Skill Matching
            </div>

            <div>
              <span>✓</span>
              AI Screening
            </div>

          </div>

        </section>


        {/* Right Visual */}

        <section className="hero-visual">

          <div className="hero-glow" />

          <div className="resume-preview-card">

            {/* Card Header */}

            <div className="preview-header">

              <div className="preview-file">

                <div className="preview-file-icon">
                  📄
                </div>

                <div>

                  <strong>
                    Candidate Resume
                  </strong>

                  <span>
                    Resume.pdf
                  </span>

                </div>

              </div>

              <span className="preview-status">
                Analyzed
              </span>

            </div>


            {/* Score */}

            <div className="preview-score-section">

              <div>

                <span className="score-label">
                  MATCH SCORE
                </span>

                <strong className="preview-score">
                  87%
                </strong>

              </div>


              <div className="score-circle">
                <span>
                  87
                </span>
              </div>

            </div>


            {/* Skills */}

            <div className="preview-section">

              <div className="preview-section-title">
                <span>
                  Matched Skills
                </span>

                <span>
                  6 found
                </span>
              </div>


              <div className="preview-skills">

                <span>Java</span>
                <span>SQL</span>
                <span>React</span>
                <span>Git</span>
                <span>Node.js</span>
                <span>MongoDB</span>

              </div>

            </div>


            {/* Analysis */}

            <div className="preview-analysis">

              <div className="analysis-check">
                ✓
              </div>

              <div>

                <strong>
                  Screening Complete
                </strong>

                <span>
                  Resume successfully analyzed
                </span>

              </div>

            </div>

          </div>


          {/* Floating Card */}

          <div className="floating-analysis-card">

            <div className="floating-icon">
              ✦
            </div>

            <div>

              <strong>
                AI Analysis
              </strong>

              <span>
                Skills intelligently matched
              </span>

            </div>

          </div>

        </section>

      </main>


      {/* ================================
          FEATURES
      ================================= */}

      <section className="home-features">

        <div className="features-heading">

          <p>
            PLATFORM CAPABILITIES
          </p>

          <h2>
            Everything you need for
            smarter screening
          </h2>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon blue">
              📄
            </div>

            <h3>
              Resume Analysis
            </h3>

            <p>
              Upload resumes and extract
              relevant candidate information
              for further analysis.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon purple">
              ◇
            </div>

            <h3>
              Skill Matching
            </h3>

            <p>
              Compare candidate skills with
              job requirements and identify
              matched and missing skills.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon green">
              ✦
            </div>

            <h3>
              Intelligent Screening
            </h3>

            <p>
              Generate a compatibility score
              and structured screening result
              from resume and job data.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          FOOTER
      ================================= */}

      <footer className="home-footer">

        <div className="home-logo">

          <span className="logo-icon">
            ✦
          </span>

          SmartResume

        </div>

        <p>
          AI-powered resume screening platform
        </p>

      </footer>

    </div>
  );
}

export default Home;