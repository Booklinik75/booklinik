import BookingUi from "../../components/bookingComponents/BookingUi";
import {
  getCountries,
  getCities,
  getHotels,
  getOperationCategories,
  getSurgeries,
  getOptions,
} from "../../utils/ServerHelpers";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { AiFillInfoCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import Head from "next/head";
import Calendar from "react-calendar";
import { useEffect } from "react";
import Image from "next/image";
import { getBackEndAsset } from "../../utils/ServerHelpers";

export const getStaticProps = async () => {
  const countries = await getCountries();
  const cities = await getCities();
  const hotels = await getHotels();
  const surgeryCategories = await getOperationCategories();
  const surgeries = await getSurgeries();
  const options = await getOptions();

  const hotelsImageT = await Promise.all(
    hotels.map(async (hotel, index, array) => {
      let image = await getBackEndAsset(hotel.photo);
      hotels[index].photo = image;
    })
  );

  const citiesImageT = await Promise.all(
    cities.map(async (city, index, array) => {
      let image = await getBackEndAsset(city.photo);
      cities[index].photo = image;
    })
  );

  return {
    props: {
      countries,
      cities,
      hotels,
      surgeryCategories,
      surgeries,
      options,
    },
  };
};

const NewBookingContainer = ({
  countries,
  cities,
  hotels,
  surgeryCategories,
  surgeries,
  options,
}) => {
  const [booking, setBooking] = useState({
    surgeryCategory: "",
    surgery: "",
    surgeryPrice: 0,
    startDate: "",
    endDate: "",
    extraTravellers: 0,
    extraChilds: 0,
    extraBabies: 0,
    totalExtraTravellersPrice: 0,
    city: "",
  });

  const extraTravellersSupplement = 450;
  const extraChildsSupplement = 450;
  const extraBabiesSupplement = 450;

  useEffect(() => {
    let totalExtraTravellers =
      extraTravellersSupplement * booking.extraTravellers +
      extraChildsSupplement * booking.extraChilds +
      extraBabiesSupplement * booking.extraBabies;

    setBooking({
      ...booking,
      totalExtraTravellersPrice: totalExtraTravellers,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.extraTravellers, booking.extraChilds, booking.extraBabies]);

  const [step, setStep] = useState(0);

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const onCalendarStartDateChange = (e) => {
    setBooking({
      ...booking,
      startDate: e,
    });
  };

  const onCalendarEndDateChange = (e) => {
    setBooking({
      ...booking,
      endDate: e,
    });
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const handleIncrement = (e) => {
    if (e.target.attributes.do.value === "add") {
      setBooking({
        ...booking,
        [e.target.attributes.name.value]:
          booking[e.target.attributes.name.value] + 1,
      });
    } else if (
      e.target.attributes.do.value === "substract" &&
      booking[e.target.attributes.name.value] > 0
    ) {
      setBooking({
        ...booking,
        [e.target.attributes.name.value]:
          booking[e.target.attributes.name.value] - 1,
      });
    }
  };

  return (
    <BookingUi bookingData={booking} step={step}>
      <Head>
        <title>Booklinik | Réservation</title>
      </Head>
      <div className="col-span-12 p-10">
        <form>
          {step === 0 ? (
            <div className="space-y-6">
              <h1 className="text-2xl mb-6">
                Selectionnez votre opération et estimez le coût de votre voyage.
              </h1>
              <div className="space-y-2">
                <h2 className="text-xs uppercase text-gray-500">
                  Catégories d&apos;opérations
                </h2>
                <div className="grid grid-cols-12 gap-4 mb-2">
                  {surgeryCategories.map((surgeryCategory) => {
                    return (
                      <div
                        key={surgeryCategory.slug}
                        className="col-span-2 h-full relative"
                      >
                        {booking.surgeryCategory === surgeryCategory.slug ? (
                          <button
                            onClick={() =>
                              setBooking({
                                surgeryCategory: "",
                                surgery: "",
                                surgeryPrice: 0,
                              })
                            }
                            className="m-2 absolute top-0 right-0 transition opacity-20 hover:opacity-100"
                          >
                            <IoIosCloseCircle size={24} />
                          </button>
                        ) : (
                          ""
                        )}
                        <input
                          id={surgeryCategory.slug}
                          type="radio"
                          name="surgeryCategory"
                          value={surgeryCategory.slug}
                          onChange={handleChange}
                          className="hidden"
                          required={true}
                        />
                        <label
                          htmlFor={surgeryCategory.slug}
                          className={`flex flex-col transition items-center justify-center border w-full h-full rounded hover:shadow p-6 ${
                            booking.surgeryCategory === surgeryCategory.slug
                              ? "border-shamrock"
                              : ""
                          } ${
                            booking.surgeryCategory !== "" &&
                            booking.surgeryCategory !== surgeryCategory.slug
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          <p className="text-center">{surgeryCategory.name}</p>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xs uppercase text-gray-500">Opérations</h2>
                <div className="grid grid-cols-12 gap-4">
                  {surgeries.map((surgery) => {
                    return booking.surgeryCategory !== "" &&
                      surgery.category === booking.surgeryCategory ? (
                      <div className="flex flex-col items-center col-span-3">
                        <input
                          id={surgery.slug}
                          value={surgery.slug}
                          className="hidden"
                          onChange={(e) => {
                            setBooking({
                              ...booking,
                              surgery: surgery.slug,
                              surgeryPrice: surgery.startingPrice,
                            });
                          }}
                          name="surgery"
                          type="radio"
                          required={true}
                        />
                        <label
                          htmlFor={surgery.slug}
                          className={`flex transition text-center items-center justify-center border w-full h-full rounded hover:shadow py-2 px-4 ${
                            booking.surgery === surgery.slug
                              ? "border-shamrock"
                              : ""
                          } ${
                            booking.surgery !== "" &&
                            booking.surgery !== surgery.slug
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          {surgery.name}
                        </label>
                        <p className="text-xs text-gray-600 mt-2">
                          À partir de {surgery.startingPrice} €
                        </p>
                      </div>
                    ) : (
                      ""
                    );
                  })}
                  {booking.surgeryCategory === "" ? (
                    <div className="col-span-12 rounded border border-blue-300 bg-blue-50 text-blue-900">
                      <p className="p-4">
                        👋 Veuillez sélectionner une catégorie ci-dessus.
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <button
                disabled={
                  booking.surgeryCategory !== "" && booking.surgery !== ""
                    ? false
                    : true
                }
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Suivant <BsArrowRight />
              </button>
            </div>
          ) : (
            ""
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <h1 className="text-2xl mb-6">Choisissez vos dates de voyage</h1>
              <p className="p-4 bg-green-50 border-green-400 text-shamrock border rounded w-full max-w-max">
                <span className="text-lg flex items-center gap-2">
                  <AiFillInfoCircle /> Bon à savoir
                </span>
                Vous avez la possibilité de rester plus longtemps sur place afin
                de profiter de la ville que vous choisissez.
              </p>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
                    <h2 className="text-xs uppercase text-gray-500">
                      Date de départ
                    </h2>
                    <Calendar
                      onChange={onCalendarStartDateChange}
                      value={booking.startDate}
                      locale="fr"
                      minDate={new Date()}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
                    <h2 className="text-xs uppercase text-gray-500">
                      Date de retour
                    </h2>
                    <Calendar
                      onChange={onCalendarEndDateChange}
                      value={booking.endDate}
                      locale="fr"
                      minDate={addDays(booking.startDate, 1)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                >
                  <BsArrowLeft /> Précédent
                </button>
                <button
                  disabled={
                    booking.startDate !== "" && booking.endDate !== ""
                      ? false
                      : true
                  }
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Suivant <BsArrowRight />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {step === 2 ? (
            <div className="space-y-6">
              <h1 className="text-2xl mb-6">Combien de voyageurs ?</h1>
              <div className="w-52 flex justify-center flex-col">
                <div className="flex items-center p-4 justify-between border rounded-t border-gray-500">
                  <div className="flex items-center gap-2 ">
                    <FaUserAlt />{" "}
                    {booking.extraTravellers +
                      booking.extraChilds +
                      booking.extraBabies +
                      1}{" "}
                    voyageurs
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {booking.totalExtraTravellersPrice > 0
                        ? `+${booking.totalExtraTravellersPrice}€`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="border rounded-b border-gray-500 p-4 border-t-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <p>Adultes</p>
                    <div className="flex gap-2 items-center">
                      <button
                        className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                        name="extraTravellers"
                        do="substract"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        -
                      </button>
                      <p>{booking.extraTravellers}</p>
                      <button
                        className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                        name="extraTravellers"
                        do="add"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Enfants</p>
                      <p className="text-xs text-gray-400">2 à 12 ans</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                        name="extraChilds"
                        do="substract"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        -
                      </button>
                      <p>{booking.extraChilds}</p>
                      <button
                        className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                        name="extraChilds"
                        do="add"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Bébés</p>
                    <div className="flex gap-2 items-center">
                      <button
                        className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                        name="extraBabies"
                        do="substract"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        -
                      </button>
                      <p>{booking.extraBabies}</p>
                      <button
                        className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                        name="extraBabies"
                        do="add"
                        onClick={(e) => {
                          e.preventDefault();
                          handleIncrement(e);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                >
                  <BsArrowLeft /> Précédent
                </button>
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Suivant <BsArrowRight />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {step === 3 ? (
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
                      <div className="col-span-3 space-y-2">
                        <input
                          type="radio"
                          name="city"
                          value={city.slug}
                          id={city.slug}
                          className="hidden"
                          required={true}
                          onChange={handleChange}
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
                              className="rounded"
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                >
                  <BsArrowLeft /> Précédent
                </button>
                <button
                  disabled={booking.city !== "" ? false : true}
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Suivant <BsArrowRight />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    </BookingUi>
  );
};

export default NewBookingContainer;
