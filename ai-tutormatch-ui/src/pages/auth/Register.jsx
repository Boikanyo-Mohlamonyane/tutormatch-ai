import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {GraduationCap} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import {Spinner} from '../../components/ui/Common';

export default function Register () {
  const {register} = useAuth ();
  const navigate = useNavigate ();

  const [form, setForm] = useState ({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });

  const [error, setError] = useState ('');
  const [success, setSuccess] = useState ('');
  const [loading, setLoading] = useState (false);

  const onChange = e =>
    setForm ({
      ...form,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async e => {
    e.preventDefault ();

    setError ('');
    setSuccess ('');
    setLoading (true);

    try {
      await register (form);

      setSuccess ('Account created successfully. Redirecting to login...');

      setTimeout (() => {
        navigate ('/login');
      }, 1500);
    } catch (err) {
      setError (err.message || 'Unable to register.');
    } finally {
      setLoading (false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(150deg, var(--accent), var(--accent-dark))',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GraduationCap size={20} color="var(--ink)" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 19,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            AI TutorMatch
          </div>
        </div>

        <p className="auth-visual-quote">
          Create your student account and get matched with the best tutors for
          your learning journey.
        </p>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 12,
            color: '#8b98bd',
          }}
        >
          Student self-registration is enabled. Tutor and Admin accounts are
          created by the system administrator.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h1>Create Student Account</h1>

          <p className="lede">
            Register as a student to book tutoring sessions and monitor your
            academic progress.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label>First Name</label>
              <input
                className="input"
                name="name"
                placeholder="Lethabo"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label>Surname</label>
              <input
                className="input"
                name="surname"
                placeholder="Nkosi"
                value={form.surname}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label>Email Address</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="student@example.com"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <button
              className="btn btn-accent"
              style={{width: '100%'}}
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Create Student Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">
              <b>Sign in</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
