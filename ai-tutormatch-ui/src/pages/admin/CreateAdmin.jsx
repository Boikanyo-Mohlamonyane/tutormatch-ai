import { useState } from "react";
import { UserCog } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import { useToast } from "../../context/ToastContext";

const emptyForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
  department: "",
  phoneNumber: "",
  officeLocation: "",
  position: "",
};

const departments = [
  "COMPUTER_SCIENCE",
  "INFORMATION_TECHNOLOGY",
  "SOFTWARE_ENGINEERING",
  "MATHEMATICS",
  "PHYSICS",
  "ADMINISTRATION",
  "STUDENT_SUPPORT",
  "REGISTRY",
];

const positions = [
  "SYSTEM_ADMINISTRATOR",
  "FACULTY_ADMINISTRATOR",
  "PROGRAMME_COORDINATOR",
  "DEPARTMENT_HEAD",
  "REGISTRAR",
  "SUPPORT_ADMIN",
];

const formatLabel = (value) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function CreateAdmin() {
  const toast = useToast();

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await adminApi.createAdmin(form);

      toast.success("Administrator created successfully.");

      setForm(emptyForm);
    } catch (err) {
      toast.error(
        err?.response?.data ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create administrator."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Admin · Operations"
        title="Create Administrator"
        description="Grant another staff member administrative access."
      />

      <div className="panel" style={{ maxWidth: 700 }}>
        <div className="panel-body">
          <form onSubmit={onSubmit}>

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
              <span className="hint">
                The administrator should change this after first login.
              </span>
            </div>

            <div className="field">
              <label>Department</label>
              <select
                className="input"
                name="department"
                value={form.department}
                onChange={onChange}
                required
              >
                <option value="">Select Department</option>

                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {formatLabel(dept)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                className="input"
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
                placeholder="0712345678"
                required
              />
            </div>

            <div className="field">
              <label>Office Location</label>
              <input
                className="input"
                type="text"
                name="officeLocation"
                value={form.officeLocation}
                onChange={onChange}
                placeholder="Building A - Office 203"
                required
              />
            </div>

            <div className="field">
              <label>Position</label>
              <select
                className="input"
                name="position"
                value={form.position}
                onChange={onChange}
                required
              >
                <option value="">Select Position</option>

                {positions.map((position) => (
                  <option key={position} value={position}>
                    {formatLabel(position)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-accent"
              type="submit"
              disabled={submitting}
              style={{ width: "100%", marginTop: "20px" }}
            >
              {submitting ? (
                <Spinner />
              ) : (
                <>
                  <UserCog size={16} style={{ marginRight: "8px" }} />
                  Create Administrator
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}