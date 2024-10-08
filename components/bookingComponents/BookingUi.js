import BookingSideNavigation from "./BookingSideNavigation";
import BookingTopNavigation from "./BookingTopNavigation";

const BookingUi = ({ children, bookingData, step, userProfile }) => {
  return (
    <div className="max-h-screen w-full overflow-hidden">
     <BookingTopNavigation
        bookingData={bookingData}
        userProfile={userProfile}
      />
      <div className="grid grid-cols-10">
        <div className="col-span-2 hidden md:block">
      <BookingSideNavigation step={step} bookingData={bookingData} />
        </div>
        
        <div className="col-span-10 lg:col-span-8 shadow-xl h-full grid grid-cols-12 overflow-y-scroll">
       {children}
        </div>
      </div>
    </div>
  );
};

export default BookingUi;
