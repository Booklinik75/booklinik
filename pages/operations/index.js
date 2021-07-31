import PhotoBanner from "../../components/PhotoBanner";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Head from "next/head";
import OperationCategory from "../../components/OperationCategory";
import ContactHelper from "../../components/ContactHelper";

export const getStaticProps = async (context) => {
  const res = await fetch(process.env.JSON_API_URL + "/operations");
  const data = await res.json();

  return {
    props: {
      operations: data,
    },
  };
};

const OperationsList = ({ operations }) => {
  return (
    <div>
      <Head>
        <title>Booklinik | Les opérations</title>
      </Head>
      <Navigation />
      <PhotoBanner extraLarge={true} fullWidth={true} title="Les opérations" />

      {operations.categories.map((category) => (
        <OperationCategory operation={category} key={category.id} />
      ))}

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default OperationsList;
