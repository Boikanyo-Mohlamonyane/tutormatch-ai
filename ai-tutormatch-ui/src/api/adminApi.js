import axiosClient from './axiosClient';

// ==========================================
// ADMIN API
// Base URL: /api/admin
// ==========================================

export const adminApi = {
  // ==========================================
  // DASHBOARD
  // ==========================================
  getDashboard: () =>
    axiosClient.get ('/admin/dashboard').then (response => response.data),

  // ==========================================
  // SUBJECTS
  // ==========================================

  // GET ALL SUBJECTS
  getAllSubjects: () =>
    axiosClient.get ('/admin/subjects').then (response => response.data),

  // CREATE SUBJECT
  createSubject: payload =>
    axiosClient
      .post ('/admin/create/subject', payload)
      .then (response => response.data),

  // UPDATE SUBJECT
  updateSubject: (subjectId, payload) =>
    axiosClient
      .put (`/admin/update-subject/${subjectId}`, payload)
      .then (response => response.data),

  // DELETE SUBJECT
  deleteSubject: subjectId =>
    axiosClient
      .delete (`/admin/delete-subject/${subjectId}`)
      .then (response => response.data),

  // ==========================================
  // ASSIGN SUBJECT TO TUTOR
  // ==========================================
  assignSubjectToTutor: payload =>
    axiosClient
      .post ('/admin/assign-tutor-subject', payload)
      .then (response => response.data),

  // ==========================================
  // ADMINS
  // ==========================================
  createAdmin: payload =>
    axiosClient
      .post ('/admin/create-admin', payload)
      .then (response => response.data),

  // ==========================================
  // TUTORS
  // ==========================================
  createTutor: payload =>
    axiosClient
      .post ('/admin/create-tutor', payload)
      .then (response => response.data),

  getAllTutors: () =>
    axiosClient.get ('/admin/tutors').then (response => response.data),

  deleteTutor: tutorId =>
    axiosClient
      .delete (`/admin/delete-tutor/${tutorId}`)
      .then (response => response.data),

  // ==========================================
  // STUDENTS
  // ==========================================
  getAllStudents: () =>
    axiosClient.get ('/admin/students').then (response => response.data),

  deleteStudent: studentId =>
    axiosClient
      .delete (`/admin/delete-student/${studentId}`)
      .then (response => response.data),

  // ==========================================
  // BOOKINGS
  // ==========================================
  getAllBookings: () =>
    axiosClient.get ('/admin/bookings').then (response => response.data),

  approveBooking: bookingId =>
    axiosClient
      .put (`/admin/approve-booking/${bookingId}`)
      .then (response => response.data),

  rejectBooking: bookingId =>
    axiosClient
      .put (`/admin/reject-booking/${bookingId}`)
      .then (response => response.data),
};
