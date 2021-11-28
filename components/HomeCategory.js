import Link from "next/link";

const Category = ({ href, title, imageSrc }) => {
  return (
    <Link href={href}>
      <a className="w-full">
        <div className="flex homeCategory__card bg-white rounded-lg border overflow-hidden  border-black border-opacity-10 shadow transition hover:cursor-pointer hover:shadow-md hover:border-opacity-20 hover:bg-gray-50">
          <div
            style={{
              backgroundImage: `url("${imageSrc}")`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              width: "33%",
              transform: "scale(1)",
              transition: ".5s",
            }}
            className="mr-6 rounded-l-lg"
          ></div>
          <div className="py-8 px-0 lg:px-2">
            <p className="font-bold text-lg">{title}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Category;
