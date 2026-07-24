import { useEffect, useState } from "react";
import { Sparkles, Star, CalendarPlus } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner, Modal, EmptyState } from "../../components/ui/Common";
import { pick, initialsOf } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function Recommend() {
  const { user } = useAuth();
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await studentApi.getAllSubjects();
        setSubjects(data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const findMatch = async () => {
    if (!subjectId) {
      toast.error("Pick a subject first.");
      return;
    }
    setFinding(true);
    setSearched(false);
    try {
      const data = await studentApi.recommendTutor(subjectId);
      setTutor(data);
    } catch (err) {
      toast.error(err.message);
      setTutor(null);
    } finally {
      setFinding(false);
      setSearched(true);
    }
  };

 const confirmBooking = async (e) => {
  e.preventDefault();

  if (!sessionDate) {
    toast.error("Choose a session date and time.");
    return;
  }

  if (!user || user.id == null) {
    console.error("Logged in user:", user);
    toast.error("Student ID is missing. Please log out and log in again.");
    return;
  }

  if (!tutor) {
    toast.error("Please select a tutor.");
    return;
  }

  const payload = {
    studentId: Number(user.id),
    tutorId: Number(tutor.id ?? tutor.tutorId),
    subjectId: Number(subjectId),
    sessionDate: new Date(sessionDate).toISOString(),
  };

  console.log("Booking payload:", payload);

  setSubmitting(true);

  try {
    const response = await studentApi.bookSession(payload);
    toast.success(response || "Session booked successfully");
    setBooking(false);
    setSessionDate("");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div>
      <PageHead
        eyebrow="Student · Learning"
        title="AI tutor recommendation"
        description="Tell us the subject you need help with — the matching engine finds your best-fit tutor."
      />

      <div className="panel" style={{ maxWidth: 520 }}>
        <div className="panel-body">
          {loading ? (
            <Spinner dark />
          ) : (
            <>
              <div className="field">
                <label>Subject</label>
                <select
                  className="input"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s, i) => (
                    <option
                      key={pick(s, ["id", "subjectId"], i)}
                      value={pick(s, ["id", "subjectId"])}
                    >
                      {pick(s, ["name", "subjectName"], `Subject #${pick(s, ["id", "subjectId"], i)}`)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-accent"
                onClick={findMatch}
                disabled={finding}
                style={{ width: "100%" }}
              >
                {finding ? (
                  <Spinner />
                ) : (
                  <>
                    <Sparkles size={15} /> Find my best match
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {searched && (
        <div className="panel" style={{ maxWidth: 520, marginTop: 18 }}>
          <div className="panel-head">
            <h3>Recommended tutor</h3>
          </div>
          <div className="panel-body">
            {!tutor ? (
              <EmptyState
                title="No match found"
                message="Try a different subject, or browse tutors manually."
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "var(--accent-tint)",
                    color: "var(--accent-ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {initialsOf(pick(tutor, ["name", "fullName"], "Tutor"))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {pick(tutor, ["name", "fullName"], "Tutor")}
                  </div>
                  <div
                    className="muted"
                    style={{ fontSize: 12.6, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Star size={12} fill="var(--accent)" color="var(--accent)" />
                    {pick(tutor, ["rating"], "New")} ·{" "}
                    {pick(tutor, ["subjectExpertise", "expertise"], "General")}
                  </div>
                </div>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => setBooking(true)}
                >
                  <CalendarPlus size={13} /> Book
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {booking && (
        <Modal
          title="Request a session"
          onClose={() => setBooking(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setBooking(false)}>
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={confirmBooking}
                disabled={submitting}
              >
                {submitting ? <Spinner /> : "Request session"}
              </button>
            </>
          }
        >
          <form onSubmit={confirmBooking}>
            <div className="field">
              <label>Session date &amp; time</label>
              <input
                className="input"
                type="datetime-local"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
