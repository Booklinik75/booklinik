import Link from "next/link";
import React, { useCallback } from "react";
import ContactHelper from "../components/ContactHelper";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import PhotoBanner from "../components/PhotoBanner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEmblaCarousel } from "embla-carousel/react";
import EmblaSlide from "../components/EmblaSlide";
import Head from "next/head";

const Values = () => {
  const bodyContents =
    "Parce que votre bien-être est notre priorité nous vous garantissons des critères de qualité et de sécurité.";

  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fsimon-migaj-Yui5vfKHuzs-unsplash%20copie.jpg?alt=media&token=de1492a8-392f-4e26-a7f1-e23b9c170596";

  const options = {
    loop: true,
    draggable: true,
    slidesToScroll: 1,
    freeScroll: true,
  };
  const [viewportRef, embla] = useEmblaCarousel(options);
  const [viewportRefS, emblaS] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const scrollPrevS = useCallback(
    () => emblaS && emblaS.scrollPrev(),
    [emblaS]
  );
  const scrollNextS = useCallback(
    () => emblaS && emblaS.scrollNext(),
    [emblaS]
  );

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Booklinik | À Propos</title>
      </Head>
      <Navigation />
      <PhotoBanner
        title="À propos"
        body={bodyContents}
        fileName={fileName}
        fullWidth={true}
        discover={true}
      />

      <div className="py-10">
        <div className="flex flex-col items-center" id="content">
          <div className="flex flex-col items-center space-y-10 my-6">
            <p className="text-center w-full mb-4 prose prose-lg">
              Booklinik est une plateforme de réservation en ligne pour votre
              intervention esthétique. Nous sommes une startup française
              spécialisée dans la mise en relation de patients et cliniques
              esthétiques. Nous avons 7 ans d&apos;expériences dans le monde de
              la chirurgie esthétique et médicale avec plus de 8400
              interventions à notre actif.
            </p>
            <p className="text-center w-full mb-4 prose prose-lg">
              Une équipe jeune et dynamique avec chacun ses compétences. Sur
              Booklinik, en seulement quelques clics, le patient peut créer son
              profil, importer ses photos et indiquer ses disponibilités. La
              plateforme analyse votre demande et vous propose le meilleur
              chirurgien pour votre opération esthétique tout en proposant des
              facilités de paiement.
            </p>
            <p className="text-center w-full mb-4 prose prose-lg">
              Une application mobile est en cours de lancement pour que vous
              puissiez suivre toutes les instructions nécessaires une fois
              arrivée sur place.
            </p>
          </div>
        </div>
        <div className="bg-gray-100 p-10">
          <div className="flex flex-col items-center justify-center">
            {/* youtube video */}
            <iframe
              src="https://www.youtube.com/embed/5qap5aO4i9A"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-96 max-w-3xl"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="bg-white py-10">
        <div className="flex flex-col items-center" id="content">
          <div className="flex flex-col items-center space-y-10 my-6">
            <h2 className="font-bold text-3xl">La découverte</h2>
            <p className="text-center w-full mb-4 prose prose-lg">
              Aujourd&apos;hui, 9 patients sur 10 font leurs recherches sur
              Internet et prennent le risque de se faire opérer dans des
              cliniques sans connaître les capacités du chirurgien et sans avoir
              la garantie d&apos;un suivi. Booklinik est sur le terrain pour
              vous, nous avons pris en compte les manques et les remarques de
              nos patients et sélectionné les meilleurs médecins et cliniques
              dans leur domaine.
            </p>
            <p className="text-center w-full mb-4 prose prose-lg">
              Une équipe de contrôle qualité et d&apos;hygiène est sur place
              tous les jours sur le terrain pour vous apporter une meilleure
              expérience. Nos accompagnateurs francophones sont bilingues et
              vous suivent dès votre arrivée le jour de l&apos;intervention et
              jusqu&apos;à votre départ.
            </p>
            <p className="text-center w-full mb-4 prose prose-lg">
              Notre équipe en France est connecté et disponible pour votre suivi
              et reste à votre disponibilité pour toutes questions.
            </p>
          </div>
        </div>
        <div className="flex items-center w-screen text-bali justify-center mt-6">
          <Link href="/destinations">
            <a className="flex items-center text-lg text-bali hover:underline">
              Découvrez les destinations sélectionné juste pour vous
            </a>
          </Link>
          <FaChevronRight size={14} />
        </div>
      </div>

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default Values;
