import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, LineChart, Sparkles, Search } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import MasteryRing from "../../components/ui/MasteryRing";
import { pick, formatDate, toNumber } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [b, p] = await Promise.allSettled([
          studentApi.getStudentBookings(user.id),
          studentApi.getPerformance(user.id),
        ]);
        if (cancelled) return;
        if (b.status === "fulfilled") setBookings(b.value || []);
        if (p.status === "fulfilled") setPerformance(p.value || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const upcoming = bookings.filter((b) => {
    const status = String(pick(b, ["status"], "")).toUpperCase();
    return status !== "REJECTED" && status !== "CANCELLED" && status !== "CANCELED";
  });

  const avgScore =
    performance.length > 0
      ? performance.reduce((sum, p) => sum + toNumber(pick(p, ["score", "performanceScore"], 0)), 0) /
        performance.length
      : null;

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
        eyebrow="Student"
        title="Your learning at a glance"
        description="Track upcoming sessions, recent performance, and find your next tutor."
      />

      <div className="stat-grid">
        <StatCard label="Upcoming sessions" value={upcoming.length} icon={<ClipboardList size={20} />} />
        <StatCard
          label="Average performance"
          ring={avgScore ?? 0}
          value={avgScore !== null ? `${Math.round(avgScore)}%` : "No data"}
        />
        <StatCard label="Total bookings" value={bookings.length} icon={<LineChart size={20} />} />
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Upcoming sessions</h3>
              <div className="panel-head-sub">Your next tutoring sessions</div>
            </div>
            <Link to="/student/bookings" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="panel-body no-pad">
            {upcoming.length === 0 ? (
              <div className="table-empty">
                <strong>Nothing booked yet</strong>
                Find a tutor to schedule your first session.
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
                  {upcoming.slice(0, 6).map((b, i) => (
                    <tr key={pick(b, ["id", "bookingId"], i)}>
                      <td>{pick(b, ["tutorName"], `Tutor #${pick(b, ["tutorId"], "—")}`)}</td>
                      <td className="cell-muted">{pick(b, ["subjectName"], "—")}</td>
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
            <h3>Keep going</h3>
          </div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/student/recommend" className="btn btn-accent" style={{ justifyContent: "flex-start" }}>
              <Sparkles size={16} /> Get an AI tutor recommendation
            </Link>
            <Link to="/student/find-tutor" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <Search size={16} /> Browse tutors by subject
            </Link>
            <Link to="/student/performance" className="btn btn-ghost" style={{ justifyContent: "flex-start" }}>
              <LineChart size={16} /> Review your performance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
