// Components/AuthStep.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Input from "./Input";

function FormStep({ form, setForm, isLogin, setIsLogin, handleAuth, error, loading, setStep }) {
  const [rememberMe, setRememberMe] = useState(false);
  form.remember = rememberMe;

  const toggleRemember = () => setRememberMe(!rememberMe);

  return (
    <motion.form
      onSubmit={handleAuth}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4.5 flex flex-col"
    >
      <h2 className="text-2xl font-semibold">{isLogin ? "Welcome back" : "Create account"}</h2>

      {/* Social Buttons */}
      <div className="flex py-1 w-80 items-center gap-3">
        <button type="button" className="social-btn cursor-pointer rounded-2xl bg-neutral-800 px-10 py-3 text-2xl hover:bg-neutral-700 transition">
          <FaGoogle className="text-red-400" />
        </button>
        <button type="button" className="social-btn cursor-pointer rounded-2xl bg-neutral-800 px-10 py-3 text-2xl hover:bg-neutral-700 transition">
          <FaFacebook className="text-blue-500" />
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 text-gray-400 mb-1">
        <span className="flex-1 h-px bg-gray-800" />
        Or
        <span className="flex-1 h-px bg-gray-800" />
      </div>

      {/* Name input for register */}
      {!isLogin && (
        <Input
          label="First Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}

      <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

      {/* Remember + Forgot */}
      {isLogin && (
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div title="remember Me in 30 days" className="flex items-center space-x-2">
            <span 
              className="w-5 h-5 relative overflow-hidden bg-slate-700 flex items-center cursor-pointer rounded-full"
              onClick={toggleRemember}
            >
              {rememberMe && <span className="w-[70%] h-[70%] bg-green-200 rounded-full mx-auto transition-all"></span>}
            </span>
            <span className={`${rememberMe && 'font-bold'} cursor-pointer`} onClick={toggleRemember}>Remember Me</span>
          </div>
          <span title="Password forgotten" className="underline cursor-pointer" onClick={() => setStep(2)}>Forgot password?</span>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-700 hover:bg-gray-800 cursor-pointer py-3 duratio-200 w-full rounded-xl font-semibold transition disabled:opacity-50"
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
      </button>

      <p className="text-sm text-center text-gray-400">
        {isLogin ? "No account?" : "Already have one?"}{" "}
        <span className="underline cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign up" : "Login"}
        </span>
      </p>
    </motion.form>
  );
}

export default FormStep;
