import Image from "next/image";
import Link from "next/link";

const Clinic = ({ clinic, city, citySlug, countrySlug }) => {
  return (
    <Link href={`cliniques/${countrySlug}/${citySlug}/${clinic.slug}`}>
      <a>
        <div className="col-span-1 space-y-2">
          <div className="w-full rounded-xl relative">
            <div className="relative h-48 rounded-xl">
              <Image
                src={clinic.photo}
                layout="fill"
                objectFit="cover"
                alt="TBD"
                className="rounded-lg bg-gray-500"
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
            <p className="text-xs text-gray-600 text-justify mx-0.5 overflow-ellipsis transition line-clamp-3 hover:line-clamp-none">
              {clinic.excerpt}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Clinic;
