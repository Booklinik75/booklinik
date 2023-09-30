import Image from "next/image";
import "./HomeHeroOperation.module.css";
import Link from "next/link";

const Operation = ({ extraStyle, data, surgeries }) => {
  const getStartingPrice = () => {
    let storePrices = [];
    surgeries.forEach((surgery) => {
      if (surgery.category === data.slug && data.slug !== "other") {
        storePrices.push(Number(surgery.startingPrice));
      }
    });

    return Math.min(...storePrices);
  };

  return (
    <div className="w-full">
      <Link href={`/operations/#${data.slug}`}>
        <a className="w-full">
          <div
            className={
              "flex flex-col p-4 items-center bg-white hover:cursor-pointer rounded-lg border border-black border-opacity-10 shadow transition hover:shadow-md hover:border-shamrock hover:bg-gray-50 h-full justify-center " +
              extraStyle
            }
          >
            {data.icon && (
              <Image src={data.icon} width={64} height={64} alt={data.name} />
            )}
            <div className="mt-2 flex flex-col items-center">
              <p className="font-thin">{data.name}</p>
              {data.slug !== "others" ? (
                <span className="italic mt-2 w-100 text-gray-400 text-sm block">
                  À partir de {getStartingPrice()}€
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Operation;
