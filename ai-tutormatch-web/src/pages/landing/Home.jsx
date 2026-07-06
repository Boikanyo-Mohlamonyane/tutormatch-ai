import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "../../assets/styles/home.css";
import "../../assets/styles/components.css";

function Home() {

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            Smart University Learning Platform
          </span>

          <h1>
            Find the Perfect Tutor with
            <span> AI-Powered Matching</span>
          </h1>

          <p>
            AI TutorMatch helps universities connect students
            with qualified tutors through intelligent matching,
            scheduling, and analytics.
          </p>

          <div className="hero-buttons">

            <button className="btn btn-primary btn-lg">
              Get Started
            </button>

            <button className="btn btn-secondary btn-lg">
              Learn More
            </button>

          </div>

        </div>

        {/* HERO IMAGE */}
        <div className="hero-image">

          <div className="hero-card">

            <h3>Student Dashboard</h3>

            <div className="dashboard-preview">

              <div className="preview-card"></div>
              <div className="preview-card"></div>
              <div className="preview-card"></div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="section">

        <div className="section-header">

          <h2>Platform Features</h2>

          <p>
            Everything needed for modern university tutoring.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">
            <h3>AI Tutor Matching</h3>

            <p>
              Intelligent tutor recommendations powered by AI.
            </p>
          </div>

          <div className="feature-card">
            <h3>Session Scheduling</h3>

            <p>
              Easily book and manage tutoring sessions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Analytics Dashboard</h3>

            <p>
              Track academic progress and tutoring performance.
            </p>
          </div>

        </div>

      </section>

      {/* ROLES */}
      <section className="section roles-section">

        <div className="section-header">
          <h2>Built for Everyone</h2>
        </div>

        <div className="roles-grid">

          <div className="role-card">
            <h3>Students</h3>

            <p>
              Find tutors and improve academic performance.
            </p>
          </div>

          <div className="role-card">
            <h3>Tutors</h3>

            <p>
              Manage tutoring sessions and student engagement.
            </p>
          </div>

          <div className="role-card">
            <h3>Administrators</h3>

            <p>
              Oversee tutoring operations and analytics.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta-section">

        <h2>
          Transform University Learning Today
        </h2>

        <p>
          Join institutions modernizing student tutoring experiences.
        </p>

        <button className="btn btn-primary btn-lg">
          Start Now
        </button>

      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Home;