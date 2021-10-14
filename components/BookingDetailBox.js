const BookingDetailBox = ({ icon, children, col, title }) => {
  return (
    <div className={`col-span-${col} flex flex-col gap-1`}>
      {title && <p className="text-sm text-gray-500 uppercase">{title}</p>}
      <div className="flex gap-2 border border-gray-300 p-3 rounded">
        {icon}
        <p className="text-gray-500">{children}</p>
      </div>
    </div>
  );
};

export default BookingDetailBox;
