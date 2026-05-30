import { useEffect, useState } from "react";
import apiRequest from "../services/api";

export default function useRecommendation() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest("/recommendations/home")
      .then(setData)
      .catch(() => {});
  }, []);

  return data;
}
