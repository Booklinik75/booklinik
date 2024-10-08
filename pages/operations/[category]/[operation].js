import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import ContactHelper from "../../../components/ContactHelper";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import RelatedElement from "../../../components/RelatedSuggestionElement";
import ReactCompareImage from "react-compare-image";
import {
  getBackEndAsset,
  getOperationCategories,
  getOperationData,
  getRelatedSurgeries,
  getSurgeries,
  getSurgeryData,
  getDoctorSurgeries,
  getAfterBeforeSurgeries,
} from "../../../utils/ServerHelpers";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

export const getStaticPaths = async () => {
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
  const categoryPhoto = await getBackEndAsset(categoryData.data.photo);
  const relatedSurgeries = await getRelatedSurgeries(surgeryData.data.category);
  const doctorSurgeries = await getDoctorSurgeries(surgeryData.data.name);
  const beforeAfter = await getAfterBeforeSurgeries(surgeryData.data.slug);

  return {
    props: {
      surgeryData,
      categoryPhoto,
      relatedSurgeries,
      doctorSurgeries,
      beforeAfter,
    },
    revalidate: 120,
  };
};

const OperationPage = ({
  surgeryData,
  categoryPhoto,
  relatedSurgeries,
  doctorSurgeries,
  beforeAfter,
}) => {
  return (
    <div className="space-y-6">
      <Head>
        <title>Booklinik | {surgeryData.data.name}</title>
      </Head>
      <Navigation />

      <div className="mx-4 space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 lg:col-span-1 bg-gray-100 p-14 space-y-4">
            <h1 className="text-5xl">{surgeryData.data.name}</h1>
            <p className="text-shamrock">
              À partir de {surgeryData.data.startingPrice} €
            </p>
            <pre>{surgeryData.data.excerpt} </pre>
            <Link href="/book" passHref={true}>
              <button className="text-white bg-shamrock rounded px-6 py-3 transition border border-shamrock hover:text-shamrock hover:bg-white">
                Estimez mon séjour
              </button>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2 w-full relative">
            <Image
              src={surgeryData.data.photoUrl || categoryPhoto}
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
              alt="TBD"
            />{" "}
          </div>
        </div>
      </div>
      <div className="mx-4 xl:mx-auto max-w-7xl space-y-10">
        {beforeAfter[0].beforeafter
          ? beforeAfter[0].beforeafter.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl">Avant/Après</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {beforeAfter[0].beforeafter.map((x, i) => {
                    return (
                      <div
                        key={(x, i)}
                        className="col-span-1 rounded relative transition shadow hover:shadow-lg group"
                      >
                        <ReactCompareImage
                          leftImage={x.leftimage}
                          rightImage={x.rightimage}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          : ""}

        <div>
          <Markdown source={surgeryData.data.descriptionBody} />
        </div>
        {doctorSurgeries[0]?.doctor?.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl">Nos médecins</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {doctorSurgeries[0].doctor.map((x, i) => {
                return (
                  <div key={x.slug} className="">
                    <RelatedElement
                      title={x.name}
                      target="URL:void(0)"
                      key={(x, i)}
                      picture={x.photoUrl}
                      //  picture={surgeryData.data.photoUrl || categoryPhoto} // meme photo
                    />
                    <Markdown
                      className="text-gray-600 overflow-ellipsis transition line-clamp-3 hover:line-clamp-none"
                      source={x.doctorExcerpt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="space-y-6">
          <h2 className="text-2xl">Opérations similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSurgeries.map((surgery) => {
              return (
                <RelatedElement
                  title={surgery.name}
                  target={`/operations/${surgery.category}/${surgery.slug}`}
                  key={surgery.slug}
                  picture={surgery.photoUrl || categoryPhoto}
                  //picture={surgeryData.data.photoUrl || categoryPhoto} // meme photo
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
