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

export default function Home() {
  return (
    <div className="container mx-auto max-w-full">
      <Head>
        <title>Booklinik | Accueil</title>
        <meta name="description" content="uwu" />
      </Head>

      <Navigation />

      <div className={styles.homeHero}>
        <div className="flex h-screen">
          <div className="mx-4 my-12 shadow md:shadow-none xl:mx-auto md:my-32">
            <div className="bg-white bg-opacity-90 max-w-7xl p-10 md:p-20 rounded-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12">
                Estimez et réservez votre voyage médical sur mesure en quelques
                clics.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Operation />
                <Operation />
                <Operation />
                <Operation extraStyle="hidden md:flex" />
                <Operation extraStyle="hidden md:flex" />
                <Operation extraStyle="hidden md:flex" />
                <Operation extraStyle="hidden lg:flex" />
                <Operation extraStyle="hidden lg:flex" />
                <Operation extraStyle="hidden lg:flex" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl px-4 xl:px-0 xl:mx-auto w-full my-12">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Category />
          <Category />
          <Category />
        </div>
      </div>

      <div
        className={
          styles.values +
          " mx-4 xl:mx-auto max-w-7xl p-10 md:px-20 md:py-32 rounded-xl text-white"
        }
      >
        <div className="md:w-1/2 lg:w-1/3">
          <p className="uppercase text-sm mb-2">Découvrez nos valeurs</p>
          <h2 className="text-4xl">Parce que votre bien-être est notre</h2>
          <p className="mt-4 mb-2">Les 8 étapes clé de votre voyage</p>
          <Link href="#">
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
        <h3 className="text-4xl mb-8">Les avantages Booklinik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <Advantage />
          <Advantage />
          <Advantage />
          <Advantage />
        </div>
      </div>

      {/* témoignage */}
      <div className="mx-4 xl:mx-auto max-w-5xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <Image
            src="https://via.placeholder.com/1000?text=en+attente+d'image"
            width={500}
            height={500}
            objectFit="cover"
          />
          <div className="space-y-5 md:space-y-10">
            <div className="space-y-2">
              <div className="text-bali">
                <GoQuote size={48} />
              </div>
              <p className="text-2xl md:text-3xl leading-normal">
                Merci d'avoir simplifié mes démarches pour ma chirurgie de
                l'oeil. Je ne savais pas à qui faire confiance avant{" "}
                <span className="text-bali">booklinik.com</span>.
              </p>
            </div>
            <div className="space-y-2">
              <p>Tessa, Paris</p>
              <Link href="#">
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
