import Head from "next/head";
import firebase from "firebase/clientApp";
import moment from "moment";
import { getBackEndAsset } from "utils/ServerHelpers";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { VscLoading } from "react-icons/vsc";
import BookingSideNavigation from "components/bookingComponents/BookingSideNavigation";
import BookingTopNavigation from "components/bookingComponents/BookingTopNavigation";
import BookingDataSpan from "components/bookingComponents/BookingDataSpan";
import Calendar from "react-calendar";
import { AiFillInfoCircle } from "react-icons/ai";
import DashboardButton from "Components/DashboardButton";
import { useRouter } from "next/router";
import Select from "react-select";
import formatPrice from "utils/formatPrice";

moment.locale("fr");

// get server side props
export async function getServerSideProps(context) {
  const { id } = context.query;
  const db = firebase.firestore();

  const offer = await db.collection("offers").doc(id).get();

  // serialize the data
  const offerData = offer.data();
  offerData.id = offer.id;

  // format the date to a readable format
  if (offerData.createdAt) {
    offerData.createdAt = moment(offerData.createdAt.toDate()).format(
      "MMM Do YYYY"
    );
  }

  // get hotel room data from the hotelRoom id
  if (offerData.hotelRoom) {
    const hotelRoom = await db
      .collection("rooms")
      .doc(offerData.hotelRoom)
      .get();

    offerData.hotelRoom = hotelRoom.data();
    offerData.hotelRoom.id = hotelRoom.id;
  }

  // get hotel data from the hotelRoom.hotel slug
  if (offerData.hotelRoom && offerData.hotelRoom.hotel) {
    const hotel = await db
      .collection("hotels")
      .where("slug", "==", offerData.hotelRoom.hotel)
      .get();

    offerData.hotel = hotel.docs[0].data();
    offerData.hotel.id = hotel.docs[0].id;

    // get hotel image using getBackEndAsset
    offerData.hotel.photoUrl = await getBackEndAsset(offerData.hotel.photo);
  }

  // get surgery data using surgery id
  if (offerData.surgery) {
    const surgery = await db
      .collection("surgeries")
      .doc(offerData.surgery)
      .get();

    offerData.surgery = surgery.data();
    offerData.surgery.id = surgery.id;
  }

  // get surgeryCategory data using surgery.slug
  if (offerData.surgery && offerData.surgery.category) {
    const surgeryCategory = await db
      .collection("operationCategories")
      .where("slug", "==", offerData.surgery.category)
      .get();

    offerData.surgery.category = surgeryCategory.docs[0].data();
    offerData.surgery.category.id = surgeryCategory.docs[0].id;

    // get image using getBackEndAsset
    offerData.surgery.category.imageUrl = await getBackEndAsset(
      offerData.surgery.category.photo
    );
  }

  return {
    props: {
      id,
      offer: offerData,
    },
  };
}

const OfferBooking = ({ offer }) => {
  // date selection popup
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [hideReturnCalendar, setHideReturnCalendar] = useState(true);

  // saving state
  const [isSaving, setIsSaving] = useState(false);

  // router
  const router = useRouter();

  const [user, loading] = useAuthState(firebase.auth());
  if (user === null && loading === false) {
    router.push("/signup?i=anonBooking");
  }

  const [booking, setBooking] = useState({
    surgeryCategory: offer.surgery.category.slug,
    surgeryCategoryName: offer.surgery.category.name,
    surgery: offer.surgery.slug,
    surgeryPrice: offer.surgery.startingPrice,
    surgeryName: offer.surgery.name,
    surgeryMinDays: offer.surgery.minimumNights,
    startDate: new Date(),
    endDate: "",
    totalSelectedNights: 0,
    extraTravellers: 0,
    extraChilds: 0,
    extraBabies: 0,
    totalExtraTravellersPrice: 0,
    city: offer.hotel.city,
    hotel: offer.hotel.slug,
    hotelPrice: offer.hotel.extraPrice,
    hotelPhotoLink: offer.hotel.photoUrl,
    hotelName: offer.hotel.name,
    hotelRating: offer.hotel.rating,
    hotelId: offer.hotel.id,
    room: offer.hotelRoom.slug,
    roomName: offer.hotelRoom.name,
    roomPrice: offer.hotelRoom.extraPrice,
    roomPhotoLink: offer.hotelRoom.photos[0],
  });

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }

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

  // do booking
  const mail = require("@sendgrid/mail");
  mail.setApiKey(process.env.SENDGRID_API_KEY);

  const doBooking = () => {
    setIsSaving(true);

    firebase
      .firestore()
      .collection("bookings")
      .add({
        user: user.uid,
        status: "awaitingDocuments",
        alternativeTotal: offer.price,
        offer: offer.id,
        total:
          Number(
            booking.surgeries.reduce(
              (prev, curr) => prev + curr.surgeryPrice,
              0
            )
          ) +
          Number(booking.totalExtraTravellersPrice) +
          Number(booking.hotelPrice) * Number(booking.totalSelectedNights) +
          Number(booking.roomPrice) * Number(booking.totalSelectedNights),
        ...booking,
      })
      .then((e) => {
        fetch("/api/mail", {
          method: "post",
          body: JSON.stringify({
            recipient: user.email,
            templateId: "d-b504c563b53846fbadb0a53151a82d57",
          }),
        });
      })
      .then((e) => {
        router.push("/dashboard/operations");
      });
  };

  // build the dates from and to options for the select using offer.dates
  const dates = offer.dates.map((date) => {
    return {
      value: date,
      label: `${moment(date.startDate).format("ddd ll")} - ${moment(
        date.endDate
      ).format("ddd ll")}`,
    };
  });

  const surgeryCategoriesName = () => {
    const surgeryNameCategories = [];
    booking.surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length > 1) {
      return surgeryNameCategories.join(", ");
    } else {
      return surgeryNameCategories[0];
    }
  };

  return (
    <div>
      <Head>
        <title>Booklinik | Réservation</title>
      </Head>
      {loading && (
        <div className="animate-spin h-screen w-screen flex items-center justify-center">
          <VscLoading />
        </div>
      )}

      {loading === false && user !== null ? (
        <div className="max-h-screen w-full overflow-hidden">
          {isSaving && (
            <div className="w-full h-full absolute z-30 bg-opacity-20 bg-black flex flex-col gap-4 items-center justify-center">
              <span className="animate-spin">
                <VscLoading size={48} />
              </span>
              Sauvegarde en cours ...
            </div>
          )}
          <BookingTopNavigation
            bookingData={booking}
            priceOverride={offer.price}
          />
          <div className="grid grid-cols-10">
            <div className="col-span-2 hidden md:block">
              <BookingSideNavigation step={7} bookingData={booking} />
            </div>
            <div className="col-span-8 shadow-xl h-full grid grid-cols-12 overflow-y-scroll">
              <div className="col-span-12 space-y-6 h-full p-8">
                <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
                <div className="py-6 space-y-6">
                  <p className="flex items-center">
                    Vous souhaitez réaliser une{" "}
                    <BookingDataSpan string={surgeryCategoriesName()} />
                  </p>
                  <p className="flex items-center gap-2">
                    Votre voyage s&apos;étendra du{" "}
                    <Select
                      options={dates}
                      onChange={(e) => {
                        setBooking({
                          ...booking,
                          startDate: e.value.startDate,
                          endDate: e.value.endDate,
                          totalSelectedNights: moment(e.value.endDate).diff(
                            moment(e.value.startDate),
                            "days"
                          ),
                        });
                      }}
                      className="w-72"
                      placeholder="Choisissez une date"
                    />{" "}
                    pour une durée de {booking.totalSelectedNights} jours.
                  </p>
                  <p>
                    L&apos;hôtel dans lequel vous résiderez est au{" "}
                    <BookingDataSpan string={booking.hotelName} /> (très bon
                    choix) et vous logerez en{" "}
                    <BookingDataSpan string={booking.roomName} />
                  </p>
                </div>
                <p className="py-6">
                  Le prix tout compris de votre voyage sur-mesure est de{" "}
                  <span className="text-2xl rounded text-white px-4 py-2 mx-2 bg-shamrock">
                    {formatPrice(offer.price)} €
                  </span>
                </p>
                {/* if dates are selected, show a button */}
                {
                  <DashboardButton
                    defaultText="Réserver"
                    onClick={doBooking}
                    disabled={
                      !booking.startDate ||
                      !booking.endDate ||
                      booking.startDate > booking.endDate
                    }
                  />
                }
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OfferBooking;
