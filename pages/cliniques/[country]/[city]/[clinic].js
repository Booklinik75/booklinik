import Link from "next/link";
import Navigation from "../../../../components/Navigation";
import Footer from "../../../../components/Footer";
import ContactHelper from "../../../../components/ContactHelper";
import Head from "next/head";
import Image from "next/image";
import {
  getBackEndAsset,
  getCities,
  getClinics,
  getCountries,
  getClinicData,
} from "../../../../utils/ServerHelpers";
import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

export const getStaticPaths = async () => {
  const countries = await getCountries();
  const cities = await getCities();
  const clinics = await getClinics();

  const paths = [];

  countries.map((country) => {
    return cities.map((city) => {
      return clinics.map((clinic) => {
        return clinic.city === city.slug
          ? paths.push({
              params: {
                country: country.slug,
                city: city.slug,
                clinic: clinic.slug,
              },
            })
          : "";
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { country, city, clinic } = context.params;
  const clinicData = await getClinicData(clinic);
  const clinicPhoto = await getBackEndAsset(clinicData.props.data.photo);

  return {
    props: {
      clinicData,
      clinicPhoto,
    },
    revalidate: 120,
  };
};

const ClinicPage = ({ clinicData, clinicPhoto }) => {
  return (
    <div className="space-y-6">
      <Head>
        <title>Booklinik | {clinicData.props.data.name}</title>
      </Head>
      <Navigation />
      <div className="mx-4 space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 lg:col-span-1 bg-gray-100 p-14 space-y-4">
            <h1 className="text-5xl">{clinicData.props.data.name}</h1>
            <p>{clinicData.props.data.excerpt}</p>
            <Link href="/book" passHref={true}>
              <button className="text-white bg-shamrock rounded px-6 py-3 transition border border-shamrock hover:text-shamrock hover:bg-white">
                Estimez mon séjour
              </button>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2 w-full relative">
            <Image
              src={clinicPhoto}
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
              alt="TBD"
            />{" "}
          </div>
        </div>
      </div>
      <div className="mx-4 xl:mx-auto max-w-7xl space-y-10">
        <div>
          <Markdown source={clinicData.props.data.descriptionBody} />
        </div>
        {/* <div className="space-y-6">
          <h2 className="text-2xl">Opérations similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSurgeries.map((surgery) => {
              return (
                <RelatedElement
                  title={surgery.name}
                  target={`/operations/${surgery.category}/${surgery.slug}`}
                  key={surgery.slug}
                  picture={categoryPhoto}
                />
              );
            })}
          </div>
        </div> */}
      </div>
      <ContactHelper />
      <Footer />
    </div>
  );
};

export default ClinicPage;
