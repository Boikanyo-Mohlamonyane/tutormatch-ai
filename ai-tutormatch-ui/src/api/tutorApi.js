import axiosClient from './axiosClient';

// Matches TutorController (@RequestMapping "/api/tutor")
export const tutorApi = {
  // GET tutor by ID
  getTutor: tutorId =>
    axiosClient.get (`/api/tutor/${tutorId}`).then (r => r.data),

  // GET tutor subjects
  getTutorSubjects: tutorId =>
    axiosClient.get (`/api/tutor/${tutorId}/subjects`).then (r => r.data),

  // GET tutor bookings
  getTutorBookings: tutorId =>
    axiosClient.get (`/api/tutor/${tutorId}/bookings`).then (r => r.data),

  // PUT approve booking
  approveBooking: bookingId =>
    axiosClient
      .put (`/api/tutor/approve-booking/${bookingId}`)
      .then (r => r.data),

  // PUT reject booking
  rejectBooking: bookingId =>
    axiosClient
      .put (`/api/tutor/reject-booking/${bookingId}`)
      .then (r => r.data),

  // PUT update tutor profile
  updateTutorProfile: (tutorId, payload) =>
    axiosClient
      .put (`/api/tutor/update-profile/${tutorId}`, payload)
      .then (r => r.data),

  // GET student performance
  getStudentPerformance: () =>
    axiosClient.get ('/api/tutor/student-performance').then (r => r.data),

  // GET tutor dashboard
  getTutorDashboard: tutorId =>
    axiosClient.get (`/api/tutor/dashboard/${tutorId}`).then (r => r.data),
};
