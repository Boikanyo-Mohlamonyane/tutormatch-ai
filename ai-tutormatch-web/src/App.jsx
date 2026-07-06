// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

/* LANDING PAGE */
import Home from "./pages/landing/Home";

/* AUTH PAGES */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* DASHBOARDS */
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import TutorDashboard from "./pages/dashboard/tutor/TutorDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* LANDING PAGE */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ========================= */}
        {/* AUTHENTICATION */}
        {/* ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ========================= */}
        {/* STUDENT DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* ========================= */}
        {/* TUTOR DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/tutor/dashboard"
          element={<TutorDashboard />}
        />

        {/* ========================= */}
        {/* ADMIN DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
