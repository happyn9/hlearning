import React, { useMemo } from "react";

const universityOptions = [
  { value: "", label: "" },
  { value: "ZCAS", label: "ZCAS" },
  { value: "UNZA", label: "UNZA" },
  { value: "NIPA", label: "NIPA" },
  { value: "UNILAS", label: "UNILAS" },
  { value: "KAVENDISH", label: "KAVENDISH" },
];

const ZcasProgram = [
  { value: "Software engineering", label: "Software engineering" },
  { value: "Finance", label: "Finance" },
  { value: "Computer science", label: "Computer science" },
  { value: "Networking", label: "Networking" },
];

const UNZAProgram = [
  { value: "Software engineering", label: "Software engineering" },
  { value: "Finance", label: "Finance" },
  { value: "Computer science", label: "Computer science" },
  { value: "Networking", label: "Networking" },
];

const NIPAProgram = [
  { value: "Software engineering", label: "Software engineering" },
  { value: "Finance", label: "Finance" },
  { value: "Computer science", label: "Computer science" },
  { value: "Networking", label: "Networking" },
];
const KAVENDISHProgram = [
  { value: "Software engineering", label: "Software engineering" },
  { value: "Finance", label: "Finance" },
  { value: "Computer science", label: "Computer science" },
  { value: "Networking", label: "Networking" },
];
const UNILASProgram = [
  { value: "Medecine", label: "Medecine" },
  { value: "Finance", label: "Finance" },
  { value: "Business", label: "Business" },
  { value: "Networking", label: "Networking" },
];

export default function FloatingSelect({
  label,
  value,
  onChange,
  isuniv = true,
  nameUniv = "",
  disabled,
}) {
  const options = useMemo(() => {
    if (isuniv) return universityOptions;

    switch (nameUniv) {
      case "ZCAS":
        return ZcasProgram;
      case "UNZA":
        return UNZAProgram;
      case "NIPA":
        return NIPAProgram;
      case "UNILAS":
        return UNILASProgram;
      case "KAVENDISH":
        return KAVENDISHProgram;
      default:
        return [];
    }
  }, [isuniv, nameUniv]);

  return (
    <div className="relative w-full group">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          ${disabled && "cursor-not-allowed opacity-60"}
          w-full py-4 px-4
          bg-neutral-900/60  text-gray-100
          rounded-xl outline-none
          peer transition-all duration-300 ease-out
          focus:border-amber-400
          focus:shadow-[0_0_12px_rgba(251,191,36,0.35)]
        `}
      >
        <option value="" disabled hidden />

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-gray-400 px-2 rounded-md
          pointer-events-none select-none
          transition-all duration-300 ease-out
          peer-focus:top-2 peer-focus:text-sm peer-focus:text-amber-400
          peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-sm
        "
      >
        {label}
      </label>
    </div>
  );
}
