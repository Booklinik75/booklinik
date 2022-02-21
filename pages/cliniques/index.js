import ContactHelper from "../../components/ContactHelper";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import PhotoBanner from "../../components/PhotoBanner";
import Head from "next/head";
import ClinicCountry from "../../components/ClinicCountry";
import {
  getCities,
  getCountries,
  getClinics,
  getBackEndAsset,
} from "../../utils/ServerHelpers";

export const getStaticProps = async (context) => {
  const countries = await getCountries();
  const cities = await getCities();
  const clinics = await getClinics();

  await Promise.all(
    clinics.map(async (clinic, index, array) => {
      let image = await getBackEndAsset(clinic.photo);
      clinics[index].photo = image;
    })
  );

  return {
    props: {
      countries,
      cities,
      clinics,
    },
  };
};

const ClinicsList = ({ countries, cities, clinics }) => {
  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fsean-pollock-PhYq704ffdA-unsplash%20copie.jpg?alt=media&token=23a89001-8401-4f87-b16d-30f877cd3391";
  return (
    <div>
      <Head>
        <title>Booklinik | Les Cliniques</title>
      </Head>
      <Navigation />
      <PhotoBanner
        fileName={fileName}
        fullWidth={true}
        extraLarge={true}
        title="Cliniques"
      />

      <div className="mx-4 xl:mx-auto max-w-7xl">
        {countries.map((country) => {
          return (
            <ClinicCountry
              country={country}
              cities={cities}
              key={country.id}
              clinics={clinics}
            />
          );
        })}
      </div>

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default ClinicsList;
