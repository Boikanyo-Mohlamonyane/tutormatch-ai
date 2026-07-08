import { useState } from "react";
import { UserPlus } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { useToast } from "../../context/ToastContext";

const emptyForm = { name: "", email: "", password: "", subjectExpertise: "", bio: "" };

export default function CreateTutor() {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.createTutor(form);
      toast.success(`${form.name || "Tutor"} has been onboarded.`);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Operations"
        title="Onboard a new tutor"
        description="Create a tutor account directly. They can be assigned subjects afterward."
      />

      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="panel-body">
          <form onSubmit={onSubmit}>
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

            <div className="grid-2">
              <div className="field">
                <label>Temporary password</label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="field">
                <label>Subject expertise</label>
                <input
                  className="input"
                  name="subjectExpertise"
                  placeholder="e.g. Mathematics, Physics"
                  value={form.subjectExpertise}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Short bio</label>
              <textarea
                className="input"
                name="bio"
                placeholder="A short intro shown to students"
                value={form.bio}
                onChange={onChange}
              />
            </div>

            <button className="btn btn-accent" disabled={submitting}>
              {submitting ? <Spinner /> : <><UserPlus size={15} /> Create tutor account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
