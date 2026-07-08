import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/ui/Common";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Check your credentials.");
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
          Matching every student with the <span>right tutor</span>, at the right time — guided by
          performance data, not guesswork.
        </p>

        <div style={{ position: "relative", zIndex: 1, fontSize: 12.5, color: "#8b98bd" }}>
          Admin · Tutor · Student — one platform, three focused workspaces.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h1>Sign in</h1>
          <p className="lede">Enter your credentials to reach your workspace.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                autoComplete="email"
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
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>
            <button className="btn btn-accent" style={{ width: "100%" }} disabled={loading}>
              {loading ? <Spinner /> : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            New to AI TutorMatch? <Link to="/register"><b>Create an account</b></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
