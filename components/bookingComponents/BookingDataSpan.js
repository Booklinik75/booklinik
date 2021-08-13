const BookingDataSpan = ({ string, children }) => {
  return (
    <span className="border border-shamrock rounded px-3 py-1.5 mx-2">
      {string ? string : ""}
      {children ? children : ""}
    </span>
  );
};

export default BookingDataSpan;
