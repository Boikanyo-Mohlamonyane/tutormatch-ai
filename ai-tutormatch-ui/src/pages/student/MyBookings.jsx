import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner, ConfirmModal } from "../../components/ui/Common";
import Badge from "../../components/ui/Badge";
import { pick, formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function MyBookings() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await studentApi.getStudentBookings(user.id);
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
  }, [user?.id]);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await studentApi.cancelBooking(pick(toCancel, ["id", "bookingId"]));
      toast.success("Booking cancelled.");
      setToCancel(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Student · My activity"
        title="My bookings"
        description="All the tutoring sessions you've requested."
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : bookings.length === 0 ? (
            <div className="table-empty">
              <strong>No bookings yet</strong>
              Find a tutor to schedule your first session.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Session date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const status = String(pick(b, ["status"], "")).toUpperCase();
                  const cancellable = status === "PENDING" || status === "APPROVED";
                  return (
                    <tr key={pick(b, ["id", "bookingId"], i)}>
                      <td>{pick(b, ["tutorName"], `Tutor #${pick(b, ["tutorId"], "—")}`)}</td>
                      <td className="cell-muted">{pick(b, ["subjectName"], "—")}</td>
                      <td className="cell-muted">{formatDate(pick(b, ["sessionDate", "date"]))}</td>
                      <td>
                        <Badge tone={status || "pending"}>{status || "Pending"}</Badge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {cancellable && (
                          <button className="btn btn-danger btn-sm" onClick={() => setToCancel(b)}>
                            <XCircle size={13} /> Cancel
                          </button>
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

      {toCancel && (
        <ConfirmModal
          title="Cancel booking"
          message="This session will be cancelled and your tutor will be notified."
          confirmLabel="Cancel booking"
          danger
          loading={cancelling}
          onConfirm={confirmCancel}
          onClose={() => setToCancel(null)}
        />
      )}
    </div>
  );
}
