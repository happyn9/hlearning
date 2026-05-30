import axios from "axios";


export const subscribeToCourse = async ({ courseId, billing }) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/subscribe`,
      { course_ids: [courseId], billing }, // <- payload correct
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};

export const subscribeToMultiplePlans = async (courseIds) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/subscribe/multiple`,
      { subscription_ids: courseIds }, // <- backend multiple subscriptions
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};

