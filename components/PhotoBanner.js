import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const PhotoBanner = ({
  title,
  body,
  fileName,
  discover,
  extraLarge,
  fullWidth,
  overlay,
}) => {
  var divStyle = {
    backgroundImage: `url(${fileName})`,
    backgroundColor: "#ccc",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
  };

  const photoBannerTitle = useRef(null);

  useEffect(() => {
    // parallax effect
    window.onscroll = () => {
      if (photoBannerTitle.current) {
        photoBannerTitle.current.style.transform = `translateY(-${
          window.scrollY / 2
        }%)`;
      }
    };
  }, []);

  return (
    <div
      style={divStyle}
      className={
        "mx-4 flex flex-col mb-10 rounded-xl items-center relative text-white " +
        (extraLarge ? "py-32 " : "py-24 ") +
        (fullWidth ? "" : "mx-auto max-w-7xl")
      }
    >
      <h1
        className="text-7xl md:text-8xl my-10 font-decorative text-center"
        style={{ display: title ? "block" : "none" }}
        ref={photoBannerTitle}
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

PhotoBanner.defaultProps = {
  title: undefined,
  body: undefined,
  fileName: "https://via.placeholder.com/1000?text=en+attente+d&lsquo;image",
  discover: false,
  extraLarge: false,
  fullWidth: false,
};

export default PhotoBanner;
