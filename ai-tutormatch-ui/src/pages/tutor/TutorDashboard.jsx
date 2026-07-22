import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  BookOpen,
  Hourglass,
} from "lucide-react";

import { tutorApi } from "../../api/tutorApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import { PageHead, Spinner } from "../../components/ui/Common";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { pick, formatDate } from "../../utils/format";

export default function TutorDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const tutorId = user?.id;

  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!tutorId) return;

    let mounted = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        const [subjectsRes, bookingsRes] = await Promise.allSettled([
          tutorApi.getTutorSubjects(tutorId),
          tutorApi.getTutorBookings(tutorId),
        ]);

        if (!mounted) return;

        if (subjectsRes.status === "fulfilled") {
          setSubjects(Array.isArray(subjectsRes.value) ? subjectsRes.value : []);
        } else {
          console.error(subjectsRes.reason);
        }

        if (bookingsRes.status === "fulfilled") {
          setBookings(Array.isArray(bookingsRes.value) ? bookingsRes.value : []);
        } else {
          console.error(bookingsRes.reason);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard");
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
  }, [tutorId]);

  const pending = bookings.filter(
    (booking) =>
      String(pick(booking, ["status"], "")).toUpperCase() === "PENDING"
  );

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "40vh" }}>
        <Spinner dark />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow="Tutor"
        title="Your teaching overview"
        description="Manage your subjects, bookings and students."
      />

      <div className="stat-grid">
        <StatCard
          label="Subjects"
          value={subjects.length}
          icon={<BookOpen size={20} />}
        />

        <StatCard
          label="Bookings"
          value={bookings.length}
          icon={<CalendarCheck size={20} />}
        />

        <StatCard
          label="Pending"
          value={pending.length}
          icon={<Hourglass size={20} />}
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Pending Requests</h3>
            <div className="panel-head-sub">
              Approve or reject session requests.
            </div>
          </div>

          <Link
            to="/tutor/bookings"
            className="btn btn-ghost btn-sm"
          >
            View all
          </Link>
        </div>

        <div className="panel-body no-pad">
          {pending.length === 0 ? (
            <div className="table-empty">
              <strong>No pending requests</strong>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {pending.map((booking, index) => (
                  <tr
                    key={pick(
                      booking,
                      ["bookingId", "id"],
                      index
                    )}
                  >
                    <td>
                      {pick(
                        booking,
                        ["studentName"],
                        `Student #${pick(
                          booking,
                          ["studentId"],
                          "-"
                        )}`
                      )}
                    </td>

                    <td>{pick(booking, ["subjectName"], "-")}</td>

                    <td>
                      {formatDate(
                        pick(booking, [
                          "sessionDate",
                          "date",
                        ])
                      )}
                    </td>

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