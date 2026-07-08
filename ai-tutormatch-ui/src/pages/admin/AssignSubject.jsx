import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { studentApi } from "../../api/studentApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { pick } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function AssignSubject() {
  const toast = useToast();
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ tutorId: "", subjectId: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [t, s] = await Promise.all([adminApi.getAllTutors(), studentApi.getAllSubjects()]);
        setTutors(t || []);
        setSubjects(s || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.tutorId || !form.subjectId) {
      toast.error("Choose both a tutor and a subject.");
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.assignSubjectToTutor({
        tutorId: Number(form.tutorId),
        subjectId: Number(form.subjectId),
      });
      toast.success("Subject assigned to tutor.");
      setForm({ tutorId: "", subjectId: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Catalog"
        title="Assign subject to tutor"
        description="Grant a tutor the ability to teach and be booked for a given subject."
      />

      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="panel-body">
          {loading ? (
            <Spinner dark />
          ) : (
            <form onSubmit={onSubmit}>
              <div className="field">
                <label>Tutor</label>
                <select
                  className="input"
                  value={form.tutorId}
                  onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
                  required
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((t, i) => (
                    <option key={pick(t, ["id", "tutorId"], i)} value={pick(t, ["id", "tutorId"])}>
                      {pick(t, ["name", "fullName"], `Tutor #${pick(t, ["id", "tutorId"], i)}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Subject</label>
                <select
                  className="input"
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s, i) => (
                    <option key={pick(s, ["id", "subjectId"], i)} value={pick(s, ["id", "subjectId"])}>
                      {pick(s, ["name", "subjectName"], `Subject #${pick(s, ["id", "subjectId"], i)}`)}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn btn-accent" disabled={submitting} style={{ width: "100%" }}>
                {submitting ? <Spinner /> : <><Link2 size={15} /> Assign subject</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
