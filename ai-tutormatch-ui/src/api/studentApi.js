import axiosClient from "./axiosClient";

// Matches StudentController (@RequestMapping "/api/student")
export const studentApi = {
  getAllSubjects: () => axiosClient.get("/student/subjects").then((r) => r.data),
  getStudent: (studentId) => axiosClient.get(`/student/${studentId}`).then((r) => r.data),
  getTutorsBySubject: (subjectId) =>
    axiosClient.get(`/student/subject/${subjectId}/tutors`).then((r) => r.data),

  bookSession: (payload) => axiosClient.post("/student/book-session", payload).then((r) => r.data),
  getStudentBookings: (studentId) => axiosClient.get(`/student/${studentId}/bookings`).then((r) => r.data),
  cancelBooking: (bookingId) => axiosClient.put(`/student/cancel-booking/${bookingId}`).then((r) => r.data),

  getPerformance: (studentId) => axiosClient.get(`/student/${studentId}/performance`).then((r) => r.data),
  calculateRiskLevel: (studentId) => axiosClient.put(`/student/${studentId}/risk`).then((r) => r.data),
  recommendTutor: (subjectId) => axiosClient.get(`/student/recommend-tutor/${subjectId}`).then((r) => r.data),
  getStudentDashboard: (studentId) => axiosClient.get(`/student/${studentId}/dashboard`).then((r) => r.data),
};
