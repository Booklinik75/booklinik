import Image from "next/image";
import { useState } from "react";
import StarRating from "../../StarRating";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

const HotelSelectStep = ({
  booking,
  hotels,
  handleHotelSelect,
  setNextStep,
  setStep
}) => {
  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (booking.hotel) setNextStep(true);
  }, [booking]);
  const [hover,setHover]=useState(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">
        Il est temps de choisir votre nid douillet pour le séjour.
      </h1>
      <p className="text-xs text-gray-500 uppercase">Hôtel</p>
      <div className="grid grid-cols-9 gap-4">
        {hotels.map((hotel,x) => {
          return hotel.city === booking.city ? (
            <div
              className={`col-span-9 lg:col-span-3 space-y-2 transition-opacity ${
                booking.hotel && hotel.slug !== booking.hotel
                  ? "opacity-60"
                  : "opacity-100"
              }`}
              key={hotel.slug}
              
            >
            
              <input
                type="radio"
                name="hotel"
                value={hotel.slug}
                id={hotel.slug}
                className="hidden"
                required={true}
                onChange={(e) =>{
                  window.scrollTo(0, 0);
                  setTimeout(() => { window.scrollTo(0, 0); }, 100);
                  handleHotelSelect(
                    hotel.slug,
                    hotel.extraPrice,
                    hotel.photo,
                    hotel.name,
                    hotel.rating,
                    hotel.id
                  );  setStep((s) => s + 1)
                }
                }
              />
              <label
                htmlFor={hotel.slug}
                className="transition hover:shadow hover:cursor-pointer"
                onMouseEnter={(e)=>setHover(hotel.slug)}
                onMouseLeave={(e)=>setHover(null)}
              >
                <div className="h-64 relative">
                  <Image
                    src={hotel.photo}
                    layout="fill"
                    objectFit="cover"
                    alt={hotel.name}
                    className= {`${hover===hotel.slug ?"brightness-50 bg-gray-200 scale-150 transition duration-800 ":"rounded transition brightness-90  scale-100  duration-700"}`}
                  />
                  <div className="absolute bottom-0 left-0 p-4 h-full flex justify-between flex-col">
                    {hotel.slug === booking.hotel ? (
                      <p className="flex rounded items-center px-5 py-2 max-w-max mb-2 opacity-80 transition hover:opacity-100 bg-shamrock text-white gap-2">
                        <AiOutlineCheckCircle />
                        Selectionné
                      </p>
                    ) : (
                      <p className="flex rounded items-center opacity-80 transition hover:opacity-100 text-shamrock gap-2 max-w-max">
                        <BsCircle className="text-4xl text-shamrock" />
                      </p>
                    )}
                    <div>
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
                       {hotel.extraPrice > 0 ? (
                         <p className="text-white text-s">
                         À partir de +{hotel.extraPrice}€
                         </p>
                     ) : (
                       ""
                     )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                <Markdown source={hotel.excerpt} />
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
