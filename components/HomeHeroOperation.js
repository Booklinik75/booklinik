import Image from "next/image";
import "./HomeHeroOperation.module.css";
import Link from "next/link";

const Operation = ({ extraStyle, data }) => {
  console.log(data);
  return (
    <div className="w-full">
      <Link scroll={false} href={`/operations/#${data.slug}`}>
        <a className="w-full">
          <div
            className={
              "flex flex-col p-4 items-center bg-white hover:cursor-pointer rounded-lg border border-black border-opacity-10 shadow transition hover:shadow-md hover:border-opacity-20 hover:bg-gray-50 " +
              extraStyle
            }
          >
            {data.icon && (
              <Image src={data.icon} width={64} height={64} alt={data.name} />
            )}
            <div className="mt-2">
              <p className="font-bold">{data.name}</p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Operation;
