import Image from "next/image";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useEffect } from "react";

const CitySelectStep = ({
  booking,
  countries,
  cities,
  hotels,
  handleChange,
  setNextStep,
}) => {
  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (booking.city) setNextStep(true);
  }, [booking]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">Où voulez-vous partir ?</h1>
      <p className="text-xs text-gray-500 uppercase">Destinations</p>
      <div className="grid grid-cols-9 gap-4">
        {countries.map((country) => {
          return cities.map((city) => {
            length = hotels.filter(function (hotel) {
              return hotel.city === city.slug ? hotel : false;
            }).length;

            return city.country === country.slug ? (
              <div className="col-span-9 lg:col-span-3 space-y-2">
                <input
                  type="radio"
                  name="city"
                  value={city.slug}
                  id={city.slug}
                  className="hidden"
                  required={true}
                  onChange={handleChange}
                  noValidate
                />
                <label
                  htmlFor={city.slug}
                  className="transition hover:shadow hover:cursor-pointer"
                >
                  <div className="h-64 relative">
                    <Image
                      src={city.photo}
                      layout="fill"
                      objectFit="cover"
                      alt={city.name}
                      className="rounded bg-gray-200"
                    />
                    <h2 className="text-4xl block absolute w-full top-28 text-white text-center">
                      {city.name}
                    </h2>
                    {city.slug === booking.city ? (
                      <p className="flex rounded items-center px-5 py-2 opacity-80 transition hover:opacity-100 bg-shamrock text-white gap-2 absolute bottom-0 left-0 m-2">
                        <AiOutlineCheckCircle />
                        Selectionné
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </label>
                <p className="text-xs">
                  {city.name}, {country.name} &bull;{" "}
                  <span className="text-shamrock">
                    {length} hôtels disponibles
                  </span>
                </p>
              </div>
            ) : (
              ""
            );
          });
        })}
      </div>
    </div>
  );
};

export default CitySelectStep;
