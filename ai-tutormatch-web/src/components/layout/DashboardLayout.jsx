import "../../assets/styles/dashboard.css";

function DashboardLayout({ children, title }) {

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <span className="logo-highlight">AI</span> TutorMatch
        </div>

        <div className="sidebar-menu">

          <a href="/" className="sidebar-active">
            Dashboard
          </a>

          <a href="/">
            Sessions
          </a>

          <a href="/">
            Tutors
          </a>

          <a href="/">
            Analytics
          </a>

          <a href="/">
            Messages
          </a>

          <a href="/">
            Settings
          </a>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <div className="dashboard-topbar">

          <h2>{title}</h2>

          <div className="topbar-actions">

            <div className="notification-icon">
              🔔
            </div>

            <div className="profile-dropdown">

              <div className="profile-avatar">
                BM
              </div>

              <div>
                <h4>Boikanyo</h4>
                <p>Student</p>
              </div>

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="dashboard-content">
          {children}
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;
