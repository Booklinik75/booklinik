import Head from "next/head";
import Navigation from "components/Navigation";
import Image from "next/image";
import firebase from "firebase/clientApp";
import moment from "moment";
import StarRating from "components/StarRating";
import Link from "next/link";
import { getBackEndAsset } from "utils/ServerHelpers";
import Footer from "components/Footer";
import ContactHelper from "components/ContactHelper";
import Slider from "react-slick";
import MDEditor from "@uiw/react-md-editor";


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

const Offer = ({
  offer: {
    imageUrl,
    offerExpiration,
    name,
    description,
    price,
    id,
    hotel: { rating, name: hotelName, photoUrl: hotelPhotoUrl },
    hotelRoom: { photos: hotelRoomPhotos, name: hotelRoomName },
    surgery: {
      name: surgeryName,
      excerpt,
      category: {
        name: surgeryCategoryName,
        imageUrl: surgeryCategoryImageUrl,
      },
      descriptionBody: surgeryDescription,
    },
  },
}) => {
  return (
    <>
      <Head>
        <title>Booklinik | Les opérations</title>
      </Head>
      <Navigation />

      <div className="p-8 space-y-12 flex flex-col items-center">
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full items-stretch">
          <div className="w-full flex flex-col justify-center lg:w-1/4 bg-gray-100 rounded py-6 px-8 space-y-3">
            <div className="flex gap-2 items-center">
              <p className="px-2 py-1 rounded-sm uppercase text-white bg-bali max-w-min font-bold">
                Offre
              </p>
              <p className="text-bali uppercase max-w-max font-bold">
                Reste {moment().to(moment(offerExpiration), true)}
              </p>
            </div>
            <h1 className="text-5xl">{name}</h1>
            <div className="flex gap-2 items-baseline">
              <p className="text-bali font-semibold text-sm">{hotelName}</p>
              <StarRating value={rating} color="bali" />
            </div>
            <p className="text-lg">{description}</p>
            <p className="text-shamrock text-3xl">{price}€</p>
            <Link href={`/book/offer/${id}`} passHref>
              <button
                className="bg-shamrock text-white font-bold py-3 px-7 rounded border border-shamrock
            hover:bg-transparent hover:text-shamrock transition-colors max-w-max"
              >
                Réserver
              </button>
            </Link>
          </div>
          <div className="w-full min-h-[24rem] lg:w-3/4 relative rounded overflow-hidden group">
            <Image
              src={imageUrl}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="w-full h-full transform transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
        </div>
        <div className="w-full flex items-center flex-col gap-2">
          <h2 className="text-4xl text-center">L&apos;opération</h2>
        {/*   <p className="text-lg text-center prose prose-lg">
        //     only show the two first sentences of the excerpt
            {excerpt.split(".").slice(0, 2).join(".")}.
          </p>
        */}
          {/* <MDEditor.Markdown className="text-lg text-center prose prose-lg" source={excerpt.split(".").slice(0, 2).join(".")} />*/}
          <pre className="text-lg text-center prose prose-lg">{excerpt.split(".").slice(0, 2).join(".")} </pre>

        </div>
        <div className="w-full flex flex-col lg:flex-row gap-4 max-w-7xl justify-center items-center">
          <div className="w-full h-72 lg:w-2/5 relative group">
            <Image
              src={surgeryCategoryImageUrl}
              alt={surgeryCategoryName}
              layout="fill"
              objectFit="cover"
              className="w-full transform transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="w-full lg:w-3/5 flex flex-col items-center py-8">
            <h2 className="text-4xl text-center">{surgeryName}</h2>
            <p className="text-lg text-center prose prose-lg">
              {surgeryDescription}
            </p>
          </div>
        </div>
        <div className="bg-gray-200 flex items-center flex-col w-full p-8 rounded gap-8">
          <div className="flex flex-col gap-3 items-center">
            <h2 className="text-4xl">{hotelName}</h2>
            <StarRating value={rating} color="bali" />
          </div>
          <div className="max-w-full">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToScroll={1}
              centerMode={true}
            >
              {[hotelPhotoUrl, ...hotelRoomPhotos].map((photo, index) => (
                <div key={index} className="relative h-[50vh] mr-4">
                  <Image
                    src={photo}
                    alt={hotelName}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <p className="uppercase text-gray-400 text-center ">{`${hotelName} - ${hotelRoomName}`}</p>
        </div>
        <div className="w-4/5"></div>
      </div>

      {/* contact form */}
      <ContactHelper />

      {/* footer */}
      <Footer />
    </>
  );
};

export default Offer;
