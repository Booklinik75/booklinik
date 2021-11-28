import Image from "next/image";
import Link from "next/link";
import { GrDocumentMissing } from "react-icons/gr";
import { FaUserClock, FaCreditCard, FaCheck, FaTimes } from "react-icons/fa";

const BookingCard = ({ booking }) => {
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

  return (
    <Link href={`/dashboard/operations/${booking.id}`}>
      <a>
        <div className="flex flex-col gap-4 rounded group">
          <div className="transition group-hover:shadow-lg">
            <div className="relative h-56 overflow-hidden rounded">
              <Image
                src={booking.hotelPhotoLink}
                alt={booking.hotelName}
                layout="fill"
                className="bg-gray-100 "
              />
              {bookingStatus && (
                <div className="absolute bg-white rounded p-3 m-4 flex gap-2 items-center drop-shadow-sm" style={{zIndex: "8"}}>
                  <p className={`text-${bookingStatus.color}`}>
                    {bookingStatus.icon}
                  </p>
                  <p
                    className={
                      booking.status === "validated" && "text-shamrock"
                    }
                  >
                    {bookingStatus.text}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg transition group-hover:underline">
              {booking.surgeryName} à {booking.city}
            </p>
            <p className="text-sm text-bali font-bold">
              Witt Istanbul Suites &bull;{" "}
              {booking.alternativeTotal
                ? booking.alternativeTotal
                : booking.total}
              &nbsp;€
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default BookingCard;
