export default function FloatingInput({ label, type, value, onChange,disabled,descr }) {
  return (
    <div className="relative w-full group">
      <input
        descr ={descr}
        type={type}
        value={value}
        onChange={onChange}
        disabled = {disabled}
        className={` ${disabled && 'cursor-wait'} ${descr === 'otp' && 'text-center'}
          w-full py-3 px-4
          bg-gray-900 border border-gray-700 text-gray-100 
          rounded-xl outline-none
          
          peer transition-all duration-300 ease-out

          focus:border-amber-400
          focus:shadow-[0_0_12px_rgba(251,191,36,0.35)]
        `}
        placeholder=" "
        autoComplete="off"
      />

      <label
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-gray-400 px-2
          pointer-events-none select-none
          transition-all duration-300 ease-out

          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-500

          peer-focus:top-2
          peer-focus:-translate-y-1/2
          peer-focus:text-sm
          peer-focus:text-amber-400
          rounded-md
        "
      >
        {label}
      </label>
    </div>
  );
}
