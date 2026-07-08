import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner, ConfirmModal } from "../../components/ui/Common";
import { pick, initialsOf } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function Students() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllStudents();
      setStudents(data || []);
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
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [pick(s, ["name", "fullName"]), pick(s, ["email"])].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [students, query]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteStudent(pick(toDelete, ["id", "studentId"]));
      toast.success("Student removed.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Directory"
        title="Students"
        description="Everyone registered as a student on the platform."
        action={
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
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
              <strong>No students found</strong>
              Try a different search term.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Grade / level</th>
                  <th>Risk level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const name = pick(s, ["name", "fullName"], "Unnamed student");
                  return (
                    <tr key={pick(s, ["id", "studentId"], i)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "var(--blue-tint)",
                              color: "var(--blue)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11.5,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initialsOf(name)}
                          </div>
                          {name}
                        </div>
                      </td>
                      <td className="cell-muted">{pick(s, ["email"], "—")}</td>
                      <td className="cell-muted">{pick(s, ["gradeLevel", "level"], "—")}</td>
                      <td className="cell-muted">{pick(s, ["riskLevel"], "Not assessed")}</td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-danger btn-sm" onClick={() => setToDelete(s)}>
                          <Trash2 size={13} /> Remove
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

      {toDelete && (
        <ConfirmModal
          title="Remove student"
          message={`This will permanently remove ${pick(toDelete, ["name", "fullName"], "this student")} from the platform.`}
          confirmLabel="Remove student"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
