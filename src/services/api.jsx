import axios from "axios";

const api = axios.create({
  baseURL: "https://h-back-2.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API ERROR:", error.response?.status, error.response?.data);
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;