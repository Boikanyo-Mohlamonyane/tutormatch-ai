import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import Badge from "../../components/ui/Badge";
import { pick, formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function Bookings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllBookings();
      setBookings(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => String(pick(b, ["status"], "")).toUpperCase() === filter);
  }, [bookings, filter]);

  const act = async (booking, action) => {
    const id = pick(booking, ["id", "bookingId"]);
    setBusyId(id);
    try {
      if (action === "approve") {
        await adminApi.approveBooking(id);
        toast.success("Booking approved.");
      } else {
        await adminApi.rejectBooking(id);
        toast.success("Booking rejected.");
      }
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Operations"
        title="Bookings"
        description="Review, approve, or reject session requests across the platform."
        action={
          <div style={{ display: "flex", gap: 6 }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter(f)}
              >
                {f[0] + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        }
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <strong>No bookings here</strong>
              Nothing matches this filter right now.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Session date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const status = String(pick(b, ["status"], "PENDING")).toUpperCase();
                  const id = pick(b, ["id", "bookingId"], i);
                  return (
                    <tr key={id}>
                      <td>{pick(b, ["studentName"], `Student #${pick(b, ["studentId"], "—")}`)}</td>
                      <td>{pick(b, ["tutorName"], `Tutor #${pick(b, ["tutorId"], "—")}`)}</td>
                      <td className="cell-muted">{pick(b, ["subjectName"], "—")}</td>
                      <td className="cell-muted">{formatDate(pick(b, ["sessionDate", "date"]))}</td>
                      <td>
                        <Badge tone={status}>{status}</Badge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {status === "PENDING" ? (
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              disabled={busyId === id}
                              onClick={() => act(b, "approve")}
                              style={{ color: "var(--teal)" }}
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={busyId === id}
                              onClick={() => act(b, "reject")}
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="faint" style={{ fontSize: 12.5 }}>
                            No action needed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
