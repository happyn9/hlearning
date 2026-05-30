import api from "./api";

export const getPremiumCourses = async (program = null) => {
  const url = program ? `/premium/courses?program=${program}` : "/premium/courses";
  return await api.get(url);
};

export const getPremiumCourse = async (courseId) => {
  return await api.get(`/premium/${courseId}`);
};



