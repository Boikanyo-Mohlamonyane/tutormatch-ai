import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { studentApi } from "../../api/studentApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { useToast } from "../../context/ToastContext";

const initialForm = {
  tutorId: "",
  subjectId: "",
};

export default function AssignSubject() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState(initialForm);

  // =====================================
  // LOAD TUTORS & SUBJECTS
  // =====================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [tutorData, subjectData] = await Promise.all([
        adminApi.getAllTutors(),
       adminApi.getAllSubjects(),
      ]);

      console.log("Tutors:", tutorData);
      console.log("Subjects:", subjectData);

      setTutors(Array.isArray(tutorData) ? tutorData : []);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CHANGE
  // =====================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tutorId) {
      toast.error("Please select a tutor.");
      return;
    }

    if (!form.subjectId) {
      toast.error("Please select a subject.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        tutorId: Number(form.tutorId),
        subjectId: Number(form.subjectId),
      };

      console.log(payload);

      const response = await adminApi.assignSubjectToTutor(payload);

      toast.success(
        response?.message || "Subject assigned successfully."
      );

      setForm(initialForm);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to assign subject.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spinner dark />
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow="Admin"
        title="Assign Subject to Tutor"
        description="Assign a subject to a tutor."
      />

      <div
        className="panel"
        style={{
          maxWidth: 650,
          margin: "0 auto",
        }}
      >
        <div className="panel-body">

          <form onSubmit={handleSubmit}>

            {/* Tutor */}

            <div className="field">

              <label>Select Tutor</label>

              <select
                className="input"
                name="tutorId"
                value={form.tutorId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Tutor --</option>

                {tutors.map((tutor) => (
                  <option
                    key={tutor.tutorId}
                    value={tutor.tutorId}
                  >
                    {tutor.name} {tutor.surname}
                    {" - "}
                    {tutor.employeeNumber}
                  </option>
                ))}

              </select>

            </div>

            {/* Subject */}

            <div className="field">

              <label>Select Subject</label>

              <select
                className="input"
                name="subjectId"
                value={form.subjectId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Subject --</option>

                {subjects.map((subject) => (
                  <option
                    key={subject.subjectId}
                    value={subject.subjectId}
                  >
                    {subject.subjectCode} - {subject.subjectName}
                  </option>
                ))}

              </select>

            </div>

            <button
              className="btn btn-accent"
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: 20,
              }}
            >
              {submitting ? (
                <Spinner />
              ) : (
                <>
                  <Link2 size={18} />
                  Assign Subject
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}