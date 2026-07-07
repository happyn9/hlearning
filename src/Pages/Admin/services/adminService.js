import api from "../../../services/api";

export const adminService = {

  /* ================= PROGRAM ================= */
  getLearners: () => api.get("/admin/learners"),
  getPrograms: () => api.get("/admin/programs"),
  getChapters: () => api.get("/admin/chapters"),
  createProgram: (data) => api.post("/admin/programs", data),

  /* ================= CENTER ================= */
  getCenters: () => api.get("/admin/centers"),
  createCenter: (data) => api.post("/admin/centers", data),
  updateCenter: (centerId, data) => api.put(`/admin/centers/${centerId}`, data),
  deleteCenter: (centerId) => api.delete(`/admin/centers/${centerId}`),

  /* ================= TEACHER ================= */
  getTeachers: () => api.get("/admin/teachers"),
  createTeacher: (data) => api.post("/admin/teachers", data),
  updateTeacher: (teacherId, data) => api.put(`/admin/teachers/${teacherId}`, data),
  deleteTeacher: (teacherId) => api.delete(`/admin/teachers/${teacherId}`),

  /* ================= STUDENTS ================= */
  getStudents: () => api.get("/admin/students"),
  changeStudentCenter: (studentId, centerId) =>
    api.put(`/admin/students/${studentId}/center`, { center_id: centerId }),

  /* ================= COURSE ================= */
  createCourse: async (courseData, pin) =>
    api.post("/admin/courses", { course: courseData, pin }),
  getCourses: () => api.get("/admin/courses"),

  /* ================= CHAPTER ================= */
  createChapter: (courseId, data) =>
    api.post(`/admin/courses/${courseId}/chapters`, data),
  getPendingChapters: () => api.get("/admin/chapters/pending"),
  reviewChapter: (chapterId, data) =>
    api.put(`/admin/chapters/${chapterId}/review`, data),

  /* ================= LESSON ================= */
  createLesson: (chapterId, data) =>
    api.post(`/admin/chapters/${chapterId}/lessons`, data),

  /* ================= NOTIFICATIONS ================= */
  broadcastNotification: (data) => api.post("/api/notifications/broadcast", data),

  /* ================= PIN ================= */
  updatePin: (data) => api.put("/admin/update-pin", data),
  verifyPin: (pin) => api.post("/admin/verify-pin", { pin })
};