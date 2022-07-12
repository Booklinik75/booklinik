import Logo from "public/booklinik-logo.svg";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center z-50 relative">
      <div className="w-full h-full bg-gray-300 animate-pulse absolute"></div>
      <div className="flex gap-4 items-center">
        <BiLoaderAlt className="animate-spin" size={28} />

        <Image src={Logo} alt="Booklinik+"></Image>
      </div>
    </div>
  );
};

export default Loader;
