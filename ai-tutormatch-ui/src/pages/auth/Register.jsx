import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/ui/Common";

const ROLES = ["STUDENT", "TUTOR"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register(form);
      setSuccess("Account created. Redirecting you to sign in…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Unable to register right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(150deg, var(--accent), var(--accent-dark))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={20} color="var(--ink)" />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "#fff" }}>
            AI TutorMatch
          </div>
        </div>

        <p className="auth-visual-quote">
          Track mastery, not just attendance. Every session feeds a clearer picture of{" "}
          <span>where each student stands</span>.
        </p>

        <div style={{ position: "relative", zIndex: 1, fontSize: 12.5, color: "#8b98bd" }}>
          Free to join as a student or tutor. Admin accounts are issued by your organization.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="lede">Join as a student to book sessions, or a tutor to start teaching.</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="role-select">
            {ROLES.map((r) => (
              <div
                key={r}
                className={`role-pill${form.role === r ? " active" : ""}`}
                onClick={() => setForm({ ...form, role: r })}
              >
                {r === "STUDENT" ? "Student" : "Tutor"}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                className="input"
                name="name"
                placeholder="Jordan Lee"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                placeholder="you@school.edu"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>
            <button className="btn btn-accent" style={{ width: "100%" }} disabled={loading}>
              {loading ? <Spinner /> : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login"><b>Sign in</b></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
