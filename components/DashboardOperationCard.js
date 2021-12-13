import Image from "next/image";
import Link from "next/link";
import { GrDocumentMissing } from "react-icons/gr";
import { FaUserClock, FaCreditCard, FaCheck, FaTimes } from "react-icons/fa";

const DashboardOperationCard = ({ booking, noActions, salesMode, withId }) => {
  const generateBookingStatus = (status) => {
    if (status === "awaitingDocuments")
      return {
        text: "Documents manquants",
        color: "red-500",
        icon: <GrDocumentMissing />,
      };
    if (status === "examining" || status === "awaitingEstimate")
      return {
        text: "Examen en cours",
        color: "yellow-500",
        icon: <FaUserClock />,
      };
    if (status === "awaitingPayment")
      return {
        text: "À régler",
        color: "blue-600",
        icon: <FaCreditCard />,
      };
    if (status === "validated")
      return {
        text: "Validé",
        color: "shamrock",
        icon: <FaCheck />,
      };
    if (status === "cancelled")
      return {
        text: "Annulé",
        color: "red",
        icon: <FaTimes />,
      };

    return undefined;
  };

  const bookingStatus = generateBookingStatus(booking.status);

  const surgeryCategoriesName = () => {
    const surgeryNameCategories = [];
    booking.surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length === 1) {
      return surgeryNameCategories.join(", ");
    } else {
      return surgeryNameCategories[0];
    }
  };

  return (
    <Link
      href={`/dashboard/${salesMode ? "sales/bookings/" : "operations/"}${
        booking.id
      }`}
    >
      <a className="rounded transition hover:bg-gray-100 hover:cursor-pointer">
        <div className="flex">
          <Image
            src={booking.hotelPhotoLink}
            width={97}
            height={80}
            className="rounded"
            alt="TBD"
            objectFit="cover"
          />
          <div className="p-3">
            {withId && <p className="text-xs ">id : {booking.id}</p>}

            <p className="text-leading">
              {surgeryCategoriesName()} -{" "}
              <span className="capitalize">{booking.city}</span>
            </p>
            <p className="text-xs text-bali">
              {booking.hotelName} •{" "}
              {booking.alternativeTotal
                ? booking.alternativeTotal
                : booking.total}
              &nbsp;€
            </p>
            {!noActions && bookingStatus && (
              <div className="flex gap-2">
                <p className={`text-${bookingStatus.color}`}>
                  {bookingStatus.icon}
                </p>
                <p
                  className={booking.status === "validated" && "text-shamrock"}
                >
                  {bookingStatus.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default DashboardOperationCard;
