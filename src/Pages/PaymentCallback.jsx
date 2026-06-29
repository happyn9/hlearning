import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [courseId, setCourseId] = useState(null); // ← manquait

  useEffect(() => {
    const txRef         = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");
    const flwStatus     = searchParams.get("status");

    if (flwStatus !== "successful" || !txRef || !transactionId) {
      setStatus("failed");
      return;
    }

    api.post("/pay/verify", { tx_ref: txRef, transaction_id: transactionId })
      .then((res) => {
        setCourseId(res.course_id);
        setStatus("success");
      })
      .catch(() => setStatus("failed"));
  }, []);

  if (status === "verifying")
    return (
      <div className="h-screen flex items-center justify-center bg-[#111315] text-white">
        <p className="text-slate-400 animate-pulse">Verifying payment...</p>
      </div>
    );

  if (status === "success")
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#111315] text-white gap-4">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-semibold">Payment successful!</h1>
        <p className="text-slate-400">You now have access to your course.</p>
        <button
          onClick={() => navigate(`/course/info/${courseId}`)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-semibold transition"
        >
          Start Course
        </button>
      </div>
    );

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#111315] text-white gap-4">
      <div className="text-5xl">❌</div>
      <h1 className="text-2xl font-semibold">Payment failed</h1>
      <p className="text-slate-400">Something went wrong. Please try again.</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-slate-700 hover:bg-slate-600 px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Go back
      </button>
    </div>
  );
}