import StarRating from "../../StarRating";
import Image from "next/image";
import slugify from "slugify";
import { useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";

const OptionsSelectStep = ({
  options,
  booking,
  handleOptionsSelect,
  setNextStep,
}) => {
  const [optionsList, setOptionsList] = useState(
    options[booking.hotelId][0].map((opt) => {
      return { ...opt, isChecked: false };
    })
  );

  function handleOptionsListChange(event, index) {
    let newOptions = optionsList.slice();
    newOptions[index].isChecked = event.target.checked === false ? false : true;
    setOptionsList(newOptions);
  }

  useEffect(() => {
    handleOptionsSelect(optionsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsList]);

  useEffect(() => {
    setNextStep(true);
  }, []);

  return (
    <div className="space-y-6 h-full">
      {console.log(booking)}
      <h1 className="text-2xl mb-6">
        C&apos;est noté, désirez-vous compléter votre voyage avec des offres
        complémentaires ?
      </h1>
      <div className="grid grid-cols-9 gap-12 h-3/4 max-h-full">
        <div className="hidden  col-span-9 lg:col-span-3 space-y-3 order-last lg:block lg:order-first">
          <p className="text-xs text-gray-500 uppercase pt-2">Hôtel</p>
          <div className="h-64 relative">
            <Image
              src={booking.hotelPhotoLink}
              layout="fill"
              objectFit="cover"
              alt={booking.hotelName}
              className="rounded transition brightness-75"
            />
            <div className="absolute bottom-0 left-0 m-4">
              <h2 className="text-lg block w-full top-28 text-white text-left">
                {booking.hotelName}
              </h2>
              <div className="flex items-center gap-4">
                <StarRating value={booking.hotelRating} color="white" />
                <p className="text-white text-xs">&bull;</p>
                <p className="text-white text-xs capitalize">{booking.city}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 uppercase pt-2">Chambre</p>
          <div className="h-64 relative">
            <Image
              src={booking.roomPhotoLink}
              layout="fill"
              objectFit="cover"
              alt={booking.roomName}
              className="rounded transition brightness-75"
            />
            <div className="absolute bottom-0 left-0 m-4">
              <h2 className="text-lg block w-full top-28 text-white text-left">
                {booking.roomName}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-white text-xs capitalize">
                  {booking.roomName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 lg:col-span-6">
          <p className="text-xs text-gray-500 uppercase pt-2 grid-cols-2 mb-3">
            Options
          </p>
          <div className="grid grid-cols-2 gap-4">
            {optionsList.map((option, index) => {
              return (
                <div key={index} className="col-span-2 lg:col-span-1">
                  <label
                    htmlFor={slugify(option.name)}
                    className={`border-2 px-6 py-3 rounded w-full flex justify-between items-center hover:border-bali hover:border-shamrock ${
                      optionsList[index].isChecked === true
                        ? "border-shamrock"
                        : ""
                    }`}
                  >
                    {option.name}
                    <div className="flex items-center gap-2 relative">
                      <p className="text-sm text-gray-600 uppercase">
                        {parseInt(option.price) === 0
                          ? "Gratuit"
                          : `+${option.price}€`}
                      </p>
                      <input
                        type="checkbox"
                        name={slugify(option.name)}
                        id={slugify(option.name)}
                        checked={optionsList[index].isChecked}
                        onChange={(event) =>
                          handleOptionsListChange(event, index)
                        }
                        className="opacity-0 absolute"
                      />
                      {optionsList[index].isChecked === true ? (
                        <span className="text-shamrock">
                          <AiFillCheckCircle size={20} />
                        </span>
                      ) : (
                        <span className="text-gray-500 transition hover:text-bali">
                          <BsCircle size={20} />
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsSelectStep;
