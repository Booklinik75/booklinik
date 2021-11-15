import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getCities,
  getBackEndAsset,
} from "../../../../utils/ServerHelpers";
import Image from "next/image";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const cities = await getCities();

  const citiesT = await Promise.all(
    cities.map(async (city, index, array) => {
      let image = await getBackEndAsset(city.photo);
      cities[index].photo = image;
    })
  );

  return {
    props: { auth, cities },
  };
};

const CitiesList = ({ auth, cities }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Villes</h1>
          <Link href="cities/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        {cities.length !== 0 ? (
          cities.map((city) => {
            return (
              <div key={city.slug}>
                <Link href={`/dashboard/admin/cities/edit/${city.slug}`}>
                  <a className="flex space-x-4 items-center transition hover:bg-gray-100 hover:cursor-pointer group">
                    <Image
                      src={city.photo}
                      width="200"
                      height={100}
                      objectFit="cover"
                      alt={city.name}
                    />
                    <div className="flex w-full items-center justify-between p-3">
                      <div>
                        <p>{city.name}</p>
                        <p className="font-mono text-xs uppercase text-gray-500  ">
                          {city.slug}
                        </p>
                      </div>
                      <div>
                        <p className="items-center text-shamrock hidden group-hover:flex">
                          Modifier <BsChevronRight size={14} />
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })
        ) : (
          <div>
            <p>Aucune ville trouvée.</p>
          </div>
        )}
      </div>
    </DashboardUi>
  );
};

export default CitiesList;
