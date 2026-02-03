import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface Props
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value"
  > {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SelectBaseComponent({
  options,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  className,
  ...rest
}: Props) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedValue = e.target.value;

    // No procesar si es el valor del placeholder
    if (selectedValue === "") return;

    onChange?.(selectedValue);
  };

  const baseClasses =
    "outline-none w-full px-4 py-2 rounded-xl bg-gray-200 text-gray-600 border-2 transition duration-300 ease-in-out focus:border-[#273459] focus:bg-white placeholder-gray-400 cursor-pointer";

  // Determinar si mostrar el placeholder
  const showPlaceholder = !value || value === "";

  return (
    <select
      {...rest}
      value={showPlaceholder ? "" : value}
      onChange={handleChange}
      className={`${baseClasses} ${className ?? ""}`}
      aria-label={placeholder}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}