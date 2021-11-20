import Navigation from "components/Navigation";
import firebase from "firebase/clientApp";
import Offer from "../components/HomeCurrentOffer";
import moment from "moment";

export const getServerSideProps = async (ctx) => {
  // get all offers from firestore
  const offers = await firebase.firestore().collection("offers").get();

  // build an array of offers with data and id
  const offersArray = [];
  offers.forEach((offer) => {
    const offerData = offer.data();
    const offerId = offer.id;
    offersArray.push({ ...offerData, id: offerId });
  });

  // in offers, convert createdAt from firestore timestamp using moment if needed
  await Promise.all(
    offersArray.map(async (offer, i) => {
      await firebase
        .firestore()
        .collection("rooms")
        .doc(offer.hotelRoom)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            offersArray[i].hotelRoomData = doc.data();
          }
        });

      await firebase
        .firestore()
        .collection("hotels")
        .where("slug", "==", offer.hotelRoomData.hotel)
        .get()
        .then(async (hotels) => {
          if (hotels.size > 0) {
            hotels.forEach((hotel) => {
              offersArray[i].hotelData = hotel.data();
            });
          }
        });

      if (offer.createdAt) {
        offer.createdAt = moment(offer.createdAt.toDate()).format(
          "MMM Do YYYY"
        );
      }
    })
  );

  return {
    props: { offersArray }, // will be passed to the page component as props
  };
};

const OffersList = ({ offersArray }) => {
  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-8 md:mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Offres
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Vous trouverez ici toutes les offres disponibles.
            </p>
          </div>
          <div className="bg-white px-4 py-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 row-gap-6 col-gap-4">
              {offersArray.map((offer) => {
                // if today is after startDate and after endDate
                if (
                  new Date(offer.startDate) <= new Date() &&
                  new Date(offer.endDate) >= new Date()
                ) {
                  return (
                    <div className="col-span-1">
                      <Offer data={offer} key={offer.id} />
                    </div>
                  );
                }
              })}
            </div>
            {/* if no offers are available, or if they're all ended, show a no results message */}
            {offersArray.length === 0 ||
            offersArray.every(
              (offer) => new Date(offer.endDate) < new Date()
            ) ? (
              <p className="text-center text-gray-500">
                Aucune offre disponible pour le moment.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};

export default OffersList;
