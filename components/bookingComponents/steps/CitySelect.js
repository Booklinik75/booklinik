import Image from "next/image";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";
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
              <div className="col-span-9 lg:col-span-3 space-y-2 p-4 border bg-gray-100 border-gray-400 rounded">
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
                  className="transition hover:shadow hover:cursor-pointer space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="">
                      {city.name}, {country.name} &bull;{" "}
                      <span className="text-shamrock">
                        {length} hôtels disponibles
                      </span>
                    </p>
                  </div>
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
                      <p className="flex rounded items-center px-5 py-2 opacity-80 transition hover:opacity-100 bg-shamrock text-white gap-2 absolute top-0 left-0 m-2">
                        <AiOutlineCheckCircle />
                        Selectionné
                      </p>
                    ) : (
                      <p className="flex rounded items-center p-2 opacity-80 transition hover:opacity-100 text-shamrock gap-2 absolute top-0 left-0 m-2">
                        <BsCircle className="text-4xl text-shamrock" />
                      </p>
                    )}
                  </div>
                </label>
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
