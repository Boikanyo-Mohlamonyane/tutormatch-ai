import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Hourglass,
  UserPlus,
  BookOpen,
  Link2,
} from "lucide-react";

import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function AdminDashboard() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [dashboard, bookingData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAllBookings(),
      ]);

      setStats(dashboard || {});
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  // Stats calculations
  const totalStudents = stats.totalStudents ?? stats.studentCount ?? 0;
  const totalTutors = stats.totalTutors ?? stats.tutorCount ?? 0;
  const totalBookings = stats.totalBookings ?? bookings.length;
  const pendingBookings = bookings.filter(
    (b) => b.status?.toUpperCase() === "PENDING"
  ).length;

  // Sort and slice recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "40vh" }}>
        <Spinner dark />
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow="Admin"
        title="Platform Overview"
        description="Monitor platform activity and recent tutoring requests."
      />

      {/* Stats Section */}
      <div className="stat-grid">
        <StatCard label="Students" value={totalStudents} icon={<Users size={20} />} />
        <StatCard label="Tutors" value={totalTutors} icon={<GraduationCap size={20} />} />
        <StatCard label="Bookings" value={totalBookings} icon={<CalendarCheck size={20} />} />
        <StatCard label="Pending" value={pendingBookings} icon={<Hourglass size={20} />} />
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Recent Bookings */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent Bookings</h3>
              <div className="panel-head-sub">Latest tutoring session requests</div>
            </div>
            <Link to="/admin/bookings" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>

          <div className="panel-body no-pad">
            {recentBookings.length === 0 ? (
              <div className="table-empty">
                <strong>No bookings found</strong>
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
                  {recentBookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.tutor?.name || "Unknown Tutor"}</td>
                      <td>{booking.subjectName}</td>
                      <td className="cell-muted">{formatDate(booking.sessionDate)}</td>
                      <td>
                        <Badge tone={(booking.status || "").toLowerCase()}>
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

        {/* Quick Actions */}
        <div className="panel">
          <div className="panel-head">
            <h3>Quick Actions</h3>
          </div>
          <div
            className="panel-body"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <Link to="/admin/create-tutor" className="btn btn-primary" style={{ justifyContent: "flex-start" }}>
              <UserPlus size={16} />
              Onboard Tutor
            </Link>

            <Link to="/admin/subjects" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <BookOpen size={16} />
              Manage Subjects
            </Link>

            <Link to="/admin/assign-subject" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <Link2 size={16} />
              Assign Tutor Subject
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
