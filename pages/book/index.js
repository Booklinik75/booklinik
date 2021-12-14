import {
  getCountries,
  getCities,
  getHotels,
  getOperationCategories,
  getSurgeries,
  getOptions,
  getRooms,
  getBackEndAsset,
} from "utils/ServerHelpers";

import Head from "next/head";
import { useEffect, useState } from "react";
import SurgerySelectStep from "components/bookingComponents/steps/SurgerySelect";
import DatesSelectStep from "components/bookingComponents/steps/DatesSelect";
import TravellersSelectStep from "components/bookingComponents/steps/TravellersSelect";
import CitySelectStep from "components/bookingComponents/steps/CitySelect";
import HotelSelectStep from "components/bookingComponents/steps/HotelSelect";

import FormStepper from "components/bookingComponents/steps/BookingStepper";
import RoomsSelectStep from "components/bookingComponents/steps/RoomsSelect";
import OptionsSelectStep from "components/bookingComponents/steps/OptionsSelect";
import BookingConfirmation from "components/bookingComponents/steps/Confirmation";

import { useAuthState } from "react-firebase-hooks/auth";
import { VscLoading } from "react-icons/vsc";
import firebase from "firebase/clientApp";
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

  if (user === null && loading === false) router.push("/signup?i=anonBooking");

  // fetch user profile
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserProfile(doc.data());
          }
        })
        .catch((error) => {});
    }
  }, [user]);

  // redirect to profile page if user doesnt have a phone number
  if (userProfile && !userProfile.mobilePhone)
    router.push("/dashboard/profile?error=mpn");
  else if (userProfile && !userProfile.isMobileVerified)
    router.push("/verify/mobile");

  const [booking, setBooking] = useState({
    surgeries: [
      {
        surgeryCategory: "",
        surgeryCategoryName: "",
        surgery: "",
        surgeryPrice: 0,
        surgeryName: "",
        surgeryMinDays: 0,
        cities: [],
      },
    ],
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
    created: firebase.firestore.FieldValue.serverTimestamp(),
  });

  const extraTravellersSupplement = 450;
  const extraChildsSupplement = 450;
  const extraBabiesSupplement = 450;

  const [nextStep, setNextStep] = useState(false);
  const [surgeryCategory, setSurgeryCategory] = useState({
    surgeryCategory: "",
    surgeryCategoryName: "",
  });

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
    setSurgeryCategory({
      surgeryCategory: category,
      surgeryCategoryName: name,
    });
  };

  const handleSurgerySelect = (surgery, price, name, minimumNights) => {
    setBooking({
      ...booking,
      surgeries: [
        {
          ...surgeryCategory,
          surgery: surgery,
          surgeryPrice: parseInt(price),
          surgeryName: name,
          surgeryMinDays: parseInt(minimumNights),
          cities: cities.map((city) => city.name),
        },
      ],
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
      {loading === false &&
      user !== null &&
      userProfile &&
      userProfile?.isMobileVerified ? (
        <FormStepper
          booking={booking}
          user={user}
          nextStep={nextStep}
          setNextStep={setNextStep}
        >
          <SurgerySelectStep
            surgeryCategories={surgeryCategories}
            booking={booking}
            handleChange={handleChange}
            surgeries={surgeries}
            setBooking={setBooking}
            handleSurgerySelect={handleSurgerySelect}
            handleSurgeryCategorySelect={handleSurgeryCategorySelect}
            setNextStep={setNextStep}
            surgeryCategory={surgeryCategory}
          />

          <DatesSelectStep
            onCalendarStartDateChange={onCalendarStartDateChange}
            onCalendarEndDateChange={onCalendarEndDateChange}
            booking={booking}
            addDays={addDays}
            setNextStep={setNextStep}
          />

          <TravellersSelectStep
            booking={booking}
            setBooking={setBooking}
            setNextStep={setNextStep}
          />

          <CitySelectStep
            booking={booking}
            countries={countries}
            cities={cities}
            hotels={hotels}
            handleChange={handleChange}
            setNextStep={setNextStep}
          />

          <HotelSelectStep
            booking={booking}
            hotels={hotels}
            handleHotelSelect={handleHotelSelect}
            setNextStep={setNextStep}
          />

          <RoomsSelectStep
            booking={booking}
            rooms={rooms}
            handleRoomSelect={handleRoomSelect}
            setNextStep={setNextStep}
          />

          <OptionsSelectStep
            booking={booking}
            options={options}
            handleOptionsSelect={handleOptionsSelect}
            setNextStep={setNextStep}
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
