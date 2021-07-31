import Image from "next/image";
import StarRating from "./StarRating";
import Link from "next/link";

const DestinationHotel = ({ hotel, countrySlug, citySlug, city, country }) => {
  return (
    <div className="col-span-1 space-y-2">
      <div className="w-full rounded-xl relative">
        <div className="relative h-48 rounded-xl">
          <Image
            src="https://via.placeholder.com/1000?text=en+attente+d&lsquo;image"
            layout="fill"
            objectFit="cover"
            alt="TBD"
            className="rounded-lg bg-gray-500"
          />
        </div>
        <div className="absolute mx-4 text-white bottom-4 space-y-1">
          <h3 className="text-lg">{hotel.name}</h3>
          <div className="flex col-row gap-2 items-center text-xs">
            <StarRating value={hotel.rating} color="white" />
            &bull;
            <p>{city}</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-600 text-justify mx-0.5">
          {hotel.excerpt}
        </p>
      </div>
    </div>
  );
};

export default DestinationHotel;
