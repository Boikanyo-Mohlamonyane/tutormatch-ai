import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { PageHead, Spinner, EmptyState } from "../../components/ui/Common";
import { pick } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function Subjects() {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHead
        eyebrow="Student · Learning"
        title="Browse subjects"
        description="Pick a subject to see every tutor available to teach it."
      />

      {loading ? (
        <div className="loading-screen" style={{ minHeight: "30vh" }}>
          <Spinner dark />
        </div>
      ) : subjects.length === 0 ? (
        <div className="panel">
          <EmptyState title="No subjects available" message="Check back once your school adds subjects to the catalog." />
        </div>
      ) : (
        <div className="grid-3">
          {subjects.map((s, i) => {
            const id = pick(s, ["id", "subjectId"], i);
            return (
              <div
                key={id}
                className="panel"
                style={{ margin: 0, cursor: "pointer" }}
                onClick={() => navigate(`/student/subject/${id}/tutors`)}
              >
                <div className="panel-body">
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "var(--accent-tint)",
                      color: "var(--accent-ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{pick(s, ["name", "subjectName"], "Untitled")}</h3>
                  <p className="muted" style={{ fontSize: 12.8, margin: "0 0 14px", minHeight: 34 }}>
                    {pick(s, ["description"], "No description provided.")}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-dark)", fontSize: 12.8, fontWeight: 600 }}>
                    View tutors <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
