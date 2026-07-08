import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { tutorApi } from "../../api/tutorApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner, EmptyState } from "../../components/ui/Common";
import { pick } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function MySubjects() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const data = await tutorApi.getTutorSubjects(user.id);
        setSubjects(data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div>
      <PageHead
        eyebrow="Tutor · Teaching"
        title="My subjects"
        description="Subjects an admin has assigned you to teach. Contact an administrator to add more."
      />

      {loading ? (
        <div className="loading-screen" style={{ minHeight: "30vh" }}>
          <Spinner dark />
        </div>
      ) : subjects.length === 0 ? (
        <div className="panel">
          <EmptyState title="No subjects assigned yet" message="An administrator needs to assign a subject to your profile." />
        </div>
      ) : (
        <div className="grid-3">
          {subjects.map((s, i) => (
            <div key={pick(s, ["id", "subjectId"], i)} className="panel" style={{ margin: 0 }}>
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
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>
                  {pick(s, ["subjectName", "name"], "Untitled subject")}
                </h3>
                <p className="muted" style={{ fontSize: 12.8, margin: 0 }}>
                  {pick(s, ["description"], "No description provided.")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
