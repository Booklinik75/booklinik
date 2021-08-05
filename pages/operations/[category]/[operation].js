import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import ContactHelper from "../../../components/ContactHelper";
import Head from "next/head";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import RelatedElement from "../../../components/RelatedSuggestionElement";
import {
  getBackEndAsset,
  getOperationCategories,
  getOperationData,
  getRelatedSurgeries,
  getSurgeries,
  getSurgeryData,
} from "../../../utils/ServerHelpers";

export const getStaticPaths = async () => {
  const res = await fetch(process.env.JSON_API_URL + "/operations");
  const data = await res.json();

  const surgeryCategories = await getOperationCategories();
  const surgeries = await getSurgeries();

  const paths = [];

  surgeryCategories.map((category) => {
    return surgeries.map((surgery) => {
      return category.slug === surgery.category
        ? paths.push({
            params: { category: category.slug, operation: surgery.slug },
          })
        : "";
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { operation, category } = context.params;
  const surgeryData = await getSurgeryData(operation);
  const categoryData = await getOperationData(category);
  const categoryPhoto = await getBackEndAsset(categoryData.props.data.photo);
  const relatedSurgeries = await getRelatedSurgeries(
    surgeryData.props.data.category
  );

  return {
    props: {
      surgeryData,
      categoryPhoto,
      relatedSurgeries,
    },
    revalidate: 120,
  };
};

const OperationPage = ({ surgeryData, categoryPhoto, relatedSurgeries }) => {
  return (
    <div className="space-y-6">
      <Head>
        <title>Booklinik | {surgeryData.props.data.name}</title>
      </Head>
      <Navigation />
      <div className="mx-4 space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 lg:col-span-1 bg-gray-100 p-14 space-y-4">
            <h1 className="text-5xl">{surgeryData.props.data.name}</h1>
            <p className="text-shamrock">
              À partir de {surgeryData.props.data.startingPrice}€
            </p>
            <p>{surgeryData.props.data.excerpt}</p>
            <p className="text-xs text-gray-600">
              Il s&lsquo;agit d&lsquo;une opération prise en charge par
              l&lsquo;assurance maladie.
            </p>
            <Link href="/" passHref={true}>
              <button className="text-white bg-shamrock rounded px-6 py-3 transition border border-shamrock hover:text-shamrock hover:bg-white">
                Estimez mon séjour
              </button>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2 w-full relative">
            <Image
              src={categoryPhoto}
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
          <MDEditor.Markdown source={surgeryData.props.data.descriptionBody} />
        </div>
        <div className="space-y-6">
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
        </div>
      </div>
      <ContactHelper />
      <Footer />
    </div>
  );
};

export default OperationPage;
