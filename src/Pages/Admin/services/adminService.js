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

  /* ================= TEACHER ================= */
  getTeachers: () => api.get("/admin/teachers"),
  createTeacher: (data) => api.post("/admin/teachers", data),

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

  /* ================= PIN ================= */
  updatePin: (data) => api.put("/admin/update-pin", data),
  verifyPin: (pin) => api.post("/admin/verify-pin", { pin })
};