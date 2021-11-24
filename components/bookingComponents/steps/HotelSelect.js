import Image from "next/image";
import StarRating from "../../StarRating";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useEffect } from "react";

const HotelSelectStep = ({
  booking,
  hotels,
  handleHotelSelect,
  setNextStep,
}) => {
  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (booking.hotel) setNextStep(true);
  }, [booking]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">
        Il est temps de choisir votre nid douillet pour le séjour.
      </h1>
      <p className="text-xs text-gray-500 uppercase">Hôtel</p>
      <div className="grid grid-cols-9 gap-4">
        {hotels.map((hotel) => {
          return hotel.city === booking.city ? (
            <div className="col-span-3 space-y-2" key={hotel.slug}>
              <input
                type="radio"
                name="hotel"
                value={hotel.slug}
                id={hotel.slug}
                className="hidden"
                required={true}
                onChange={(e) =>
                  handleHotelSelect(
                    hotel.slug,
                    hotel.extraPrice,
                    hotel.photo,
                    hotel.name,
                    hotel.rating,
                    hotel.id
                  )
                }
              />
              <label
                htmlFor={hotel.slug}
                className="transition hover:shadow hover:cursor-pointer"
              >
                <div className="h-64 relative">
                  <Image
                    src={hotel.photo}
                    layout="fill"
                    objectFit="cover"
                    alt={hotel.name}
                    className="rounded transition brightness-90 hover:brightness-50 bg-gray-200"
                  />
                  <div className="absolute  bottom-0 left-0 m-4">
                    {hotel.slug === booking.hotel ? (
                      <p className="flex rounded items-center px-5 py-2 max-w-max mb-2 opacity-80 transition hover:opacity-100 bg-shamrock text-white gap-2">
                        <AiOutlineCheckCircle />
                        Selectionné
                      </p>
                    ) : (
                      ""
                    )}
                    <h2 className="text-lg block w-full top-28 text-white text-left">
                      {hotel.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <StarRating value={hotel.rating} color="white" />
                      <p className="text-white text-xs">&bull;</p>
                      <p className="text-white text-xs capitalize">
                        {hotel.city}
                      </p>
                      <p className="text-white text-xs">&bull;</p>
                      <p className="text-white text-xs">+{hotel.extraPrice}€</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
};

export default HotelSelectStep;
