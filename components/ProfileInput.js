const ProfileInput = ({ type, name, value, onChange, autoComplete, label }) => {
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
        className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock"
      />
    </div>
  );
};

export default ProfileInput;
