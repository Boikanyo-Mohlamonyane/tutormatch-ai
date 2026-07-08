import axiosClient from "./axiosClient";

// Matches AdminController (@RequestMapping "/api/admin")
export const adminApi = {
  getDashboard: () => axiosClient.get("/admin/dashboard").then((r) => r.data),

  createSubject: (payload) => axiosClient.post("/admin/create/subject", payload).then((r) => r.data),
  updateSubject: (subjectId, payload) =>
    axiosClient.put(`/admin/update-subject/${subjectId}`, payload).then((r) => r.data),
  deleteSubject: (subjectId) => axiosClient.delete(`/admin/delete-subject/${subjectId}`).then((r) => r.data),

  assignSubjectToTutor: (payload) =>
    axiosClient.post("/admin/assign-tutor-subject", payload).then((r) => r.data),

  createAdmin: (payload) => axiosClient.post("/admin/create-admin", payload).then((r) => r.data),
  createTutor: (payload) => axiosClient.post("/admin/create-tutor", payload).then((r) => r.data),

  getAllStudents: () => axiosClient.get("/admin/students").then((r) => r.data),
  getAllTutors: () => axiosClient.get("/admin/tutors").then((r) => r.data),
  getAllBookings: () => axiosClient.get("/admin/bookings").then((r) => r.data),

  deleteStudent: (studentId) => axiosClient.delete(`/admin/delete-student/${studentId}`).then((r) => r.data),
  deleteTutor: (tutorId) => axiosClient.delete(`/admin/delete-tutor/${tutorId}`).then((r) => r.data),

  approveBooking: (bookingId) => axiosClient.put(`/admin/approve-booking/${bookingId}`).then((r) => r.data),
  rejectBooking: (bookingId) => axiosClient.put(`/admin/reject-booking/${bookingId}`).then((r) => r.data),
};
