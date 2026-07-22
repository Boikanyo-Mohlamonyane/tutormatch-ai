import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import {
  PageHead,
  Spinner,
  ConfirmModal,
} from "../../components/ui/Common";
import { initialsOf } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function Tutors() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState([]);
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);

    try {
      const data = await adminApi.getAllTutors();
      setTutors(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load tutors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return tutors;

    return tutors.filter((tutor) =>
      [
        tutor.employeeNumber,
        `${tutor.name ?? ""} ${tutor.surname ?? ""}`,
        tutor.user?.email,
        tutor.specialization,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, tutors]);

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      await adminApi.deleteTutor(toDelete.tutorId);

      toast.success("Tutor removed successfully.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message || "Unable to remove tutor.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Tutors"
        title="Tutors"
        description="Manage all tutors registered on the platform."
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-box">
              <Search size={15} />
              <input
                placeholder="Search by employee number, name, email or specialization"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <Link to="/admin/create-tutor" className="btn btn-accent">
              <UserPlus size={15} />
              New Tutor
            </Link>
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
              <strong>No tutors found.</strong>
              <br />
              Try another search or create a tutor.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee No.</th>
                  <th>Tutor</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((tutor) => {
                  const fullName =
                    `${tutor.name ?? ""} ${tutor.surname ?? ""}`.trim() ||
                    "Unnamed Tutor";

                  return (
                    <tr key={tutor.tutorId}>
                      <td>
                        <strong>{tutor.employeeNumber}</strong>
                      </td>

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
                              background: "var(--accent-tint)",
                              color: "var(--accent-ink)",
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

                      <td className="cell-muted">
                        {tutor.user?.email ?? "—"}
                      </td>

                      <td className="cell-muted">
                        {tutor.specialization
                          ? tutor.specialization
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (c) => c.toUpperCase())
                          : "Not Specified"}
                      </td>

                      <td className="cell-muted">
                        {tutor.yearsExperience}{" "}
                        {tutor.yearsExperience === 1 ? "Year" : "Years"}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setToDelete(tutor)}
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
          title="Remove Tutor"
          message={`Are you sure you want to permanently remove ${
            `${toDelete.name ?? ""} ${toDelete.surname ?? ""}`.trim() ||
            "this tutor"
          }?`}
          confirmLabel="Remove Tutor"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}