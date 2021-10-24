import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ContactHelper from "../../components/ContactHelper";
import Head from "next/head";
import firebase from "firebase/clientApp";
import MDEditor from "@uiw/react-md-editor";

export const getStaticPaths = async () => {
  const docs = [];

  await firebase
    .firestore()
    .collection("legal")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => docs.push(doc.data()));
    });

  // map data to an array of path objects with params (id)
  const paths = docs.map((legal) => {
    return {
      params: { urlSlug: legal.urlSlug.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const slug = context.params.urlSlug;

  const docs = [];
  await firebase
    .firestore()
    .collection("legal")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => docs.push(doc.data()));
    });

  const currentDoc = [];
  await firebase
    .firestore()
    .collection("legal")
    .where("urlSlug", "==", slug)
    .get()
    .then((snapshot) => snapshot.forEach((doc) => currentDoc.push(doc.data())));

  return {
    props: {
      legal: currentDoc[0],
      paths: docs,
    },
  };
};

const LegalPage = ({ legal, paths }) => {
  return (
    <div>
      <Head>
        <title>Booklinik | {legal.metaTitle}</title>
      </Head>
      <Navigation />
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mx-4 xl:mx-auto max-w-7xl py-12">
          <div className="col-span-6 lg:col-span-2 space-y-2">
            {paths.map((path) => (
              <Link href={"/legal/" + path.urlSlug} key={path.id}>
                <a
                  className={
                    "block hover:underline " +
                    (legal.urlSlug === path.urlSlug
                      ? "font-semibold text-shamrock"
                      : "")
                  }
                >
                  {path.metaTitle}
                </a>
              </Link>
            ))}
          </div>
          <div className="col-span-6 lg:col-span-4">
            <h1 className="text-2xl font-semibold mb-6">{legal.metaTitle}</h1>
            <p className="flex flex-col">
              <MDEditor.Markdown
                source={legal.body.replace(/\\n/g, "\n")}
                className="flex flex-col"
              />
            </p>
          </div>
        </div>
      </div>
      <ContactHelper />
      <Footer />
    </div>
  );
};

export default LegalPage;
