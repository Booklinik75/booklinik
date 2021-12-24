import BookingStep from "./BookingStep";
import {
  FaHospital,
  FaCalendarAlt,
  FaUserAlt,
  FaPlane,
  FaBuilding,
  FaBed,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";

const BookingSideNavigation = ({ step, bookingData }) => {
  console.log("booking data", bookingData);
  return (
    <div
      style={{ height: "calc(100vh - 101px)" }}
      className="p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 uppercase">
          1. Types d&apos;opérations
        </p>
        <BookingStep currentStep={step} stepId={0}>
          <FaHospital />
          <p>
            {bookingData.surgeries[0].surgeryName !== ""
              ? bookingData.surgeries[0].surgeryName
              : "Sélectionnez une opération"}
          </p>
        </BookingStep>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 uppercase">2. Date de départ</p>
        <BookingStep currentStep={step} stepId={1}>
          <FaCalendarAlt />
          <p>
            {bookingData.endDate !== ""
              ? `${moment(bookingData.startDate).format(
                  "DD/MM/YYYY"
                )} - ${moment(bookingData.endDate).format("DD/MM/YYYY")}`
              : "Date de départ"}
          </p>
        </BookingStep>
        <BookingStep currentStep={step} stepId={2}>
          <FaUserAlt />
          <p>
            {step >= 2
              ? `${
                  1 +
                  bookingData.extraTravellers +
                  bookingData.extraChilds +
                  bookingData.extraBabies
                } voyageur(s)`
              : "Nombre de voyageurs"}
          </p>
        </BookingStep>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 uppercase">
          3. Destination du voyage
        </p>
        <BookingStep currentStep={step} stepId={3}>
          <FaPlane />
          <p className="first-letter:capitalize">
            {bookingData.city ? bookingData.city : "Ville"}
          </p>
        </BookingStep>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 uppercase">4. Hôtel</p>
      </div>
      <BookingStep currentStep={step} stepId={4}>
        <FaBuilding />
        <p>{bookingData.hotelName ? bookingData.hotelName : "Chambres"}</p>
      </BookingStep>
      <BookingStep currentStep={step} stepId={5}>
        <FaBed />
        <p>{bookingData.roomName ? bookingData.roomName : "Chambres"}</p>
      </BookingStep>
      <BookingStep currentStep={step} stepId={6}>
        <BsThreeDots />
        <p>Option</p>
      </BookingStep>
    </div>
  );
};

export default BookingSideNavigation;
