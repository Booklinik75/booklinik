import BookingDataSpan from "../BookingDataSpan";
import Moment from "react-moment";
import formatPrice from "utils/formatPrice";
import { useContext } from "react";
import { BookContext } from "utils/bookContext";

const BookingConfirmation = ({ booking, userProfile }) => {
  const { isChecked, handleUseReferral } = useContext(BookContext);

  const totalPrice =
    Number(booking.surgeries[0].surgeryPrice) +
    Number(booking.totalExtraTravellersPrice) +
    Number(booking.hotelPrice) * Number(booking.totalSelectedNights) +
    booking.options
      ?.map((option) => option.isChecked && Number(option.price))
      .reduce((a, b) => a + b) +
    Number(booking.roomPrice) * Number(booking.totalSelectedNights);

  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
      <div className="py-6 space-y-6">
        <p className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
          Vous souhaitez réaliser une{" "}
          <span>
            <BookingDataSpan
              string={booking.surgeries[0].surgeryCategoryName}
            />{" "}
            sur{" "}
          </span>
          <BookingDataSpan string={booking.surgeries[0].surgeryName} />
        </p>
        <p className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
          Votre voyage s&apos;étendra du{" "}
          <span>
            <BookingDataSpan>
              <Moment
                format="DD MMM YYYY"
                date={booking.startDate}
                locale="fr"
              />
            </BookingDataSpan>
            au{" "}
            <BookingDataSpan>
              <Moment format="DD MMM YYYY" date={booking.endDate} locale="fr" />
            </BookingDataSpan>
          </span>
          pour une durée de {booking.totalSelectedNights} jours.
        </p>
        {booking.extraBabies > 0 ||
        booking.extraChilds > 0 ||
        booking.extraTravellers > 0 ? (
          <p className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
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
        <p className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
          L&apos;hôtel dans lequel vous résiderez est au{" "}
          <BookingDataSpan string={booking.hotelName} /> (très bon choix) et
          vous logerez en <BookingDataSpan string={booking.roomName} />
        </p>
        <p className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
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
      <div className="pt-6 flex flex-row items-center gap-2">
        <input
          type="checkbox"
          name="referralBalance"
          id="referralBalance"
          onChange={handleUseReferral}
          checked={isChecked}
          className="rounded-full"
        />
        <label htmlFor="acceptsMarketing" className="">
          Utiliser solde parrainage : {userProfile.referalBalance} €
        </label>
      </div>
      <p className="pb-6 !mt-0 flex flex-col items-start gap-2 lg:flex-row lg:items-center">
        Le prix tout compris de votre voyage sur-mesure est de{" "}
        <span className="text-2xl rounded text-white px-4 py-2 mx-2 bg-shamrock">
          {formatPrice(
            isChecked ? totalPrice - userProfile.referalBalance : totalPrice
          )}{" "}
          €
        </span>
      </p>
    </div>
  );
};

export default BookingConfirmation;
