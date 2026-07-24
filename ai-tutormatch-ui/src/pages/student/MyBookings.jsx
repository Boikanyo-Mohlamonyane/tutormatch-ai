import { useEffect, useState, useCallback } from "react";
import { XCircle } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import {
  PageHead,
  Spinner,
  ConfirmModal,
} from "../../components/ui/Common";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function MyBookings() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // IMPORTANT: use Student ID, not User ID
  const studentId = user?.studentId;

  const loadBookings = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await studentApi.getStudentBookings(studentId);
      setBookings(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [studentId, toast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const confirmCancel = async () => {
    if (!toCancel) return;

    setCancelling(true);

    try {
      await studentApi.cancelBooking(toCancel.bookingId);

      toast.success("Booking cancelled successfully.");

      setToCancel(null);

      await loadBookings();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Student"
        title="My Bookings"
        description="View and manage your tutoring session bookings."
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : bookings.length === 0 ? (
            <div className="table-empty">
              <strong>No bookings found</strong>
              <div>You haven't booked any tutoring sessions yet.</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Session Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const status =
                    booking.status?.toUpperCase() ?? "PENDING";

                  const canCancel =
                    status === "PENDING" ||
                    status === "APPROVED";

                  return (
                    <tr key={booking.bookingId}>
                      <td>{booking.tutorName}</td>

                      <td className="cell-muted">
                        {booking.subjectName}
                      </td>

                      <td className="cell-muted">
                        {formatDate(booking.sessionDate)}
                      </td>

                      <td>
                        <Badge tone={status.toLowerCase()}>
                          {status}
                        </Badge>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {canCancel && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setToCancel(booking)}
                          >
                            <XCircle size={14} />
                            Cancel
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
          title="Cancel Booking"
          message={`Are you sure you want to cancel your session with ${toCancel.tutorName}?`}
          confirmLabel="Cancel Booking"
          danger
          loading={cancelling}
          onConfirm={confirmCancel}
          onClose={() => setToCancel(null)}
        />
      )}
    </div>
  );
}