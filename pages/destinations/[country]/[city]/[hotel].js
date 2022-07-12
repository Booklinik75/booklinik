import Head from "next/head";
import { useRouter } from "next/router";
import ContactHelper from "../../../../components/ContactHelper";
import Footer from "../../../../components/Footer";
import Navigation from "../../../../components/Navigation";

const SingleHotel = () => {
  const router = useRouter();
  const { country, city, hotel } = router.query;

  return (
    <div>
      <Head>
        <title>Booklinik | ...</title>
      </Head>
      <Navigation />

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default SingleHotel;
