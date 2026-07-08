import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, BookOpen, Hourglass } from "lucide-react";
import { tutorApi } from "../../api/tutorApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { pick, formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function TutorDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [s, b] = await Promise.allSettled([
          tutorApi.getTutorSubjects(user.id),
          tutorApi.getTutorBookings(user.id),
        ]);
        if (cancelled) return;
        if (s.status === "fulfilled") setSubjects(s.value || []);
        if (b.status === "fulfilled") setBookings(b.value || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const pending = bookings.filter((b) => String(pick(b, ["status"], "")).toUpperCase() === "PENDING");

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "40vh" }}>
        <Spinner dark /> Loading your dashboard…
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow="Tutor"
        title="Your teaching overview"
        description="Manage your subjects, respond to session requests, and track your students."
      />

      <div className="stat-grid">
        <StatCard label="Subjects taught" value={subjects.length} icon={<BookOpen size={20} />} />
        <StatCard label="Total bookings" value={bookings.length} icon={<CalendarCheck size={20} />} />
        <StatCard label="Awaiting your response" value={pending.length} icon={<Hourglass size={20} />} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Requests needing a response</h3>
            <div className="panel-head-sub">Approve or decline pending session requests</div>
          </div>
          <Link to="/tutor/bookings" className="btn btn-ghost btn-sm">
            View all bookings
          </Link>
        </div>
        <div className="panel-body no-pad">
          {pending.length === 0 ? (
            <div className="table-empty">
              <strong>You're all caught up</strong>
              No pending session requests right now.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Requested date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.slice(0, 6).map((b, i) => (
                  <tr key={pick(b, ["id", "bookingId"], i)}>
                    <td>{pick(b, ["studentName"], `Student #${pick(b, ["studentId"], "—")}`)}</td>
                    <td className="cell-muted">{pick(b, ["subjectName"], "—")}</td>
                    <td className="cell-muted">{formatDate(pick(b, ["sessionDate", "date"]))}</td>
                    <td>
                      <Badge tone="pending">Pending</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
