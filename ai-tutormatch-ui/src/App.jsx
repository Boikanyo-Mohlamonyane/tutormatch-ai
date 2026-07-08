import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/Students";
import AdminTutors from "./pages/admin/Tutors";
import AdminSubjects from "./pages/admin/Subjects";
import AdminAssignSubject from "./pages/admin/AssignSubject";
import AdminCreateTutor from "./pages/admin/CreateTutor";
import AdminCreateAdmin from "./pages/admin/CreateAdmin";
import AdminBookings from "./pages/admin/Bookings";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSubjects from "./pages/student/Subjects";
import StudentFindTutors from "./pages/student/FindTutors";
import StudentRecommend from "./pages/student/Recommend";
import StudentMyBookings from "./pages/student/MyBookings";
import StudentPerformance from "./pages/student/Performance";

import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorMySubjects from "./pages/tutor/MySubjects";
import TutorBookings from "./pages/tutor/Bookings";
import TutorStudentPerformance from "./pages/tutor/StudentPerformance";
import TutorProfile from "./pages/tutor/Profile";

function RoleHome() {
  const { user } = useAuth();
  return <Navigate to={`/${(user?.role || "student").toLowerCase()}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin workspace */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="tutors" element={<AdminTutors />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="assign-subject" element={<AdminAssignSubject />} />
        <Route path="create-tutor" element={<AdminCreateTutor />} />
        <Route path="create-admin" element={<AdminCreateAdmin />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      {/* Student workspace */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="find-tutor" element={<StudentFindTutors />} />
        <Route path="subject/:subjectId/tutors" element={<StudentFindTutors />} />
        <Route path="recommend" element={<StudentRecommend />} />
        <Route path="bookings" element={<StudentMyBookings />} />
        <Route path="performance" element={<StudentPerformance />} />
      </Route>

      {/* Tutor workspace */}
      <Route
        path="/tutor"
        element={
          <ProtectedRoute roles={["TUTOR"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TutorDashboard />} />
        <Route path="subjects" element={<TutorMySubjects />} />
        <Route path="bookings" element={<TutorBookings />} />
        <Route path="student-performance" element={<TutorStudentPerformance />} />
        <Route path="profile" element={<TutorProfile />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleHome />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
