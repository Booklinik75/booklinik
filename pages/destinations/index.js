import ContactHelper from "../../components/ContactHelper";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import PhotoBanner from "../../components/PhotoBanner";
import Head from "next/head";
import DestinationCountry from "../../components/DestinationCountry";

export const getStaticProps = async (context) => {
  const res = await fetch(process.env.JSON_API_URL + "/destinations");
  const data = await res.json();

  return {
    props: {
      destinations: data,
    },
  };
};

const DestinationsList = ({ destinations }) => {
  return (
    <div>
      <Head>
        <title>Booklinik | Les Destinations</title>
      </Head>
      <Navigation />
      <PhotoBanner
        fullWidth={true}
        extraLarge={true}
        title="Les Destinations"
      />

      <div className="mx-4 xl:mx-auto max-w-7xl">
        {destinations.countries.map((country) => {
          return <DestinationCountry country={country} key={country.id} />;
        })}
      </div>

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default DestinationsList;
