import { useState } from "react";
import { UserPlus } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { useToast } from "../../context/ToastContext";

const SPECIALIZATIONS = [
  "ARTIFICIAL_INTELLIGENCE",
  "MACHINE_LEARNING",
  "DATA_SCIENCE",
  "SOFTWARE_ENGINEERING",
  "CYBER_SECURITY",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "DATABASE_SYSTEMS",
  "COMPUTER_NETWORKS",
  "CLOUD_COMPUTING",
  "DEVOPS",
  "COMPUTER_SCIENCE",
];

const emptyForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
  specialization: "",
  bio: "",
  yearsExperience: 0,
};

export default function CreateTutor() {
  const toast = useToast();

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "yearsExperience"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminApi.createTutor(form);

      toast.success(`${form.name} ${form.surname} has been onboarded.`);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Operations"
        title="Onboard a New Tutor"
        description="Create a tutor account directly."
      />

      <div className="panel" style={{ maxWidth: 700 }}>
        <div className="panel-body">
          <form onSubmit={onSubmit}>
            <div className="grid-2">
              <div className="field">
                <label>First Name</label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="field">
                <label>Surname</label>
                <input
                  className="input"
                  type="text"
                  name="surname"
                  value={form.surname}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Email Address</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="field">
                <label>Temporary Password</label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Specialization</label>
                <select
                  className="input"
                  name="specialization"
                  value={form.specialization}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Specialization</option>

                  {SPECIALIZATIONS.map((specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                    >
                      {specialization
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Years of Experience</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="yearsExperience"
                  value={form.yearsExperience}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Bio</label>
              <textarea
                className="input"
                rows={4}
                name="bio"
                placeholder="Brief description about the tutor..."
                value={form.bio}
                onChange={onChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner />
              ) : (
                <>
                  <UserPlus size={15} />
                  Create Tutor Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}