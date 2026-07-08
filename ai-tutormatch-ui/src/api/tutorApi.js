import axiosClient from "./axiosClient";

// Matches TutorController (@RequestMapping "/api/tutor")
export const tutorApi = {
  getTutor: (tutorId) => axiosClient.get(`/tutor/${tutorId}`).then((r) => r.data),
  getTutorSubjects: (tutorId) => axiosClient.get(`/tutor/${tutorId}/subjects`).then((r) => r.data),
  getTutorBookings: (tutorId) => axiosClient.get(`/tutor/${tutorId}/bookings`).then((r) => r.data),

  approveBooking: (bookingId) => axiosClient.put(`/tutor/approve-booking/${bookingId}`).then((r) => r.data),
  rejectBooking: (bookingId) => axiosClient.put(`/tutor/reject-booking/${bookingId}`).then((r) => r.data),

  updateTutorProfile: (tutorId, payload) =>
    axiosClient.put(`/tutor/update-profile/${tutorId}`, payload).then((r) => r.data),

  getStudentPerformance: () => axiosClient.get("/tutor/student-performance").then((r) => r.data),
  getTutorDashboard: (tutorId) => axiosClient.get(`/tutor/dashboard/${tutorId}`).then((r) => r.data),
};
