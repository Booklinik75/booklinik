const ProfileSelect = ({ value, name, onChange, label, options }) => {
  return (
    <div className="col-span-12 md:col-span-6">
      <label className="text-xs uppercase text-gray-500 w-full" htmlFor={name}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        name={name}
        autoComplete="sex"
        className="w-full rounded border-2 outline-none border-gray-300 p-3.5 transition hover:border-bali focus:border-shamrock"
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ProfileSelect;
