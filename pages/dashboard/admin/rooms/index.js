import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getHotels,
  getBackEndAsset,
  getRooms,
} from "../../../../utils/ServerHelpers";
import Link from "next/link";
import Image from "next/image";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const hotels = await getHotels();
  const rooms = await getRooms();

  const resolveHotels = await Promise.all(
    hotels.map(async (hotel, index, array) => {
      let image = await getBackEndAsset(hotel.photo);
      hotels[index].photo = image;
    })
  );
  return {
    props: { auth, hotels, rooms },
  };
};

const RoomsList = ({ auth, hotels, rooms }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Chambres</h1>
          <Link href="rooms/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        <div className="space-y-6">
          {hotels.map((hotel) => {
            return (
              <div key={hotel.slug} className="space-y-3">
                <h2 className="text-xl mb-2">{hotel.name}</h2>
                <div className="grid grid-cols-12 gap-4">
                  {rooms.map((room) => {
                    if (room.hotel === hotel.slug) {
                      return (
                        <div
                          key={room.slug}
                          className="col-span-12 md:col-span-6 lg:col-span-3"
                        >
                          <Link
                            href={`/dashboard/admin/rooms/edit/${room.slug}`}
                          >
                            <a className="w-full lg:max-w-max">
                              <div
                                key={room.slug}
                                className="rounded shadow bg-gray-50 transition hover:bg-gray-100 hover:shadow-lg hover:cursor-pointer"
                              >
                                <Image
                                  src={room.photos[0]}
                                  alt={room.name}
                                  width={500}
                                  height={250}
                                  objectFit="cover"
                                  className="rounded-t"
                                />
                                <div className="p-3 space-y-2">
                                  <div className="flex flex-row items-center justify-between">
                                    <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                                      {room.slug}
                                    </p>
                                    <p className="bg-bali text-white px-2 py-1 rounded">
                                      {room.extraPrice} €
                                    </p>
                                  </div>
                                  <div className="gap-1">
                                    <p>{room.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {room.photos.length} photo
                                      {room.photos.length > 0 ? "s" : ""}
                                    </p>
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

export default RoomsList;
