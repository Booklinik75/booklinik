import PhotoBanner from "../../components/PhotoBanner";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Head from "next/head";
import OperationCategory from "../../components/OperationCategory";
import Link from "next/link";
import ContactHelper from "../../components/ContactHelper";
import {
  getOperationCategories,
  getSurgeries,
  getBackEndAsset,
} from "../../utils/ServerHelpers";

export const getStaticProps = async (context) => {
  const operationCategories = await getOperationCategories();
  const surgeries = await getSurgeries();

  const operationsImageT = await Promise.all(
    operationCategories.map(async (operationCategory, index, array) => {
      let image = await getBackEndAsset(operationCategory.photo);
      operationCategories[index].photo = image;
    })
  );

  return {
    props: {
      surgeries,
      operationCategories,
    },
  };
};

const OperationsList = ({ surgeries, operationCategories }) => {
  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Ff3f4e34aca2cab87619cb04c6610b4c7%20copie.jpg?alt=media&token=c402bd27-0ea9-411a-9960-78ce51c29558";
  return (
    <div>
      <Head>
        <title>Booklinik | Les opérations</title>
      </Head>
      <Navigation />
      <PhotoBanner
        extraLarge={true}
        fileName={fileName}
        fullWidth={true}
        overlay={true}
        title="Les opérations"
      />

      <div className="hidden lg:flex w-full bg-shamrock gap-2 justify-center p-5 text-white">
        {operationCategories
          .slice(0, operationCategories.length - 2)
          .map((category) => (
            <>
              <Link key={category.slug} href={`#${category.slug}`}>
                <a className="text-white text-xl text-center hover:underline">
                  {category.name}
                </a>
              </Link>
              —
            </>
          ))}
        <Link
          key={operationCategories[operationCategories.length - 1].slug}
          href={`#${operationCategories[operationCategories.length - 1].slug}`}
        >
          <a className="text-white text-xl text-center hover:underline">
            {operationCategories[operationCategories.length - 1].name}
          </a>
        </Link>
      </div>

      {operationCategories.map((category) => (
        <OperationCategory
          operation={category}
          surgeries={surgeries}
          key={category.slug}
        />
      ))}

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default OperationsList;
