import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { studentApi } from "../../api/studentApi";
import { PageHead, Spinner, Modal, ConfirmModal } from "../../components/ui/Common";
import { pick } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const emptyForm = { name: "", description: "" };

export default function Subjects() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [editing, setEditing] = useState(null); // subject object or "new"
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Subjects are exposed under the student read endpoint in the backend.
      const data = await studentApi.getAllSubjects();
      setSubjects(data || []);
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

  const openCreate = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (subject) => {
    setForm({
      name: pick(subject, ["name", "subjectName"], ""),
      description: pick(subject, ["description"], ""),
    });
    setEditing(subject);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await adminApi.createSubject(form);
        toast.success("Subject created.");
      } else {
        await adminApi.updateSubject(pick(editing, ["id", "subjectId"]), form);
        toast.success("Subject updated.");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteSubject(pick(toDelete, ["id", "subjectId"]));
      toast.success("Subject deleted.");
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
        eyebrow="Admin · Catalog"
        title="Subjects"
        description="The catalog of subjects students can browse and book tutors for."
        action={
          <button className="btn btn-accent" onClick={openCreate}>
            <Plus size={15} /> New subject
          </button>
        }
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : subjects.length === 0 ? (
            <div className="table-empty">
              <strong>No subjects yet</strong>
              Create the first subject so students can start booking tutors.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={pick(s, ["id", "subjectId"], i)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "var(--accent-tint)",
                            color: "var(--accent-ink)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <BookOpen size={15} />
                        </div>
                        <strong style={{ fontWeight: 600 }}>{pick(s, ["name", "subjectName"], "Untitled")}</strong>
                      </div>
                    </td>
                    <td className="cell-muted">{pick(s, ["description"], "—")}</td>
                    <td style={{ textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setToDelete(s)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "New subject" : "Edit subject"}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn btn-accent" onClick={onSave} disabled={saving}>
                {saving ? <Spinner /> : "Save subject"}
              </button>
            </>
          }
        >
          <form onSubmit={onSave}>
            <div className="field">
              <label>Subject name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Algebra II"
                required
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What this subject covers"
              />
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete subject"
          message={`"${pick(toDelete, ["name", "subjectName"], "This subject")}" will be removed from the catalog.`}
          confirmLabel="Delete subject"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
