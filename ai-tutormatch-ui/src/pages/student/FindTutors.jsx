import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, CalendarPlus } from "lucide-react";

import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner, Modal, EmptyState } from "../../components/ui/Common";
import { pick, initialsOf } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function FindTutors() {
  const { subjectId: routeSubjectId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState(routeSubjectId || "");
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [booking, setBooking] = useState(null);
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
        setLoadingSubjects(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!subjectId) {
      setTutorSubjects([]);
      return;
    }
    (async () => {
      setLoadingTutors(true);
      try {
        const data = await studentApi.getTutorsBySubject(subjectId);
        setTutorSubjects(data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingTutors(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const openBooking = (entry) => {
    setSessionDate("");
    setBooking(entry);
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if (!sessionDate) {
      toast.error("Choose a session date and time.");
      return;
    }
    setSubmitting(true);
    try {
      const tutorId = pick(booking, ["tutorId", "id"]);
      await studentApi.bookSession({
        studentId: user.id,
        tutorId,
        subjectId: Number(subjectId),
        sessionDate: new Date(sessionDate).toISOString(),
      });
      toast.success("Session requested — you'll be notified once it's approved.");
      setBooking(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Student · Learning"
        title="Find a tutor"
        description="Choose a subject to see the tutors available to teach it, then request a session."
      />

      <div className="panel" style={{ maxWidth: 420, marginBottom: 22 }}>
        <div className="panel-body">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Subject</label>
            {loadingSubjects ? (
              <Spinner dark />
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {subjectId && (
        <div className="panel">
          <div className="panel-body no-pad">
            {loadingTutors ? (
              <div className="table-empty">
                <Spinner dark />
              </div>
            ) : tutorSubjects.length === 0 ? (
              <EmptyState
                title="No tutors yet"
                message="No tutor currently teaches this subject. Check back soon."
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tutor</th>
                    <th>Rating</th>
                    <th>Expertise</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tutorSubjects.map((entry, i) => {
                    const name = pick(entry, ["tutorName", "name"], `Tutor #${pick(entry, ["tutorId"], i)}`);
                    const rating = pick(entry, ["rating"], "New");
                    const expertise = pick(entry, ["subjectExpertise", "expertise"], "—");

                    return (
                      <tr key={pick(entry, ["id", "tutorId"], i)}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "var(--accent-tint)",
                                color: "var(--accent-ink)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11.5,
                                fontWeight: 700,
                              }}
                            >
                              {initialsOf(name)}
                            </div>
                            {name}
                          </div>
                        </td>
                        <td className="cell-muted">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Star size={12} fill="var(--accent)" color="var(--accent)" />
                            {rating}
                          </span>
                        </td>
                        <td className="cell-muted">{expertise}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => openBooking(entry)}
                          >
                            <CalendarPlus size={13} /> Book session
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {booking && (
        <Modal
          title="Request a session"
          onClose={() => setBooking(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setBooking(null)}>
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
          <p className="muted" style={{ marginTop: 0, fontSize: 13.4 }}>
            with <strong>{pick(booking, ["tutorName", "name"], "your tutor")}</strong>
          </p>
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
