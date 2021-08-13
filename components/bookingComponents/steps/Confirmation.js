import BookingDataSpan from "../BookingDataSpan";
import Moment from "react-moment";

const BookingConfirmation = ({ booking }) => {
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
      <div className="py-6 space-y-6">
        <p className="flex items-center">
          Vous souhaitez réaliser une{" "}
          <BookingDataSpan string={booking.surgeryCategoryName} />
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
          {booking.totalExtraTravellersPrice +
            1900 +
            booking.totalSelectedNights * booking.roomPrice +
            booking.totalSelectedNights * booking.hotelPrice}{" "}
          €
        </span>
      </p>
    </div>
  );
};

export default BookingConfirmation;

/* city: "istanbul"
endDate: Sun Aug 29 2021 00:00:00 GMT+0200 (Central European Summer Time) {}
extraBabies: 0
extraChilds: 0
extraTravellers: 1
hotel: "wyndham-grand-istanbul-kalamis-marina-hotel"
hotelId: "uTEaIEIYD88BKvgkYLOv"
hotelName: "Wyndham Grand Istanbul Kalamış Marina Hôtel"
hotelPhotoLink: "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/hotels%2Fwyndham-grand-istanbul-kalamis-marina-hotel-Wyndham%20Grand%20Istanbul%20Kalam%C4%B1s%CC%A7%20Marina%20Ho%CC%82tel%205_%20_guestroom_king_executive_city_view.webp?alt=media&token=6ecde0e1-78a5-4c37-adcf-3522d40b4929"
hotelPrice: 80
hotelRating: 5
minimumNights: 10
options: (3) [{…}, {…}, {…}]
room: "un-super"
roomName: "Un super hotel trop trop cool"
roomPhotoLink: "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/rooms%2Fpark%20inn%20by%20radisson%20atasehir%20ho%CC%82tel%204%20%201.webp?alt=media&token=96ffa67b-8582-4ee7-a884-2c46536c49c9"
roomPrice: 0
startDate: Fri Aug 13 2021 02:24:35 GMT+0200 (Central European Summer Time) {}
surgery: "oreilles-decollees-otoplastie"
surgeryCategory: "chirurgie-du-visage"
surgeryCategoryName: "Chirurgie du visage"
surgeryMinDays: 0
surgeryName: "Oreilles décollées / Otoplastie"
surgeryPrice: 1900
totalExtraTravellersPrice: 450
totalSelectedNights: 16
 */
