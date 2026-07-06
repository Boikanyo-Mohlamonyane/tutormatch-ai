import DashboardLayout from "../../../components/layout/DashboardLayout";

function StudentDashboard() {

  return (
    <DashboardLayout title="Student Dashboard">

      {/* STATS */}
      <div className="stats-grid">

        <div className="stats-card">
          <h3>Total Sessions</h3>
          <h1>24</h1>
          <p>+12% this month</p>
        </div>

        <div className="stats-card">
          <h3>Active Tutors</h3>
          <h1>8</h1>
          <p>Currently connected</p>
        </div>

        <div className="stats-card">
          <h3>Completed Lessons</h3>
          <h1>57</h1>
          <p>Excellent progress</p>
        </div>

      </div>

      {/* ANALYTICS CHART */}
      <div className="chart-section">

        <h3>Weekly Learning Progress</h3>

        



      </div>

      {/* TABLE */}
      <div className="dashboard-table">

        <div className="table-header">
          <h3>Upcoming Sessions</h3>
        </div>

        <table>

          <thead>
            <tr>
              <th>Tutor</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Sarah Johnson</td>
              <td>Mathematics</td>
              <td>12 July 2026</td>
              <td>
                <span className="status active">
                  Confirmed
                </span>
              </td>
            </tr>

            <tr>
              <td>Michael Smith</td>
              <td>Programming</td>
              <td>15 July 2026</td>
              <td>
                <span className="status pending">
                  Pending
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default StudentDashboard;
