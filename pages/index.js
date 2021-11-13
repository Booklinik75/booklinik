import Head from "next/head";
import Navigation from "../components/Navigation";
import styles from "../components/Index.module.css";
import Operation from "../components/HomeHeroOperation";
import Category from "../components/HomeCategory";
import Link from "next/link";
import Offer from "../components/HomeCurrentOffer";
import { FaChevronRight } from "react-icons/fa";
import { GoQuote } from "react-icons/go";
import Advantage from "../components/HomeAdvantage";
import Image from "next/image";
import Footer from "../components/Footer";
import ContactHelper from "../components/ContactHelper";
import { getFrontEndAsset } from "../utils/ClientHelpers";
import {
  getOperationCategories,
  getBackEndAsset,
  getSetting,
} from "../utils/ServerHelpers";

// TODO: add unit test for weird characters like apostrophes and such

export const getStaticProps = async () => {
  const heroImage = await getFrontEndAsset("image-asset.jpg");
  let categories = await getOperationCategories();
  let categoriesSettings = await getSetting("surgeryCategoriesOrdering");

  await Promise.all(
    categories.map(async (operationCategory, index) => {
      let image = await getBackEndAsset(operationCategory.photo);
      categories[index].photo = image;
    })
  );

  categoriesSettings = [...categoriesSettings, { others: "Autres opérations" }];
  categories = [
    ...categories,
    {
      slug: "others",
      icon: "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/operations%2FAutres%20ope%CC%81rations.svg?alt=media&token=5aee4cf6-f092-46dc-8782-6aa4b402c6c9",
      name: "Autres opérations",
      id: "others",
    },
  ];

  return {
    props: { heroImage, categories, categoriesSettings }, // will be passed to the page component as props
  };
};

export default function Home({ heroImage, categories, categoriesSettings }) {
  return (
    <div className="container mx-auto max-w-full">
      <Head>
        <title>Booklinik | Accueil</title>
        <meta
          name="description"
          content="Booklinik, l'unique service de réservation en ligne de tourisme
                médical"
        />
      </Head>

      <Navigation />

      <div
        style={{
          backgroundImage: "url(/assets/home-hero-background.jpg)",
          height: "100vh",
          marginTop: "-110px",
          backgroundSize: "cover",
        }}
      >
        <div className="flex h-screen items-center justify-center">
          <div className="mx-4 my-12 mt-[8rem] lg:mt-12 shadow md:shadow-none xl:mx-auto md:my-32">
            <div className="bg-white bg-opacity-90 max-w-7xl p-10 md:p-20 rounded-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                Booklinik, l’unique service de réservation en ligne de tourisme
                médical
              </h2>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-center mb-12">
                Estimez et réservez votre voyage esthétique médical
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-10 gap-6 home-hero-surgery-categories">
                {categoriesSettings.map((orderedCategory) => {
                  return categories.map((category) => {
                    return Object.keys(orderedCategory)[0].toString() ===
                      category.id ? (
                      <div
                        className="col-span-1 lg:col-span-2"
                        key={category.slug}
                      >
                        <Operation data={category} />
                      </div>
                    ) : (
                      ""
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl px-4 xl:px-0 xl:mx-auto w-full my-12">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Category
            href="/cliniques"
            title="Cliniques"
            imageSrc="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2F542af9d2e639775d04155ddeb8295d48%20copie.jpg?alt=media&token=5ace499e-0efe-4e37-b934-01b1db78b7f2"
          />
          <Category
            href="/destinations"
            title="Destinations"
            imageSrc="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2F66975f67e7ee56b5b434fe075d65cd87%20copie.jpg?alt=media&token=d7ee1d87-02ee-4157-9348-a9dca9e74a86"
          />
          <Category
            href="/destinations"
            title="Hôtels"
            imageSrc="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fae21c7bd1bf0a0006c20a583d2046ee9%20copie.jpg?alt=media&token=92e34938-ba57-4110-9b1c-b532bc6beb13"
          />
        </div>
      </div>

      <div
        className={
          styles.values +
          " mx-4 xl:mx-auto max-w-7xl p-10 md:px-20 md:py-32 rounded-xl text-white"
        }
      >
        <div className="md:w-1/2 lg:w-1/3">
          <p className="uppercase text-sm mb-2">Découvrez Booklinik</p>
          <h2 className="text-4xl">Parce que votre bien-être est notre</h2>
          <p className="mt-4 mb-2">Les 8 étapes clé de votre voyage</p>
          <Link href="/a-propos">
            <a className="hover:underline flex items-center">
              Découvrir <FaChevronRight size={12} />
            </a>
          </Link>
        </div>
      </div>

      <div className="mx-4 xl:mx-auto max-w-7xl py-10">
        <div className="flex flex-row items-baseline justify-between mb-2">
          <h3 className="text-xl mr-2">
            Découvrez les offres Booklikik du moment
          </h3>
          <Link href="#">
            <a className="text-bali text-xs font-bold hover:underline flex items-center">
              Découvrir toutres les offres{" "}
              <FaChevronRight size={10} className="ml-1" />
            </a>
          </Link>
        </div>
        <div className="xl:w-10/12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Offer />
            <Offer />
            <Offer />
          </div>
        </div>
      </div>

      <div className="mx-4 xl:mx-auto max-w-7xl py-6">
        <h3 className="text-4xl my-8">Les avantages Booklinik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <Advantage
            title="Reservation simplifiée"
            body="Booklinik est le premier service de reservation en ligne de tourisme medical. Plus question de régler vos billets d'avions, hotel et opération séparément."
          />
          <Advantage
            title="Paiement en 4x"
            body="Grace à notre partenaire de credit ..., vous pouvez régler votre operation et votre voyage en plusieurs fois sans frais."
          />
          <Advantage
            title="Equipe dédiée"
            body="L’'assistance booklinik est disponible 
pour répondre à toutes vos questions 
avant votre départ. Durant votre 
séjour, un chauffeur et un traducteur 
sont mis à votre disposition."
          />
          <Advantage
            title="Assurance annulation"
            body="L'assurance annulation booklinik vous couvrira si un événement imprévu vous contraint à annuler ou à reporter votre voyage."
          />
        </div>
      </div>

      {/* témoignage */}
      <div className="mx-4 lg:mx-auto max-w-5xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fdaniil-kuzelev-AkGd_YB6Q2c-unsplash%20copie.jpg?alt=media&token=637b7948-db90-4955-865a-8f9b4b2ce5d7"
            width={500}
            height={500}
            objectFit="cover"
            alt="TBD"
          />
          <div className="space-y-5 md:space-y-10">
            <div className="space-y-2">
              <div className="text-bali">
                <GoQuote size={48} />
              </div>
              <p className="text-2xl md:text-3xl leading-normal">
                Merci d&lsquo;avoir simplifié mes démarches pour ma chirurgie de
                l&lsquo;oeil. Je ne savais pas à qui faire confiance avant{" "}
                <span className="text-bali">booklinik.com</span>.
              </p>
            </div>
            <div className="space-y-2">
              <p>Tessa, Paris</p>
              <Link href="/book" passHref={true}>
                <button className="border-2 rounded px-6 py-3 border-gray-500 transition hover:bg-gray-500 hover:text-white">
                  Estimez mon séjour
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* contact form */}
      <ContactHelper />

      {/* footer */}
      <Footer />
    </div>
  );
}
