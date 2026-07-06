import "../../assets/styles/home.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">

        <h2>
          <span className="logo-highlight">AI</span> TutorMatch
        </h2>

        <p>
          AI-powered tutoring platform for universities
          and higher education institutions.
        </p>

      </div>

      <div className="footer-links">

        <a href="/">Privacy</a>
        <a href="/">Terms</a>
        <a href="/">Support</a>

      </div>

      <div className="footer-bottom">
        © 2026 AI TutorMatch. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;