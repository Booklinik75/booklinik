import Image from "next/image";
import StarRating from "./StarRating";
import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

const DestinationHotel = ({ hotel, city }) => {
  return (
    <div className="col-span-1 space-y-2 group cursor-pointer">
      <div className="w-full rounded-xl relative">
        <div className="relative h-48 rounded-xl overflow-hidden">
          <Image
            src={hotel.photo}
            layout="fill"
            objectFit="cover"
            alt="TBD"
            className="rounded-lg bg-gray-500 scale-100 group-hover:scale-150 transition duration-800"
          />
          <div className="opacity-30 bg-gradient-to-t from-black rounded-lg w-full h-full absolute"></div>
        </div>
        <div className="absolute mx-4 text-white bottom-4 space-y-1">
          <h3 className="text-lg">{hotel.name}</h3>
          <div className="flex col-row gap-2 items-center text-xs">
            <StarRating value={hotel.rating} color="white" />
            &bull;
            <p>{city}</p>
          </div>
        </div>
      </div>
      <div>
        {/*<p className="text-s text-gray-500 text-justify mx-0.5">
          {hotel.excerpt}
        </p>
         <p className="text-lg text-center prose prose-lg">
        //     only show the two first sentences of the excerpt
            {excerpt.split(".").slice(0, 2).join(".")}.
          </p>
        */}
        <Markdown
          wrapperElement={{ "data-color-mode": "light" }}
          className="text-gray-500 overflow-ellipsis transition line-clamp-3 hover:line-clamp-none"
          source={hotel.excerpt}
        />
      </div>
    </div>
  );
};

export default DestinationHotel;
