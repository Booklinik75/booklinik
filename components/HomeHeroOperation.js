import Image from "next/image";
import "./HomeHeroOperation.module.css";
import Link from "next/link";

const Operation = ({ extraStyle, data }) => {
  return (
    <div className="w-full">
      <Link scroll={false} href={`/operations/#${data.slug}`}>
        <a className="w-full">
          <div
            className={
              "flex bg-white hover:cursor-pointer rounded-lg border border-black border-opacity-10 shadow transition hover:shadow-md hover:border-opacity-20 hover:bg-gray-50 " +
              extraStyle
            }
          >
            <div
              style={{
                backgroundImage: `url("${data.photo}")`,
                backgroundSize: "cover",
                backgroundPosition: "50%",
                width: "33%",
              }}
              className="mr-6 rounded-l-lg"
            ></div>
            <div className="py-8 px-0 lg:px-2">
              <p className="font-bold">{data.name}</p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Operation;
