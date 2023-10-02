import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const OpCategory = ({ operation, surgeries }) => {
  return (
    <div className="pt-1" id={operation.slug}>
      <div className="flex flex-col max-w-7xl mx-4 xl:mx-auto my-10">
        <h2 className="mb-4 font-medium text-xl">{operation.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div>
              <div className="hidden lg:block">
                <Image
                  src={operation.photo}
                  width={500}
                  height={375}
                  objectFit="cover"
                  className="rounded-xl"
                  alt="TBD"
                />
              </div>
              <div className="block lg:hidden">
                <Image
                  src={operation.photo}
                  width={1000}
                  height={400}
                  objectFit="cover"
                  className="rounded-xl"
                  alt="TBD"
                />
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-2"
            style={{ height: "min-content" }}
          >
            {surgeries.map((surgery) => {
              return surgery.category === operation.slug ? (
                <div key={surgery.slug}>
                  <Link href={`/operations/${operation.slug}/${surgery.slug}`}>
                    <a>
                      <div
                        className="border border-gray-100 shadow-sm rounded col-span-1 w-full transition hover:shadow-lg hover:border-shamrock hover:bg-gray-50 hover:cursor-pointer"
                        id={surgery.slug}
                      >
                        <div className="flex items-center justify-between justify-items-center h-full px-6 py-6 lg:py-auto">
                          <div>
                            <h3 className="text-lg">{surgery.name}</h3>
                            <p className="text-sm">
                              À partir de {surgery.startingPrice}€
                            </p>
                          </div>
                          <div className="text-shamrock">
                            <FaChevronRight size={32} />
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ) : (
                ""
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpCategory;
