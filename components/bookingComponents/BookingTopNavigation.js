import Link from "next/link";
import Image from "next/image";
import Logo from "public/booklinik-logo.svg";
import { useContext, useEffect, useState } from "react";
import { BookContext } from "utils/bookContext.js";
import formatPrice from "../../utils/formatPrice.js";

const BookingTopNavigation = ({ bookingData, priceOverride, userProfile }) => {
  const [estimate, setEstimate] = useState(0);
  const { isChecked } = useContext(BookContext);

  useEffect(() => {
    setEstimate(
      Number(
        bookingData.surgeries ? bookingData.surgeries[0].surgeryPrice : 0
      ) +
        Number(bookingData.totalExtraTravellersPrice) +
        Number(bookingData.hotelPrice) *
          Number(bookingData.totalSelectedNights) +
        Number(bookingData.roomPrice) *
          Number(bookingData.totalSelectedNights) +
        (bookingData.options
          ?.map((option) => option.isChecked && Number(option.price))
          .reduce((a, b) => a + b) || 0)
    );
  }, [bookingData]);

  return (
    <div className="flex flex-row w-full items-center justify-between z-50 px-10 py-6 bg-white border-b border-gray-500 fixed">
      <div>
        <Link href="/">
          <a>
            <Image src={Logo} alt="Logo" />
          </a>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <p className="whitespace-nowrap text-xs sm:text-base">
          Estimation de votre voyage :
        </p>
        <p className="py-3 px-3 lg:px-6 rounded bg-shamrock text-base whitespace-nowrap sm:text-xl text-white">
          {priceOverride
            ? priceOverride
            : estimate === 0
            ? "-"
            : formatPrice(
                isChecked ? estimate - userProfile.referalBalance : estimate
              )}{" "}
          €
        </p>
      </div>
    </div>
  );
};

export default BookingTopNavigation;
