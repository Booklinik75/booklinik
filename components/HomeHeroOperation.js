import Image from "next/image";
import "./HomeHeroOperation.module.css";

const Operation = ({ extraStyle }) => {
  return (
    <div
      className={
        "flex bg-white hover:cursor-pointer rounded-lg border border-black border-opacity-10 shadow transition hover:shadow-md hover:border-opacity-20 hover:bg-gray-50 " +
        extraStyle
      }
    >
      <div
        style={{
          backgroundImage: `url("https://via.placeholder.com/1000?text=en+attente+d\\'image")`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          width: "33%",
        }}
        className="mr-6 rounded-l-lg"
      ></div>
      <div className="py-8 px-0 lg:px-2">
        <p className="font-bold">Greffe de poils</p>
        <p className="text-sm">
          À partir de <span className="text-shamrock font-bold">1900€</span>
        </p>
      </div>
    </div>
  );
};

export default Operation;
