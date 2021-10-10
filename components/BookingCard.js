import Image from "next/image";
import Link from "next/link";

const BookingCard = ({ booking }) => {
  return (
    <Link href={`/dashboard/operations/${booking.id}`}>
      <a>
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded">
            <Image
              src={booking.hotelPhotoLink}
              alt={booking.hotelName}
              layout="fill"
            />
            <p className="text-lg">
              {booking.surgeryName} à {booking.city}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default BookingCard;
