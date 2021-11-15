import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getHotels,
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

  const hotels = await getHotels();

  const dada = await Promise.all(
    hotels.map(async (hotel, index, array) => {
      let image = await getBackEndAsset(hotel.photo);
      hotels[index].photo = image;
    })
  );

  return {
    props: { auth, hotels },
  };
};

const CountriesList = ({ auth, hotels }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Hotels</h1>
          <Link href="hotels/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        {hotels.length !== 0 ? (
          hotels.map((hotel) => {
            return (
              <div key={hotel.slug}>
                <Link href={`/dashboard/admin/hotels/edit/${hotel.slug}`}>
                  <a className="flex space-x-4 items-center transition hover:bg-gray-100 hover:cursor-pointer group">
                    <Image
                      src={hotel.photo}
                      width="200"
                      height={100}
                      objectFit="cover"
                      alt={hotel.name}
                    />
                    <div className="flex w-full items-center justify-between p-3">
                      <div>
                        <p>{hotel.name}</p>
                        <p className="font-mono text-xs uppercase text-gray-500  ">
                          {hotel.slug} — {hotel.city}
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
            <p>Aucun hotel trouvé.</p>
          </div>
        )}
      </div>
    </DashboardUi>
  );
};

export default CountriesList;
