import {
  getCountries,
  getCities,
  getHotels,
  getOperationCategories,
  getSurgeries,
  getOptions,
  getRooms,
} from "../../utils/ServerHelpers";
import { useState } from "react";
import Head from "next/head";
import { useEffect } from "react";
import { getBackEndAsset } from "../../utils/ServerHelpers";
import SurgerySelectStep from "../../components/bookingComponents/steps/SurgerySelect";
import DatesSelectStep from "../../components/bookingComponents/steps/DatesSelect";
import TravellersSelectStep from "../../components/bookingComponents/steps/TravellersSelect";
import CitySelectStep from "../../components/bookingComponents/steps/CitySelect";
import HotelSelectStep from "../../components/bookingComponents/steps/HotelSelect";

import FormStepper from "../../components/bookingComponents/steps/BookingStepper";
import RoomsSelectStep from "../../components/bookingComponents/steps/RoomsSelect";

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
    hotel: "",
    hotelPrice: 0,
    hotelPhotoLink: "",
    hotelName: "",
    hotelRating: "",
    room: "",
    roomPrice: 0,
  });

  const extraTravellersSupplement = 450;
  const extraChildsSupplement = 450;
  const extraBabiesSupplement = 450;

  useEffect(() => {
    let totalExtraTravellers =
      extraTravellersSupplement * booking.extraTravellers +
      extraChildsSupplement * booking.extraChilds +
      extraBabiesSupplement * booking.extraBabies;

    console.log(
      extraTravellersSupplement,
      booking.extraTravellers,
      extraChildsSupplement,
      booking.extraChilds,
      extraBabiesSupplement,
      booking.extraBabies
    );

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

  const handleSurgerySelect = (surgery, price) => {
    setBooking({
      ...booking,
      surgery: surgery,
      surgeryPrice: price,
    });
  };

  const handleHotelSelect = (hotel, price, photo, name, rating) => {
    setBooking({
      ...booking,
      hotel: hotel,
      hotelPrice: price,
      hotelPhotoLink: photo,
      hotelName: name,
      hotelRating: rating,
    });
  };

  const handleRoomSelect = (room, price) => {
    setBooking({
      ...booking,
      room: room,
      roomPrice: price,
    });
  };

  return (
    <>
      <Head>
        <title>Booklinik | Réservation</title>
      </Head>
      <FormStepper booking={booking}>
        <SurgerySelectStep
          surgeryCategories={surgeryCategories}
          booking={booking}
          handleChange={handleChange}
          surgeries={surgeries}
          setBooking={setBooking}
          handleSurgerySelect={handleSurgerySelect}
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
      </FormStepper>
    </>
  );
};

export default NewBookingContainer;
