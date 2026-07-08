import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, GraduationCap, CalendarCheck, Hourglass, UserPlus, BookOpen, Link2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { pick, formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function AdminDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [dashboard, allBookings] = await Promise.allSettled([
          adminApi.getDashboard(),
          adminApi.getAllBookings(),
        ]);
        if (cancelled) return;
        if (dashboard.status === "fulfilled") setStats(dashboard.value);
        if (allBookings.status === "fulfilled") setBookings(allBookings.value || []);
        if (dashboard.status === "rejected" && allBookings.status === "rejected") {
          toast.error("Couldn't load dashboard data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalStudents = pick(stats, ["totalStudents", "studentCount", "students"], null);
  const totalTutors = pick(stats, ["totalTutors", "tutorCount", "tutors"], null);
  const totalBookings = pick(stats, ["totalBookings", "bookingCount", "bookings"], bookings.length);
  const pendingCount =
    pick(stats, ["pendingBookings", "pendingCount"], null) ??
    bookings.filter((b) => String(pick(b, ["status"], "")).toUpperCase() === "PENDING").length;

  const recent = [...bookings]
    .sort((a, b) => new Date(pick(b, ["sessionDate", "date"], 0)) - new Date(pick(a, ["sessionDate", "date"], 0)))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "40vh" }}>
        <Spinner dark /> Loading dashboard…
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow="Admin"
        title="Platform overview"
        description="Monitor enrollment, tutor supply, and booking activity across AI TutorMatch."
      />

      <div className="stat-grid">
        <StatCard label="Students" value={totalStudents ?? "—"} icon={<Users size={20} />} />
        <StatCard label="Tutors" value={totalTutors ?? "—"} icon={<GraduationCap size={20} />} />
        <StatCard label="Total bookings" value={totalBookings ?? "—"} icon={<CalendarCheck size={20} />} />
        <StatCard label="Pending approvals" value={pendingCount ?? "—"} icon={<Hourglass size={20} />} />
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent bookings</h3>
              <div className="panel-head-sub">Latest session requests across every subject</div>
            </div>
            <Link to="/admin/bookings" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="panel-body no-pad">
            {recent.length === 0 ? (
              <div className="table-empty">
                <strong>No bookings yet</strong>
                Sessions will appear here once students start booking tutors.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Tutor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b, i) => (
                    <tr key={pick(b, ["id", "bookingId"], i)}>
                      <td>{pick(b, ["studentName"], `Student #${pick(b, ["studentId"], "—")}`)}</td>
                      <td>{pick(b, ["tutorName"], `Tutor #${pick(b, ["tutorId"], "—")}`)}</td>
                      <td className="cell-muted">{formatDate(pick(b, ["sessionDate", "date"]))}</td>
                      <td>
                        <Badge tone={pick(b, ["status"], "pending")}>{pick(b, ["status"], "Pending")}</Badge>
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
            <h3>Quick actions</h3>
          </div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/admin/create-tutor" className="btn btn-primary" style={{ justifyContent: "flex-start" }}>
              <UserPlus size={16} /> Onboard a new tutor
            </Link>
            <Link to="/admin/subjects" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <BookOpen size={16} /> Manage subjects
            </Link>
            <Link to="/admin/assign-subject" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <Link2 size={16} /> Assign subject to tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
