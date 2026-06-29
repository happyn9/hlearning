import api from "../../../services/api";

export const studentService = {

  /* ================= COURSES ================= */
  getCourses: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.language) params.append("language", filters.language);
    const query = params.toString();
    return api.get(`/student/courses${query ? `?${query}` : ""}`);
  },

  getCourseDetail: (courseId) =>
    api.get(`/student/courses/${courseId}`),

  /* ================= ENROLLMENT / PAYMENT ================= */
  enrollCourse: (courseId, mode) =>
    api.post(`/student/courses/${courseId}/enroll`, { mode }),

};