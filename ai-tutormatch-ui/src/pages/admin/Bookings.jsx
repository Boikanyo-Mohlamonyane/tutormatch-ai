import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

export default function Bookings() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [busyId, setBusyId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);

    try {
      const data = await adminApi.getAllBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;

    return bookings.filter(
      booking =>
        booking.status?.toUpperCase() === filter
    );
  }, [bookings, filter]);

  const changeStatus = async (booking, newStatus) => {
    if (booking.status === newStatus) return;

    setBusyId(booking.bookingId);

    try {
      switch (newStatus) {
        case "APPROVED":
          await adminApi.approveBooking(booking.bookingId);
          break;

        case "REJECTED":
          await adminApi.rejectBooking(booking.bookingId);
          break;

        case "PENDING":
          toast.info("Pending status cannot be restored.");
          return;

        default:
          return;
      }

      toast.success("Booking updated.");

      await loadBookings();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update booking."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin"
        title="Bookings"
        description="Manage all tutoring bookings."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            {FILTERS.map(filterName => (
              <button
                key={filterName}
                className={`btn btn-sm ${
                  filter === filterName
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                onClick={() => setFilter(filterName)}
              >
                {filterName}
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
          ) : filteredBookings.length === 0 ? (
            <div className="table-empty">
              <strong>No bookings found</strong>
            </div>
          ) : (
            <table className="data-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tutor</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Subject</th>
                  <th>Session Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredBookings.map(booking => (

                  <tr key={booking.bookingId}>

                    <td>{booking.bookingId}</td>

                    <td>
                      {booking.tutor
                        ? `${booking.tutor.name} ${booking.tutor.surname}`
                        : "-"}
                    </td>

                    <td>
                      {booking.tutor?.specialization ?? "-"}
                    </td>

                    <td>
                      {booking.tutor?.yearsExperience ?? 0} years
                    </td>

                    <td>
                      {booking.subjectName}
                    </td>

                    <td>
                      {formatDate(booking.sessionDate)}
                    </td>

                    <td>
                      <Badge tone={booking.status.toLowerCase()}>
                        {booking.status}
                      </Badge>
                    </td>

                    <td>

                      <select
                        className="input"
                        value={booking.status}
                        disabled={busyId === booking.bookingId}
                        onChange={(e) =>
                          changeStatus(
                            booking,
                            e.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

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