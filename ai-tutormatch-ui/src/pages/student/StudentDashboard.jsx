import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  LineChart,
  Sparkles,
  Search,
} from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const studentId = user?.studentId;

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [dashboardRes, bookingsRes, performanceRes] =
          await Promise.allSettled([
            studentApi.getStudentDashboard(studentId),
            studentApi.getStudentBookings(studentId),
            studentApi.getPerformance(studentId),
          ]);

        if (cancelled) return;

        if (dashboardRes.status === "fulfilled") {
          setDashboard(dashboardRes.value);
        }

        if (bookingsRes.status === "fulfilled") {
          setBookings(bookingsRes.value || []);
        }

        if (performanceRes.status === "fulfilled") {
          setPerformance(performanceRes.value || []);
        }
      } catch (err) {
        console.error(err);

        toast.error(
          err.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [studentId, toast]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner dark />
      </div>
    );
  }

  const upcoming = bookings.filter((b) => {
    const status = (b.status || "").toUpperCase();

    return (
      status !== "REJECTED" &&
      status !== "CANCELLED" &&
      status !== "CANCELED"
    );
  });

  const average =
    dashboard?.academicAverage ??
    (performance.length
      ? (
          performance.reduce(
            (sum, p) => sum + (p.score || 0),
            0
          ) / performance.length
        ).toFixed(1)
      : null);

  return (
    <div>
      <PageHead
        eyebrow="Student"
        title={`Welcome ${
          dashboard?.studentName ?? user?.name ?? ""
        }`}
        description="Track your tutoring progress."
      />

      <div className="stat-grid">
        <StatCard
          label="Upcoming Sessions"
          value={upcoming.length}
          icon={<ClipboardList size={20} />}
        />

        <StatCard
          label="Academic Average"
          value={
            average !== null
              ? `${average}%`
              : "No Data"
          }
          icon={<LineChart size={20} />}
        />

        <StatCard
          label="Risk Level"
          value={dashboard?.riskLevel ?? "Unknown"}
        />

        <StatCard
          label="Total Bookings"
          value={bookings.length}
        />
      </div>

      <div className="grid-2">

        <div className="panel">
          <div className="panel-head">
            <h3>Upcoming Sessions</h3>

            <Link
              to="/student/bookings"
              className="btn btn-ghost btn-sm"
            >
              View All
            </Link>
          </div>

          <div className="panel-body no-pad">

            {upcoming.length === 0 ? (
              <div className="table-empty">
                No upcoming bookings.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tutor</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {upcoming.slice(0, 5).map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.tutorName}</td>

                      <td>{booking.subjectName}</td>

                      <td>
                        {formatDate(
                          booking.sessionDate
                        )}
                      </td>

                      <td>
                        <Badge
                          tone={booking.status.toLowerCase()}
                        >
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Quick Actions</h3>
          </div>

          <div
            className="panel-body"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              to="/student/recommend"
              className="btn btn-accent"
            >
              <Sparkles size={16} />
              AI Tutor Recommendation
            </Link>

            <Link
              to="/student/find-tutor"
              className="btn btn-ghost"
            >
              <Search size={16} />
              Browse Tutors
            </Link>

            <Link
              to="/student/performance"
              className="btn btn-ghost"
            >
              <LineChart size={16} />
              Performance
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}