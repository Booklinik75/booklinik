import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);
const Clinic = ({ clinic, city, citySlug, countrySlug }) => {
  return (
    <Link href={`cliniques/${countrySlug}/${citySlug}/${clinic.slug}`}>
      <a>
        <div className="col-span-1 space-y-2 rounded-lg group">
          <div className="w-full rounded-xl relative">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src={clinic.photo}
                layout="fill"
                objectFit="cover"
                alt="TBD"
                className="rounded-lg bg-gray-500 scale-100 group-hover:scale-150 transition duration-800"
              />
              <div className="opacity-30 bg-gradient-to-t from-black rounded-lg w-full h-full absolute"></div>
            </div>
            <div className="absolute mx-4 text-white bottom-4 space-y-1">
              <h3 className="text-lg">{clinic.name}</h3>
              <div className="flex col-row gap-2 items-center text-xs">
                <p>{city}</p>
              </div>
            </div>
          </div>
          <div>
            <Markdown
              wrapperElement={{ "data-color-mode": "light" }}
              className="text-gray-600 overflow-ellipsis transition line-clamp-3 hover:line-clamp-none"
              source={clinic.excerpt}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Clinic;
