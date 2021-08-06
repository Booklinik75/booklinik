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
        <title>Booklinik | Nos Valeurs</title>
      </Head>
      <Navigation />
      <PhotoBanner
        title="Nos Valeurs"
        body={bodyContents}
        fileName={fileName}
        fullWidth={true}
        discover={true}
      />

      <div className="flex flex-col items-center mb-10" id="content">
        <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
          <h2 className="font-bold text-3xl">La sécurité</h2>
          <p className="text-center w-full lg:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit dolor
            voluptatum laborum officiis eum accusamus vel ratione. At
            consequuntur, illum consectetur laborum eius beatae quidem aliquam
            voluptate, illo, sunt dignissimos!
          </p>
          <Link href="/etapes">
            <a className="flex items-center text-lg text-bali hover:underline">
              Découvrir les étapes clés de votre voyage{" "}
              <FaChevronRight size={14} />
            </a>
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-10">
        <div className="flex flex-col items-center" id="content">
          <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
            <h2 className="font-bold text-3xl">Le confort</h2>
            <p className="text-center w-full mb-4 lg:w-2/3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              dolor voluptatum laborum officiis eum accusamus vel ratione. At
              consequuntur, illum consectetur laborum eius beatae quidem aliquam
              voluptate, illo, sunt dignissimos!
            </p>
          </div>
        </div>
        <div className="relative mt-6">
          <button
            onClick={scrollPrev}
            className="absolute z-50 top-1/2 left-3 text-white"
          >
            <FaChevronLeft size={36} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute z-50 top-1/2 right-3 text-white"
          >
            <FaChevronRight size={36} />
          </button>

          <div className="embla overflow-hidden" ref={viewportRefS}>
            <div className="embla__container flex">
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
            </div>
          </div>
        </div>
        <div className="flex items-center w-screen text-bali justify-center mt-6">
          <Link href="/destinations">
            <a className="flex items-center text-lg text-bali hover:underline">
              Découvrez les hôtels sélectionné juste pour vous
            </a>
          </Link>
          <FaChevronRight size={14} />
        </div>
      </div>

      <div className="bg-white py-10">
        <div className="flex flex-col items-center" id="content">
          <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
            <h2 className="font-bold text-3xl">La découverte</h2>
            <p className="text-center w-full mb-4 lg:w-2/3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              dolor voluptatum laborum officiis eum accusamus vel ratione. At
              consequuntur, illum consectetur laborum eius beatae quidem aliquam
              voluptate, illo, sunt dignissimos!
            </p>
          </div>
        </div>
        <div className="relative mt-6">
          <button
            onClick={scrollPrev}
            className="absolute z-50 top-1/2 left-3 text-white"
          >
            <FaChevronLeft size={36} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute z-50 top-1/2 right-3 text-white"
          >
            <FaChevronRight size={36} />
          </button>

          <div className="embla overflow-hidden" ref={viewportRef}>
            <div className="embla__container flex">
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
              <EmblaSlide />
            </div>
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
