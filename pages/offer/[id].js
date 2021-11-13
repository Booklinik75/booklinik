import Head from "next/head";
import Navigation from "components/Navigation";
import Image from "next/image";
import firebase from "firebase/clientApp";
import moment from "moment";

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

  return {
    props: {
      id,
      offer: offerData,
    },
  };
}

const Offer = ({ offer: { imageUrl, endDate } }) => {
  return (
    <>
      <Head>
        <title>Booklinik | Les opérations</title>
      </Head>
      <Navigation />

      <div className="p-8">
        <div className="flex flex-row-reverse lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 bg-gray-100 rounded p-4">
            <div className="flex gap-2 items-center">
              <p className="px-2 py-1 rounded-sm uppercase text-white bg-bali max-w-min font-bold">
                Offre
              </p>
              <p className="text-bali uppercase max-w-max font-bold">
                Reste {moment().to(moment(endDate), true)}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-3/4 relative">
            <Image src={imageUrl} alt="" layout="fill" objectFit="cover" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Offer;
