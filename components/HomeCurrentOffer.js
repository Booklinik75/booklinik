import Image from "next/image";
import StarRating from "./StarRating";

const Offer = () => {
  return (
    <div className="space-y-1">
      <Image
        src="https://via.placeholder.com/1000"
        width={1000}
        height={650}
        objectFit="cover"
        className="rounded-xl w-full"
      />
      <div className="flex space-x-2 items-center text-xs font-bold uppercase">
        <p className="text-white py-1 px-2 rounded bg-bali">Offre</p>
        <p className="flex-grow text-bali">Reste 2 jours</p>
        <StarRating value={4} />
      </div>
      <p className="font-bold hover:underline">
        Implantation capillaire 4000 greffons à Istanbul - Clinique DHI
      </p>
      <div className="flex space-x-1 text-sm text-bali font-bold">
        <p>Witt Istanbul Suites</p>
        <p>&bull;</p>
        <p>À partir de 2350€</p>
      </div>
    </div>
  );
};

export default Offer;
