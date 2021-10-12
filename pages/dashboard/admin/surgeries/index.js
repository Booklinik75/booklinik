import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getSurgeries,
  getOperationCategories,
} from "../../../../utils/ServerHelpers";
import Link from "next/link";
import Image from "next/image";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const categories = await getOperationCategories();
  const surgeries = await getSurgeries();

  return {
    props: { categories, surgeries, auth },
  };
};

const SurgeriesList = ({ categories, surgeries, auth }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Liste d&apos;opérations</h1>
          <Link href="surgeries/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        <div className="space-y-6">
          {categories.map((category) => {
            return (
              <div key={category.slug} className="space-y-3">
                <h2 className="text-xl mb-2">{category.name}</h2>
                <div className="grid grid-cols-12 gap-4">
                  {surgeries.map((surgery) => {
                    if (surgery.category === category.slug) {
                      return (
                        <div
                          key={surgery.slug}
                          className="col-span-12 md:col-span-6 lg:col-span-4"
                        >
                          <Link
                            href={`/dashboard/admin/surgeries/edit/${surgery.slug}`}
                          >
                            <a className="w-full lg:max-w-max">
                              <div
                                key={surgery.slug}
                                className="rounded shadow bg-gray-50 transition hover:bg-gray-100 hover:shadow-lg hover:cursor-pointer"
                              >
                                <div className="p-3 space-y-2">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                                      {surgery.slug}
                                    </p>
                                    <p className="bg-bali text-white px-2 py-1 rounded">
                                      {surgery.startingPrice}&nbsp;€
                                    </p>
                                  </div>
                                  <div className="gap-1">
                                    <p>{surgery.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {surgery.additionalDocuments.length} set
                                      de photo
                                      {surgery.additionalDocuments.length > 0
                                        ? "s"
                                        : ""}
                                    </p>
                                    {surgery.cities.length > 0 ? (
                                      <p className="text-xs text-blue-800 surgeries-cities">
                                        {surgery.cities.map((city) => {
                                          return <span key={city}>{city}</span>;
                                        })}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardUi>
  );
};

export default SurgeriesList;
