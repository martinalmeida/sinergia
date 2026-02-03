import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText?: (text: string) => void;
}

export default function InputBase({
  placeholder,
  value,
  onChange,
  onChangeText,
  className,
  type,
  ...rest
}: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e);
    onChangeText?.(e.target.value);
  };

  const baseClasses =
    "outline-none w-full pl-8 px-4 py-2 rounded-xl bg-gray-200 text-gray-600 border-2 transition duration-300 ease-in-out focus:border-[#273459] focus:bg-white placeholder-gray-400";

  const paddingRight = isPassword ? "pr-10" : "";

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <input
        {...rest}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        type={isPassword ? (show ? "text" : "password") : type}
        className={`${baseClasses} ${paddingRight}`}
        aria-label={placeholder}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 focus:outline-none"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}