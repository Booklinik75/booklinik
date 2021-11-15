import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getClinics,
  getBackEndAsset,
  getCities,
} from "../../../../utils/ServerHelpers";
import Link from "next/link";
import Image from "next/image";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const cities = await getCities();
  const clinics = await getClinics();

  const resolveHotels = await Promise.all(
    clinics.map(async (clinic, index, array) => {
      let image = await getBackEndAsset(clinic.photo);
      clinics[index].photo = image;
    })
  );

  return {
    props: { auth, cities, clinics },
  };
};

const RoomsList = ({ auth, cities, clinics }) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Cliniques</h1>
          <Link href="clinics/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        <div className="space-y-6">
          {cities.map((city) => {
            return (
              <div key={city.slug} className="space-y-3">
                <h2 className="text-xl mb-2">{city.name}</h2>
                <div className="grid grid-cols-12 gap-4">
                  {clinics.map((clinic) => {
                    if (clinic.city === city.slug) {
                      return (
                        <div
                          key={clinic.slug}
                          className="col-span-12 md:col-span-6 lg:col-span-3"
                        >
                          <Link
                            href={`/dashboard/admin/clinics/edit/${clinic.slug}`}
                          >
                            <a className="w-full lg:max-w-max">
                              <div
                                key={clinic.slug}
                                className="rounded shadow bg-gray-50 transition hover:bg-gray-100 hover:shadow-lg hover:cursor-pointer"
                              >
                                <Image
                                  src={clinic.photo}
                                  alt={clinic.name}
                                  width={500}
                                  height={250}
                                  objectFit="cover"
                                  className="rounded-t"
                                />
                                <div className="p-3 space-y-2">
                                  <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                                    {clinic.slug}
                                  </p>
                                  <div className="gap-1">
                                    <p>{clinic.name}</p>
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
