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
import { useToast } from "../../context/ToastContext";

import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";

import { pick, formatDate, toNumber } from "../../utils/format";

export default function StudentDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const studentId = user?.id;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [bookingResult, performanceResult] =
          await Promise.allSettled([
            studentApi.getStudentBookings(studentId),
            studentApi.getPerformance(studentId),
          ]);

        if (!mounted) return;

        if (bookingResult.status === "fulfilled") {
          setBookings(Array.isArray(bookingResult.value) ? bookingResult.value : []);
        } else {
          console.error("Bookings Error:", bookingResult.reason);
        }

        if (performanceResult.status === "fulfilled") {
          setPerformance(
            Array.isArray(performanceResult.value)
              ? performanceResult.value
              : []
          );
        } else {
          console.error("Performance Error:", performanceResult.reason);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to load dashboard.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  const upcoming = bookings.filter((booking) => {
    const status = String(
      pick(booking, ["status"], "")
    ).toUpperCase();

    return (
      status !== "REJECTED" &&
      status !== "CANCELLED" &&
      status !== "CANCELED"
    );
  });

  const avgScore =
    performance.length > 0
      ? performance.reduce(
          (sum, item) =>
            sum +
            toNumber(
              pick(item, ["score", "performanceScore"], 0)
            ),
          0
        ) / performance.length
      : null;

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{ minHeight: "40vh" }}
      >
        <Spinner dark />
        Loading your dashboard...
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
        <StatCard
          label="Upcoming sessions"
          value={upcoming.length}
          icon={<ClipboardList size={20} />}
        />

        <StatCard
          label="Average performance"
          value={
            avgScore !== null
              ? `${Math.round(avgScore)}%`
              : "No data"
          }
          ring={avgScore ?? 0}
        />

        <StatCard
          label="Total bookings"
          value={bookings.length}
          icon={<LineChart size={20} />}
        />
      </div>

      <div
        className="grid-2"
        style={{ alignItems: "start" }}
      >
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Upcoming sessions</h3>
              <div className="panel-head-sub">
                Your next tutoring sessions
              </div>
            </div>

            <Link
              to="/student/bookings"
              className="btn btn-ghost btn-sm"
            >
              View all
            </Link>
          </div>

          <div className="panel-body no-pad">
            {upcoming.length === 0 ? (
              <div className="table-empty">
                <strong>Nothing booked yet</strong>
                <br />
                Find a tutor to schedule your first
                session.
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
                  {upcoming.slice(0, 6).map((booking, index) => (
                    <tr
                      key={pick(
                        booking,
                        ["id", "bookingId"],
                        index
                      )}
                    >
                      <td>
                        {pick(
                          booking,
                          ["tutorName"],
                          `Tutor #${pick(
                            booking,
                            ["tutorId"],
                            "-"
                          )}`
                        )}
                      </td>

                      <td className="cell-muted">
                        {pick(
                          booking,
                          ["subjectName"],
                          "-"
                        )}
                      </td>

                      <td className="cell-muted">
                        {formatDate(
                          pick(booking, [
                            "sessionDate",
                            "date",
                          ])
                        )}
                      </td>

                      <td>
                        <Badge
                          tone={pick(
                            booking,
                            ["status"],
                            "pending"
                          )}
                        >
                          {pick(
                            booking,
                            ["status"],
                            "Pending"
                          )}
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
            <h3>Keep going</h3>
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
              style={{
                justifyContent: "flex-start",
              }}
            >
              <Sparkles size={16} />
              Get an AI tutor recommendation
            </Link>

            <Link
              to="/student/find-tutor"
              className="btn btn-ghost"
              style={{
                justifyContent: "flex-start",
              }}
            >
              <Search size={16} />
              Browse tutors by subject
            </Link>

            <Link
              to="/student/performance"
              className="btn btn-ghost"
              style={{
                justifyContent: "flex-start",
              }}
            >
              <LineChart size={16} />
              Review your performance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}