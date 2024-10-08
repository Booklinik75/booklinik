const DashboardInput = ({
  type,
  name,
  value,
  onChange,
  autoComplete,
  label,
  disabled,
  required,
  accept,
  min,
  max,
  multiple,
  className,
  placeholder,
}) => {
  return (
    <div className="col-span-12 flex-grow md:col-span-6 flex flex-col gap-2">
      <label className="text-xs uppercase text-gray-500 w-full" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder ?? label}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        multiple={multiple}
        accept={accept || ""}
        className={`w-full rounded border-2 outline-none border-gray-200 p-3 transition hover:border-bali focus:border-shamrock disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed ${
          className || ""
        }`}
      />
    </div>
  );
};

export default DashboardInput;
