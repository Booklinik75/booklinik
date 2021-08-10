import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/booklinik-logo.svg";
import { useEffect, useState } from "react";

const BookingTopNavigation = ({ bookingData }) => {
  const [estimate, setEstimate] = useState(0);

  useEffect(() => {
    setEstimate(
      parseInt(bookingData.surgeryPrice) +
        parseInt(bookingData.totalExtraTravellersPrice) +
        parseInt(bookingData.hotelPrice) +
        parseInt(bookingData.roomPrice)
    );
  }, [
    bookingData.surgeryPrice,
    bookingData.totalExtraTravellersPrice,
    bookingData.hotelPrice,
    bookingData.roomPrice,
  ]);

  return (
    <div className="flex flex-row w-full items-center justify-between z-50 px-10 py-6 bg-white border-b border-gray-500">
      <div>
        <Link href="/">
          <a>
            <Image src={Logo} alt="Logo" />
          </a>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <p>Estimation de votre voyage :</p>
        <p className="py-3 px-6 rounded bg-shamrock text-xl text-white">
          {estimate === 0 ? "-" : estimate} €
        </p>
      </div>
    </div>
  );
};

export default BookingTopNavigation;
