import api from "../../../services/api";

export const adminService = {

  /* ================= PROGRAM ================= */
  getPrograms: () =>
    api.get("/admin/programs"),

  getChapters: () =>
    api.get("/admin/chapters"),

  createProgram: (data) =>
    api.post("/admin/programs", data),

  /* ================= COURSE ================= */
  createCourse: async (courseData, pin) => {
    console.log("PIN SENT:", pin);

    return await api.post("/admin/courses", {
    course: courseData,
    pin: pin
    });
  },

  getCourses: () =>
    api.get("/admin/courses"),

  /* ================= CHAPTER ================= */
  createChapter: (courseId, data) =>
    api.post(`/admin/courses/${courseId}/chapters`, data),

  /* ================= LESSON ================= */
  createLesson: (chapterId, data) =>
    api.post(`/admin/chapters/${chapterId}/lessons`, data),



  /* ================= PIN ================= */
  updatePin: (data) =>
    api.put("/admin/update-pin", data),

  verifyPin: (pin) =>
    api.post("/admin/verify-pin", {
      pin
    })
};