import axiosClient from './axiosClient';

// Matches StudentController (@RequestMapping "/api/student")
export const studentApi = {
  // GET all subjects
  getAllSubjects: () =>
    axiosClient.get ('/api/student/subjects').then (r => r.data),

  // GET a single student by ID
  getStudent: studentId =>
    axiosClient.get (`/api/student/${studentId}`).then (r => r.data),

  // GET tutors by subject
  getTutorsBySubject: subjectId =>
    axiosClient
      .get (`/api/student/subject/${subjectId}/tutors`)
      .then (r => r.data),

  // POST book a session
  bookSession: payload =>
    axiosClient.post ('/api/student/book-session', payload).then (r => r.data),

  // GET student bookings
  getStudentBookings: studentId =>
    axiosClient.get (`/api/student/${studentId}/bookings`).then (r => r.data),

  // PUT cancel booking
  cancelBooking: bookingId =>
    axiosClient
      .put (`/api/student/cancel-booking/${bookingId}`)
      .then (r => r.data),

  // GET performance
  getPerformance: studentId =>
    axiosClient
      .get (`/api/student/${studentId}/performance`)
      .then (r => r.data),

  // PUT calculate risk level
  calculateRiskLevel: studentId =>
    axiosClient.put (`/api/student/${studentId}/risk`).then (r => r.data),

  // GET recommend tutor
  recommendTutor: subjectId =>
    axiosClient
      .get (`/api/student/recommend-tutor/${subjectId}`)
      .then (r => r.data),

  // GET student dashboard
  getStudentDashboard: studentId =>
    axiosClient.get (`/api/student/${studentId}/dashboard`).then (r => r.data),
};
