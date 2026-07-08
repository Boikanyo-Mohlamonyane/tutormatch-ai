import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { tutorApi } from "../../api/tutorApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner } from "../../components/ui/Common";
import { pick } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const emptyForm = { name: "", email: "", subjectExpertise: "", bio: "" };

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const data = await tutorApi.getTutor(user.id);
        setForm({
          name: pick(data, ["name", "fullName"], ""),
          email: pick(data, ["email"], ""),
          subjectExpertise: pick(data, ["subjectExpertise", "expertise"], ""),
          bio: pick(data, ["bio"], ""),
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tutorApi.updateTutorProfile(user.id, form);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Tutor · Insights"
        title="My profile"
        description="This is what students see when browsing tutors for a subject."
      />

      <div className="panel" style={{ maxWidth: 620 }}>
        <div className="panel-body">
          {loading ? (
            <Spinner dark />
          ) : (
            <form onSubmit={onSave}>
              <div className="grid-2">
                <div className="field">
                  <label>Full name</label>
                  <input className="input" name="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
                </div>
              </div>
              <div className="field">
                <label>Subject expertise</label>
                <input
                  className="input"
                  name="subjectExpertise"
                  value={form.subjectExpertise}
                  onChange={onChange}
                  placeholder="e.g. Mathematics, Physics"
                />
              </div>
              <div className="field">
                <label>Short bio</label>
                <textarea className="input" name="bio" value={form.bio} onChange={onChange} />
              </div>
              <button className="btn btn-accent" disabled={saving}>
                {saving ? <Spinner /> : <><Save size={15} /> Save changes</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
