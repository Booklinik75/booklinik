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
}) => {
  return (
    <div className="col-span-12 md:col-span-6">
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
        placeholder={label}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        accept={accept || ""}
        className="w-full rounded border-2 outline-none border-gray-200 p-3 transition hover:border-bali focus:border-shamrock disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default DashboardInput;
