import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";

const PhotoBanner = ({
  title,
  body,
  fileName,
  discover,
  extraLarge,
  fullWidth,
}) => {
  var divStyle = {
    backgroundImage:
      "url(https://via.placeholder.com/1000?text=en+attente+d\\'image)",
    backgroundSize: "cover",
    backgroundPosition: "50%",
  };

  return (
    <div
      style={divStyle}
      className={
        "mx-4 flex flex-col mb-10 rounded-xl items-center text-white " +
        (extraLarge ? "py-32" : "py-24") +
        (fullWidth ? "" : "max-w-7xl")
      }
    >
      <h1
        className="text-7xl md:text-8xl my-10"
        style={{ display: title ? "block" : "none" }}
      >
        {title}
      </h1>
      <p
        className="w-11/12 md:w-2/3 lg:w-1/3 text-center mb-10"
        style={{ display: body ? "block" : "none" }}
      >
        {body}
      </p>
      <div style={{ display: discover ? "block" : "none" }}>
        <Link href="#content">
          <a className="text-xs uppercase text-center items-center flex flex-col">
            Découvrir{" "}
            <div className="mt-1">
              <FaChevronDown />
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PhotoBanner;
