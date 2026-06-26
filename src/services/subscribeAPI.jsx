import api from "./api";


export const getPremiumCourses = async (program = null) => {
  const url = program ? `/premium/courses?program=${program}` : "/premium/courses";
  return await api.get(url);
};

export const getPremiumCourse = async (courseId) => {
  return await api.get(`/premium/${courseId}`);
};


export const initiatePayment = async ({ course_id, billing, phone, operator }) => {
  const response = await api.post("/pay/initiate", {
    course_id: course_id,
    billing,
    phone,
    operator,
  });
  return response; 
};

export const checkSubscription = async (courseId) => {
  const response = await api.get(`/pay/check/${courseId}`);
  return response?.subscribed ?? false;
};