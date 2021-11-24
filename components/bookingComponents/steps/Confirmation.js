import BookingDataSpan from "../BookingDataSpan";
import Moment from "react-moment";

const BookingConfirmation = ({ booking }) => {
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
      <div className="py-6 space-y-6">
        <p className="flex items-center">
          Vous souhaitez réaliser une{" "}
          <BookingDataSpan string={booking.surgeryCategoryName} /> sur{" "}
          <BookingDataSpan string={booking.surgeryName} />.
        </p>
        <p className="flex items-center">
          Votre voyage s&apos;étendra du{" "}
          <BookingDataSpan>
            <Moment format="DD MMM YYYY" date={booking.startDate} locale="fr" />
          </BookingDataSpan>
          au{" "}
          <BookingDataSpan>
            <Moment format="DD MMM YYYY" date={booking.endDate} locale="fr" />
          </BookingDataSpan>
          pour une durée de {booking.totalSelectedNights} jours.
        </p>
        {booking.extraBabies > 0 ||
        booking.extraChilds > 0 ||
        booking.extraTravellers > 0 ? (
          <p className="flex items-center">
            Vous serez accompagné-e par{" "}
            {booking.extraTravellers > 0 ? (
              <BookingDataSpan
                string={`${booking.extraTravellers} voyageur${
                  booking.extraTravellers > 1 ? "s" : ""
                }`}
              />
            ) : (
              ""
            )}
            {booking.extraChilds > 0 ? (
              <BookingDataSpan
                string={`${booking.extraChilds} enfant${
                  booking.extraChilds > 1 ? "s" : ""
                }`}
              />
            ) : (
              ""
            )}
            {booking.extraBabies > 0 ? (
              <BookingDataSpan
                string={`${booking.extraBabies} bébé${
                  booking.extraBabies > 1 ? "s" : ""
                }`}
              />
            ) : (
              ""
            )}
            de votre choix pour découvrir{" "}
            <BookingDataSpan string={booking.city} />
          </p>
        ) : (
          ""
        )}{" "}
        <p>
          L&apos;hôtel dans lequel vous résiderez est au{" "}
          <BookingDataSpan string={booking.hotelName} /> (très bon choix) et
          vous logerez en <BookingDataSpan string={booking.roomName} />
        </p>
        <p>
          Vous avez selectionné les options suivantes :{" "}
          {booking.options.map((option) => {
            return option.isChecked === true ? (
              <BookingDataSpan string={option.name} />
            ) : (
              ""
            );
          })}
        </p>
      </div>
      <p className="py-6">
        Le prix tout compris de votre voyage sur-mesure est de{" "}
        <span className="text-2xl rounded text-white px-4 py-2 mx-2 bg-shamrock">
          {Number(booking.surgeryPrice) +
            Number(booking.totalExtraTravellersPrice) +
            Number(booking.hotelPrice) * Number(booking.totalSelectedNights) +
            Number(booking.roomPrice) * Number(booking.totalSelectedNights) +
            booking.options
              ?.map((option) => option.isChecked && Number(option.price))
              .reduce((a, b) => a + b)}
          €
        </span>
      </p>
    </div>
  );
};

export default BookingConfirmation;
