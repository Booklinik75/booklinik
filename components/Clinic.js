import Image from "next/image";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";


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
                className="rounded-lg bg-gray-500 scale-100 group-hover:scale-110 transition duration-700"
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
          <MDEditor.Markdown className="text-gray-600 overflow-ellipsis transition line-clamp-3 hover:line-clamp-none" source={clinic.excerpt}/>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Clinic;
