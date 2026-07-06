import { useState } from "react";

import "../../assets/styles/auth.css";
import "../../assets/styles/components.css";

function AuthModal({ type, closeModal }) {

  const isLogin = type === "login";

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

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const endpoint = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/register";

      const response = await fetch(endpoint, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...formData,
          academicAverage: parseFloat(
            formData.academicAverage || 0
          )
        })
      });

      const data = await response.text();

      setMessage(data);

    } catch (error) {

      setMessage("Connection failed.");

    }
  };

  return (

    <div className="modal-overlay">

      <div className="auth-modal">

        {/* CLOSE BUTTON */}
        <button
          className="close-modal"
          onClick={closeModal}
        >
          ✕
        </button>

        <h1>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p>
          {isLogin
            ? "Login to AI TutorMatch"
            : "Register as a student"}
        </p>

        {/* MESSAGE */}
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {!isLogin && (

            <div className="form-grid">

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
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
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Student Number</label>

                <input
                  type="text"
                  name="studentNumber"
                  placeholder="Student number"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Learning Style</label>

                <select
                  name="learningStyle"
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
                    Reading
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
                  placeholder="Academic average"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Risk Level</label>

                <select
                  name="riskLevel"
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

          )}

          {/* EMAIL */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
          >

            {isLogin ? "Login" : "Register"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AuthModal;