import ContactHelper from "../../components/ContactHelper";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import PhotoBanner from "../../components/PhotoBanner";
import Head from "next/head";
import DestinationCountry from "../../components/DestinationCountry";
import {
  getCities,
  getCountries,
  getHotels,
  getBackEndAsset,
} from "../../utils/ServerHelpers";

export const getStaticProps = async (context) => {
  const countries = await getCountries();
  const cities = await getCities();
  const hotels = await getHotels();

  const operationsImageT = await Promise.all(
    hotels.map(async (hotel, index, array) => {
      let image = await getBackEndAsset(hotel.photo);
      hotels[index].photo = image;
    })
  );

  return {
    props: {
      countries,
      cities,
      hotels,
    },
  };
};

const DestinationsList = ({ countries, cities, hotels }) => {
  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Falexander-kaunas-xEaAoizNFV8-unsplash%20copie.jpg?alt=media&token=758bcbd4-9599-48ef-9859-8ecea183d066";
  return (
    <div>
      <Head>
        <title>Booklinik | Les Destinations</title>
      </Head>
      <Navigation />
      <PhotoBanner
        fileName={fileName}
        fullWidth={true}
        extraLarge={true}
        title="Les Destinations"
      />

      <div className="mx-4 xl:mx-auto max-w-7xl">
        {countries.map((country) => {
          return (
            <DestinationCountry
              country={country}
              cities={cities}
              key={country.id}
              hotels={hotels}
            />
          );
        })}
      </div>

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default DestinationsList;
