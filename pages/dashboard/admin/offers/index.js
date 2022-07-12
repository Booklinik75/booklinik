import DashboardUi from "../../../../components/DashboardUi";
import { checkAdmin } from "../../../../utils/ServerHelpers";
import Link from "next/link";
import firebase from "firebase/clientApp";
import moment from "moment";
import Image from "next/image";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  // get all offers from firestore
  async function getOffers() {
    const snapshot = await firebase.firestore().collection("offers").get();
    // return array of offers with id and data
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  const offers = await getOffers();

  // in offers, convert createdAt from firestore timestamp using moment if needed
  offers.forEach((offer) => {
    if (offer.createdAt) {
      offer.createdAt = moment(offer.createdAt.toDate()).format("MMM Do YYYY");
    }
  });

  return {
    props: { offers, auth },
  };
};

const OffersList = ({ offers, auth }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Liste d&apos;offres</h1>
          <Link href="offers/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        <div className="bg-white px-4 py-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 row-gap-6 col-gap-4">
          {offers.map((offer) => (
            <div
              className="flex h-full mb-6 flex-col space-y-2 p-4 bg-grey-50 rounded border border-grey-300 max-w-max"
              key={offer.id}
            >
              {/* Preview image */}
              <div className="flex items-center relative w-full h-64">
                <Image
                  src={offer.imageUrl}
                  objectFit="cover"
                  layout="fill"
                  className="h-full w-full"
                />
              </div>
              <div className="flex justify-between items-center flex-col">
                <h2 className="text-2xl">{offer.name}</h2>
                {/* truncated description */}
                <p className="text-lg">
                  {offer.description.length > 32
                    ? offer.description.substring(0, 32) + "..."
                    : offer.description}
                </p>
                <p className="text-lg">{offer.price}€</p>
                <p>Créé le : {offer.createdAt}</p>
              </div>
              <div className="flex justify-between items-center flex-col py-6 space-y-4">
                <Link
                  href={`/dashboard/admin/offers/${offer.id}`}
                  passHref={true}
                >
                  <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
                    Modifier
                  </button>
                </Link>
                <button
                  className="px-6 py-3 bg-red-500 text-white transition border rounded border-red-500 hover:bg-white hover:text-red-500"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Voulez-vous vraiment supprimer cette offre ?"
                      )
                    ) {
                      firebase
                        .firestore()
                        .collection("offers")
                        .doc(offer.id)
                        .delete();
                    }
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardUi>
  );
};

export default OffersList;
