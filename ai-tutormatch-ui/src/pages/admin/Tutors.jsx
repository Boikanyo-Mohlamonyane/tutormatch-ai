import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner, ConfirmModal } from "../../components/ui/Common";
import { pick, initialsOf } from "../../utils/format";
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
    if (!q) return tutors;
    return tutors.filter((t) =>
      [pick(t, ["name", "fullName"]), pick(t, ["email"]), pick(t, ["subjectExpertise", "expertise"])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tutors, query]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteTutor(pick(toDelete, ["id", "tutorId"]));
      toast.success("Tutor removed.");
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
        title="Tutors"
        description="Everyone approved to teach on the platform."
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search by name, email, subject" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Link to="/admin/create-tutor" className="btn btn-accent">
              <UserPlus size={15} /> New tutor
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
              <strong>No tutors found</strong>
              Try a different search, or onboard a new tutor.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Email</th>
                  <th>Expertise</th>
                  <th>Rating</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const name = pick(t, ["name", "fullName"], "Unnamed tutor");
                  return (
                    <tr key={pick(t, ["id", "tutorId"], i)}>
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
                              flexShrink: 0,
                            }}
                          >
                            {initialsOf(name)}
                          </div>
                          {name}
                        </div>
                      </td>
                      <td className="cell-muted">{pick(t, ["email"], "—")}</td>
                      <td className="cell-muted">{pick(t, ["subjectExpertise", "expertise"], "—")}</td>
                      <td className="cell-muted">{pick(t, ["rating"], "Unrated")}</td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-danger btn-sm" onClick={() => setToDelete(t)}>
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
          title="Remove tutor"
          message={`This will permanently remove ${pick(toDelete, ["name", "fullName"], "this tutor")} from the platform.`}
          confirmLabel="Remove tutor"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
