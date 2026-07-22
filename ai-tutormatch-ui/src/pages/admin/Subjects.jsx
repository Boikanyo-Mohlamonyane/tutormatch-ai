import {useEffect, useState} from 'react';
import {Plus, Pencil, Trash2, BookOpen} from 'lucide-react';
import {adminApi} from '../../api/adminApi';
import {
  PageHead,
  Spinner,
  Modal,
  ConfirmModal,
} from '../../components/ui/Common';
import {useToast} from '../../context/ToastContext';

const emptyForm = {
  subjectCode: '',
  subjectName: '',
  description: '',
};

export default function Subjects () {
  const toast = useToast ();

  const [loading, setLoading] = useState (true);
  const [subjects, setSubjects] = useState ([]);

  const [editing, setEditing] = useState (null);
  const [form, setForm] = useState (emptyForm);
  const [saving, setSaving] = useState (false);

  const [toDelete, setToDelete] = useState (null);
  const [deleting, setDeleting] = useState (false);

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================
  const load = async () => {
    try {
      setLoading (true);

      const response = await adminApi.getAllSubjects ();

      const data = Array.isArray (response)
        ? response.map (subject => ({
            id: subject.subjectId,
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            description: subject.description,
          }))
        : [];

      setSubjects (data);
    } catch (err) {
      toast.error (err.message || 'Failed to load subjects');
    } finally {
      setLoading (false);
    }
  };

  useEffect (() => {
    load ();
  }, []);

  // =====================================================
  // CREATE
  // =====================================================
  const openCreate = () => {
    setForm (emptyForm);
    setEditing ('new');
  };

  // =====================================================
  // EDIT
  // =====================================================
  const openEdit = subject => {
    setEditing (subject);

    setForm ({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      description: subject.description || '',
    });
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  const closeModal = () => {
    setEditing (null);
    setForm (emptyForm);
  };

  // =====================================================
  // SAVE
  // =====================================================
  const onSave = async e => {
    e.preventDefault ();

    if (saving) return;

    try {
      setSaving (true);

      const payload = {
        subjectCode: form.subjectCode.trim (),
        subjectName: form.subjectName.trim (),
        description: form.description.trim (),
      };

      if (!payload.subjectCode || !payload.subjectName) {
        toast.error ('Subject Code and Subject Name are required.');
        return;
      }

      if (editing === 'new') {
        await adminApi.createSubject (payload);
        toast.success ('Subject created successfully.');
      } else {
        await adminApi.updateSubject (editing.id, payload);
        toast.success ('Subject updated successfully.');
      }

      closeModal ();
      await load ();
    } catch (err) {
      toast.error (err.message || 'Unable to save subject.');
    } finally {
      setSaving (false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================
  const confirmDelete = async () => {
    if (!toDelete) return;

    try {
      setDeleting (true);

      await adminApi.deleteSubject (toDelete.id);

      toast.success ('Subject deleted successfully.');

      setToDelete (null);

      await load ();
    } catch (err) {
      toast.error (err.message || 'Unable to delete subject.');
    } finally {
      setDeleting (false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin • Catalog"
        title="Subjects"
        description="Manage available university subjects."
        action={
          <button className="btn btn-accent" onClick={openCreate}>
            <Plus size={15} />
            New Subject
          </button>
        }
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading
            ? <div className="table-empty">
                <Spinner dark />
              </div>
            : subjects.length === 0
                ? <div className="table-empty">
                    <strong>No subjects found.</strong>
                    <br />
                    Click <b>New Subject</b> to create one.
                  </div>
                : <table className="data-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject</th>
                        <th>Description</th>
                        <th width="180" />
                      </tr>
                    </thead>

                    <tbody>
                      {subjects.map (subject => (
                        <tr key={subject.id}>
                          <td>
                            <strong>{subject.subjectCode}</strong>
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 8,
                                  background: 'var(--accent-tint)',
                                  color: 'var(--accent-ink)',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <BookOpen size={16} />
                              </div>

                              <strong>{subject.subjectName}</strong>
                            </div>
                          </td>

                          <td>{subject.description || '-'}</td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 8,
                              }}
                            >
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => openEdit (subject)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setToDelete (subject)}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {editing &&
        <Modal
          title={editing === 'new' ? 'Create Subject' : 'Edit Subject'}
          onClose={closeModal}
        >
          <form onSubmit={onSave}>
            <div className="field">
              <label>Subject Code</label>

              <input
                className="input"
                placeholder="e.g. CSC101"
                value={form.subjectCode}
                onChange={e =>
                  setForm ({
                    ...form,
                    subjectCode: e.target.value,
                  })}
                required
              />
            </div>

            <div className="field">
              <label>Subject Name</label>

              <input
                className="input"
                placeholder="Computer Science"
                value={form.subjectName}
                onChange={e =>
                  setForm ({
                    ...form,
                    subjectName: e.target.value,
                  })}
                required
              />
            </div>

            <div className="field">
              <label>Description</label>

              <textarea
                className="input"
                rows={4}
                placeholder="Enter description..."
                value={form.description}
                onChange={e =>
                  setForm ({
                    ...form,
                    description: e.target.value,
                  })}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-accent"
                disabled={saving}
              >
                {saving ? <Spinner /> : 'Save Subject'}
              </button>
            </div>
          </form>
        </Modal>}

      {/* DELETE MODAL */}
      {toDelete &&
        <ConfirmModal
          title="Delete Subject"
          message={`Are you sure you want to delete "${toDelete.subjectName}"?`}
          confirmLabel="Delete Subject"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete (null)}
        />}
    </div>
  );
}
