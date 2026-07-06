
import { useState } from "react";

import "../../assets/styles/auth.css";
import "../../assets/styles/components.css";

function Register() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    studentNumber: "",
    name: "",
    surname: "",
    learningStyle: "",
    academicAverage: "",
    riskLevel: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...formData,
            academicAverage: parseFloat(
              formData.academicAverage
            )
          })
        }
      );

      const data = await response.text();

      setMessage(data);

      // CLEAR FORM
      setFormData({
        email: "",
        password: "",
        studentNumber: "",
        name: "",
        surname: "",
        learningStyle: "",
        academicAverage: "",
        riskLevel: ""
      });

    } catch (error) {

      setMessage(
        "Server connection failed."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>
          Register as a student on AI TutorMatch
        </p>

        {/* MESSAGE */}
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Surname</label>

              <input
                type="text"
                name="surname"
                placeholder="Enter surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Student Number</label>

              <input
                type="text"
                name="studentNumber"
                placeholder="Enter student number"
                value={formData.studentNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Learning Style</label>

              <select
                name="learningStyle"
                value={formData.learningStyle}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select learning style
                </option>

                <option value="VISUAL">
                  Visual
                </option>

                <option value="AUDITORY">
                  Auditory
                </option>

                <option value="READING">
                  Reading/Writing
                </option>

                <option value="KINESTHETIC">
                  Kinesthetic
                </option>

              </select>
            </div>

            <div className="form-group">
              <label>Academic Average</label>

              <input
                type="number"
                name="academicAverage"
                placeholder="Enter average"
                value={formData.academicAverage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Risk Level</label>

              <select
                name="riskLevel"
                value={formData.riskLevel}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select risk level
                </option>

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

              </select>
            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
          >

            {loading
              ? "Creating Account..."
              : "Register"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;
