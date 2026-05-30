import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  fullWidth = true,
  className = "",
  ...props
}) => {

  const check =()=>{
    const {email,name,password} = form;

    if(email.trim() === '' || password.trim()=== ''){
      setError('fill in');
    }

  }

  return (
    <div className={`flex flex-col ${fullWidth ? "w-full" : ""} ${className} space-y-1`}>
      {label && <label className="text-xs text-gray-400 font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        title={`Enter your ${label}`}
        {...props}
        className={`px-4 py-3 rounded-xl bg-neutral-800 text-white outline-none transition
          focus:ring-2 focus:ring-white focus:ring-opacity-20 ${type === 'password' && 'select-none'}
          `}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};

export default Input;
