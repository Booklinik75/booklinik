import Image from "next/image";

{
  /* TODO : add arguments */
}

const EmblaSlide = () => {
  return (
    <div className="embla__slide relative mr-10">
      <Image
        src="https://via.placeholder.com/1000?text=en+attente+d'image"
        width={1000}
        height={600}
        objectFit="cover"
        layout="fixed"
        className="rounded-xl"
        meta="TBD"
      />{" "}
      <p className="text-sm uppercase text-center text-gray-600">
        Slide d'exemple
      </p>
    </div>
  );
};

export default EmblaSlide;
