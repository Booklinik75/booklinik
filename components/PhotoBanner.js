import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const PhotoBanner = ({ title, body, fileName }) => {
  var divStyle = {
    backgroundImage: "url(https://via.placeholder.com/1920x1080)",
    backgroundSize: "cover",
    backgroundPosition: "50%",
  };

  return (
    <div
      style={divStyle}
      className="mx-4 xl:mx-auto max-w-7xl py-24 flex flex-col mb-10 rounded-xl items-center text-white"
    >
      <h1 className="font-hand text-7xl md:text-9xl mb-10">{title}</h1>
      <p className="w-11/12 md:w-2/3 lg:w-1/3 text-center mb-10">{body}</p>
      <Link href="#content">
        <a className="text-xs uppercase text-center items-center flex flex-col">
          Découvrir{" "}
          <div className="mt-1">
            <FaChevronDown />
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PhotoBanner;
