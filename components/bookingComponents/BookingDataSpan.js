const BookingDataSpan = ({ string, children,color }) => {
  return (
    <span className={`border border-${color} rounded px-3 py-1.5 mx-2 min-w-max`}>
      {string ? string : ""}
      {children ? children : ""}
    </span>
  );
};

export default BookingDataSpan;
