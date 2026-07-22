import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import {
  PageHead,
  Spinner,
  ConfirmModal,
} from "../../components/ui/Common";
import { initialsOf } from "../../utils/format";
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
      toast.error(err.message || "Failed to load students.");
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

    return students.filter((student) =>
      [
        student.studentNumber,
        `${student.name ?? ""} ${student.surname ?? ""}`,
        student.user?.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [students, query]);

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      await adminApi.deleteStudent(toDelete.studentId);

      toast.success("Student removed successfully.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to remove student.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Students"
        title="Students"
        description="Manage all registered students."
        action={
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by student number, name or email"
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
              <strong>No students found.</strong>
              <br />
              Try a different search term.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student No.</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Academic Average</th>
                  <th>Risk Level</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((student) => {
                  const fullName =
                    `${student.name ?? ""} ${student.surname ?? ""}`.trim() ||
                    "Unnamed Student";

                  return (
                    <tr key={student.studentId}>
                      {/* Student Number */}
                      <td>
                        <strong>{student.studentNumber}</strong>
                      </td>

                      {/* Student */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "var(--blue-tint)",
                              color: "var(--blue)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: 700,
                              fontSize: 12,
                              flexShrink: 0,
                            }}
                          >
                            {initialsOf(fullName)}
                          </div>

                          <span>{fullName}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="cell-muted">
                        {student.user?.email ?? "—"}
                      </td>

                      {/* Academic Average */}
                      <td className="cell-muted">
                        {student.academicAverage !== null &&
                        student.academicAverage !== undefined
                          ? `${student.academicAverage}%`
                          : "Not Available"}
                      </td>

                      {/* Risk */}
                      <td>
                        <span
                          className={`badge ${
                            student.riskLevel === "HIGH"
                              ? "badge-danger"
                              : student.riskLevel === "MEDIUM"
                              ? "badge-warning"
                              : student.riskLevel === "LOW"
                              ? "badge-success"
                              : "badge-secondary"
                          }`}
                        >
                          {student.riskLevel ?? "Not Assessed"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setToDelete(student)}
                        >
                          <Trash2 size={14} />
                          Remove
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
          title="Remove Student"
          message={`Are you sure you want to permanently remove ${
            `${toDelete.name ?? ""} ${toDelete.surname ?? ""}`.trim() ||
            "this student"
          }?`}
          confirmLabel="Remove Student"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}