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
    booking.options
      ?.map((option) => option.isChecked && Number(option.price))
      .reduce((a, b) => a + b) +
    Number(booking.roomPrice) * Number(booking.totalSelectedNights);

  return (
    <div className="space-y-2 h-full">
      <h1 className="text-2xl md:mb-6">Parfait, on y est pdresque !</h1>
      <div className="py-2 space-y-3 leading-8 xl:leading-10">
        <p className="flex flex-wrap items-start lg:gap-2 lg:flex-row lg:items-center">
          Vous souhaitez réaliser une opération{" "}
          <span className="">
            <BookingDataSpan string={booking.surgeries[0].surgeryName} />{" "}
          </span>
        </p>
        <p className="items-start gap-2 lg:flex-row lg:items-center">
          Votre voyage s&apos;étendra du{" "}
        </p>{" "}
        <span>
          <BookingDataSpan>
            <Moment format="DD MMM YYYY" date={booking.startDate} locale="fr" />
          </BookingDataSpan>
          au{" "}
          <BookingDataSpan>
            <Moment format="DD MMM YYYY" date={booking.endDate} locale="fr" />
          </BookingDataSpan>
        </span>
        <p>pour une durée de {booking.totalSelectedNights} jours.</p>
        {booking.extraBabies > 0 ||
        booking.extraChilds > 0 ||
        booking.extraTravellers > 0 ? (
          <p className=" items-start gap-2 lg:flex-row lg:items-center">
            Vous serez accompagné-e par
            <p> </p>
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
            <p>de votre choix pour découvrir</p>
            <p> </p>
            <BookingDataSpan string={booking.city} />
          </p>
        ) : (
          ""
        )}{" "}
        <p className="items-start gap-2 lg:flex-row lg:items-center">
          L&apos;hôtel dans lequel vous résiderez est au
        </p>{" "}
        <span>
          <BookingDataSpan string={booking.hotelName} />
          <p className="items-start gap-2 lg:flex-row lg:items-center">
            (très bon choix) et vous logerez en{" "}
          </p>
          <p className="items-start gap-2 lg:flex-row lg:items-center"> </p>
          <BookingDataSpan string={booking.roomName} />
        </span>
        <p className="items-start gap-2 lg:flex-row lg:items-center">
          Vous avez selectionné les options suivantes :{" "}
          {booking.options.map((option) => {
            return option.isChecked === true ? (
              <BookingDataSpan string={option.name} />
            ) : (
              ""
            );
          })}
        </p>
        {userProfile && userProfile.referalBalance > 0 && (
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
        )}
        <p className="pb-6 !mt-0  items-start gap-2 lg:flex-row lg:items-center">
          Le prix tout compris de votre voyage sur-mesure est de{"    "}
          <span className="text-2xl rounded text-white mt-10 px-4 py-2 mx-2 lg:p-2 bg-shamrock">
            {formatPrice(
              isChecked ? totalPrice - userProfile.referalBalance : totalPrice
            )}{" "}
            €
          </span>
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
