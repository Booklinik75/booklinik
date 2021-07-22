import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import ContactHelper from "../../../components/ContactHelper";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import RelatedElement from "../../../components/RelatedSuggestionElement";

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8000/operations");
  const data = await res.json();

  const paths = data.categories
    .map((category) => {
      return category.operations.map((operation) => {
        return {
          params: {
            category: category.slug.toString(),
            operation: operation.slug.toString(),
          },
        };
      });
    })
    .flat();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const res = await fetch("http://localhost:8000/operations");
  const data = await res.json();

  return {
    props: {
      operationsData: data.categories,
    },
  };
};

const OperationPage = ({ operationsData }) => {
  const router = useRouter();
  const { category, operation } = router.query;

  const currentOperation = operationsData
    .find((cat) => cat.slug === category)
    .operations.find((op) => op.slug === operation);

  return (
    <div>
      <Head>
        <title>Booklinik | {currentOperation.name}</title>
      </Head>
      <Navigation />
      <div className="mx-4 lg:mx-auto max-w-7xl space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 lg:col-span-1 bg-gray-100 p-14 space-y-4">
            <h1 className="text-5xl">{currentOperation.name}</h1>
            <p className="text-shamrock">
              À partir de {currentOperation.startingPrice}€
            </p>
            <p>{currentOperation.excerpt}</p>
            <p className="text-xs text-gray-600">
              Il s'agit d'une opération prise en charge par l'assurance maladie.
            </p>
            <Link href="/">
              <button className="text-white bg-shamrock rounded px-6 py-3 transition border border-shamrock hover:text-shamrock hover:bg-white">
                Estimez mon séjour
              </button>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2 w-full relative">
            <Image
              src="https://via.placeholder.com/1000?text=en+attente+d'image"
              layout="fill"
              objectFit="cover"
              meta="TBD"
            />{" "}
          </div>
        </div>
        <div>
          <ReactMarkdown>{currentOperation.excerpt}</ReactMarkdown>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl">Opérations similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {operationsData
              .find((cat) => cat.slug === category)
              .operations.filter((opEl) => {
                if (opEl.slug === operation) {
                  return false;
                }
                return true;
              })
              .map((operation) => {
                return (
                  <RelatedElement
                    title={operation.name}
                    target={`/operations/${category}/${operation.slug}`}
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
