import { useState } from "react";
import { UserCog } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { useToast } from "../../context/ToastContext";

const emptyForm = { name: "", email: "", password: "" };

export default function CreateAdmin() {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.createAdmin(form);
      toast.success("New administrator created.");
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
        title="Create an admin"
        description="Grant another team member full administrative access. Use this sparingly."
      />

      <div className="panel" style={{ maxWidth: 520 }}>
        <div className="panel-body">
          <form onSubmit={onSubmit}>
            <div className="field">
              <label>Full name</label>
              <input className="input" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Email address</label>
              <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
            </div>
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
              <span className="hint">They should change this after first sign-in.</span>
            </div>
            <button className="btn btn-accent" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? <Spinner /> : <><UserCog size={15} /> Create administrator</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
