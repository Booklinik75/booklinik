import {
  getCountries,
  getCities,
  getHotels,
  getOperationCategories,
  getSurgeries,
  getOptions,
  getRooms,
  getBackEndAsset,
} from "../../utils/ServerHelpers";

import Head from "next/head";
import { useEffect, useState } from "react";
import SurgerySelectStep from "../../components/bookingComponents/steps/SurgerySelect";
import DatesSelectStep from "../../components/bookingComponents/steps/DatesSelect";
import TravellersSelectStep from "../../components/bookingComponents/steps/TravellersSelect";
import CitySelectStep from "../../components/bookingComponents/steps/CitySelect";
import HotelSelectStep from "../../components/bookingComponents/steps/HotelSelect";

import FormStepper from "../../components/bookingComponents/steps/BookingStepper";
import RoomsSelectStep from "../../components/bookingComponents/steps/RoomsSelect";
import OptionsSelectStep from "../../components/bookingComponents/steps/OptionsSelect";
import BookingConfirmation from "../../components/bookingComponents/steps/Confirmation";

import { useAuthState } from "react-firebase-hooks/auth";
import { VscLoading } from "react-icons/vsc";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";

export const getStaticProps = async () => {
  const countries = await getCountries();
  const cities = await getCities();
  const hotels = await getHotels();
  const surgeryCategories = await getOperationCategories();
  const surgeries = await getSurgeries();
  const options = await getOptions();
  const rooms = await getRooms();

  await Promise.all(
    hotels.map(async (hotel, index) => {
      let image = await getBackEndAsset(hotel.photo);
      hotels[index].photo = image;
    })
  );

  await Promise.all(
    cities.map(async (city, index) => {
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
      rooms,
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
  rooms,
}) => {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  if (user === null && loading === false) {
    router.push("/signup?i=anonBooking");
  }

  const [booking, setBooking] = useState({
    surgeryCategory: "",
    surgeryCategoryName: "",
    surgery: "",
    surgeryPrice: 0,
    surgeryName: "",
    surgeryMinDays: 0,
    startDate: new Date(),
    endDate: "",
    totalSelectedNights: 0,
    extraTravellers: 0,
    extraChilds: 0,
    extraBabies: 0,
    totalExtraTravellersPrice: 0,
    city: "",
    hotel: "",
    hotelPrice: 0,
    hotelPhotoLink: "",
    hotelName: "",
    hotelRating: "",
    hotelId: "",
    room: "",
    roomName: "",
    roomPrice: 0,
    roomPhotoLink: "",
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

  const onCalendarEndDateChange = (e, total) => {
    setBooking({
      ...booking,
      endDate: e,
      totalSelectedNights: total,
    });
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const handleSurgeryCategorySelect = (category, name) => {
    setBooking({
      ...booking,
      surgeryCategory: category,
      surgeryCategoryName: name,
    });
  };

  const handleSurgerySelect = (surgery, price, name, minimumNights) => {
    setBooking({
      ...booking,
      surgery: surgery,
      surgeryPrice: parseInt(price),
      surgeryName: name,
      minimumNights: parseInt(minimumNights),
    });
  };

  const handleHotelSelect = (hotel, price, photo, name, rating, id) => {
    setBooking({
      ...booking,
      hotel: hotel,
      hotelPrice: parseInt(price),
      hotelPhotoLink: photo,
      hotelName: name,
      hotelRating: parseInt(rating),
      hotelId: id,
    });
  };

  const handleRoomSelect = (room, price, photo, name) => {
    setBooking({
      ...booking,
      room: room,
      roomPrice: parseInt(price),
      roomPhotoLink: photo,
      roomName: name,
    });
  };

  const handleOptionsSelect = (a) => {
    setBooking({
      ...booking,
      options: a,
    });
  };

  return (
    <>
      <Head>
        <title>Booklinik | Réservation</title>
      </Head>
      {loading && (
        <div className="animate-spin h-screen w-screen flex items-center justify-center">
          <VscLoading />
        </div>
      )}
      {loading === false && user !== null ? (
        <FormStepper booking={booking} user={user}>
          <SurgerySelectStep
            surgeryCategories={surgeryCategories}
            booking={booking}
            handleChange={handleChange}
            surgeries={surgeries}
            setBooking={setBooking}
            handleSurgerySelect={handleSurgerySelect}
            handleSurgeryCategorySelect={handleSurgeryCategorySelect}
          />

          <DatesSelectStep
            onCalendarStartDateChange={onCalendarStartDateChange}
            onCalendarEndDateChange={onCalendarEndDateChange}
            booking={booking}
            addDays={addDays}
          />

          <TravellersSelectStep booking={booking} setBooking={setBooking} />

          <CitySelectStep
            booking={booking}
            countries={countries}
            cities={cities}
            hotels={hotels}
            handleChange={handleChange}
          />

          <HotelSelectStep
            booking={booking}
            hotels={hotels}
            handleHotelSelect={handleHotelSelect}
          />

          <RoomsSelectStep
            booking={booking}
            rooms={rooms}
            handleRoomSelect={handleRoomSelect}
          />
          <OptionsSelectStep
            booking={booking}
            options={options}
            handleOptionsSelect={handleOptionsSelect}
          />

          <BookingConfirmation booking={booking} />
        </FormStepper>
      ) : (
        ""
      )}
    </>
  );
};

export default NewBookingContainer;
