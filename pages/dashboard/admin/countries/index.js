import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getCountries,
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

  const countries = await getCountries();

  const dada = await Promise.all(
    countries.map(async (country, index, array) => {
      let image = await getBackEndAsset(country.photo);
      countries[index].photo = image;
    })
  );

  return {
    props: { auth, countries },
  };
};

const CountriesList = ({ auth, countries }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Pays</h1>
          <Link href="countries/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        {countries.length !== 0 ? (
          countries.map((country) => {
            return (
              <div key={country.slug}>
                <Link href={`/dashboard/admin/countries/edit/${country.slug}`}>
                  <a className="flex space-x-4 items-center transition hover:bg-gray-100 hover:cursor-pointer group">
                    <Image
                      src={country.photo}
                      width="200"
                      height={100}
                      objectFit="cover"
                      alt={country.name}
                    />
                    <div className="flex w-full items-center justify-between p-3">
                      <div>
                        <p>{country.name}</p>
                        <p className="font-mono text-xs uppercase text-gray-500  ">
                          {country.slug}
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
            <p>Aucun pays trouvé.</p>
          </div>
        )}
      </div>
    </DashboardUi>
  );
};

export default CountriesList;
