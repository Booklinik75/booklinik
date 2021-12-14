import Link from "next/link";

const Category = ({ href, title, imageSrc }) => {
  return (
    <Link href={href}>
      <a className="w-full">
        <div className="flex bg-white rounded-lg border overflow-hidden border-black border-opacity-10 shadow transition hover:cursor-pointer hover:shadow-md hover:border-opacity-20 hover:bg-gray-50 group">
          <div
            style={{
              backgroundImage: `url("${imageSrc}")`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              width: "33%",
            }}
            className="rounded-l-lg scale-100 lg:group-hover:scale-105 mr-4 lg:mr-0 transition duration-500"
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
