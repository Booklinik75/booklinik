import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAuth,
  getHotelsWithIds,
  getOptions,
} from "../../../../utils/ServerHelpers";
import Link from "next/link";
import { AiFillQuestionCircle } from "react-icons/ai";
import slugify from "slugify";

export const getServerSideProps = async (ctx) => {
  const userProfile = await checkAuth(ctx);
  const hotels = await getHotelsWithIds();
  const options = await getOptions();

  return {
    props: { userProfile, hotels, options },
  };
};

const OptionsList = ({ hotels, options }) => {
  return (
    <DashboardUi isAdmin={true}>
      <div className="col-span-10 space-y-6">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Options</h1>
        </div>
        {hotels.map((hotel) => {
          return (
            <div
              key={hotel.data.slug}
              className="bg-gray-50 shadow rounded p-6 transition hover:bg-gray-100"
            >
              <div className="flex gap-3 justify-between items-center">
                <h2 className="text-xl">{hotel.data.name}</h2>
                {options[hotel.id] ? (
                  <Link href={`/dashboard/admin/options/edit/${hotel.id}`}>
                    <a className="rounded px-3 py-1 text-white bg-bali transition hover:bg-shamrock">
                      Éditer
                    </a>
                  </Link>
                ) : (
                  ""
                )}
              </div>
              {options[hotel.id] ? (
                <div className="flex gap-2 items-center">
                  {options[hotel.id][0].map((option) => {
                    return (
                      <div
                        key={slugify(option.name, { lower: true })}
                        className="flex mt-4"
                      >
                        <p className="px-3 py-1 rounded-l bg-blue-100">
                          {option.name}
                        </p>
                        <p className="px-3 py-1 bg-blue-900 text-white rounded-r">
                          {parseInt(option.price) === 0
                            ? "Gratuit"
                            : option.price + " €"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Link href={`/dashboard/admin/options/add/${hotel.id}`}>
                  <a className="w-full group">
                    <div className="p-10 my-3 w-full flex items-center flex-col rounded border transition border-gray-500 border-dashed bg-blue-50 group-hover:bg-blue-100">
                      <p className="text-lg text-blue-800 flex items-center gap-2">
                        <AiFillQuestionCircle />
                        Options non-définies pour cet hotel
                      </p>
                      <p className="text-sm text-blue-900 transition group-hover:underline">
                        Cliquez ici pour les définir
                      </p>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </DashboardUi>
  );
};

export default OptionsList;
