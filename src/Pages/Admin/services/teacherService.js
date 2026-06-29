import api from "../../../services/api";

export const teacherService = {

  /* ================= DASHBOARD ================= */
  getDashboard: () =>
    api.get("/teacher/dashboard"),

  /* ================= CHAPTER (soumission) ================= */
  submitChapter: (courseId, data) =>
    api.post(`/teacher/courses/${courseId}/chapters`, data),

  /* ================= LESSON ================= */
  addLesson: (chapterId, data) =>
    api.post(`/teacher/chapters/${chapterId}/lessons`, data),

};