import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardSideNavItem from "./DashboardSideNavItem";
import firebase from "firebase/clientApp";
import {
  FaUserCog,
  FaChartPie,
  FaChartArea,
  FaPlus,
  FaUserAlt,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";

const DashboardSideNav = ({ userProfile, token, isSideNavOpen }) => {
  const router = useRouter();
  const isAdmin = userProfile.role === "admin" ? true : false;
  const isSales =
    userProfile.role === "admin" || userProfile.role === "sales" ? true : false;
  const { signOut } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [expand, setExpand] = useState({
    operations: false,
    sales: false,
    admin: false,
    profile: false,
    security: false,
  });

  const handleExpand = (menu) => {
    setExpand({ ...expand, [menu]: !expand[menu] });
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const entries = [];
      const allEntries = [];
      const clients = [];

      await firebase
        .firestore()
        .collection("bookings")
        .where("user", "==", token.uid)
        .get()
        .then((item) => {
          return item.forEach((doc) =>
            entries.push({
              id: doc.id,
            })
          );
        });

      setBookings(entries);

      await firebase
        .firestore()
        .collection("users")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            clients.push({ ...doc.data(), id: doc.id });
          });
        });

      setUsers(clients);

      await firebase
        .firestore()
        .collection("bookings")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            allEntries.push(doc.data());
          });
        });

      setAllBookings(allEntries);
    };

    asyncFunc();

    setExpand({
      ...expand,
      [router.pathname.split("/")[2]]: !expand[router.pathname.split("/")[2]],
    });
  }, []);

  return (
    <div
      className={`z-30 h-full lg:col-span-2 absolute lg:sticky 
    bg-white lg:bg-transparent shadow lg:shadow-none border-r lg:border-0 border-gray-400 w-3/5 lg:w-full
    ${isSideNavOpen ? "block" : "hidden lg:flex"}
    `}
    >
      <div className="flex flex-col px-6 lg:px-5 py-8 h-full shadow bg-sidebar w-full">
        <div className="space-y-5 mb-5">
          <div className="flex items-center group">
            <FaChartPie
              className={`mr-3 mb-1 block group-hover:opacity-50 text-shamrock  ${
                router.pathname == "/dashboard" && "text-shamrock"
              }`}
              size="16"
            />

            <DashboardSideNavItem title="Dashboard" target="/dashboard" />
          </div>
          <div className="flex flex-col">
            <div
              className="flex items-center mb-2 justify-between cursor-pointer"
              onClick={() => handleExpand("operations")}
            >
              <div className="flex items-center">
                <FaPlus className="mr-3 mb-1 block text-shamrock" size="16" />
                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Opérations
                </p>
              </div>
              <FaChevronDown
                className={`${expand.operations && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden transition-all duration-300"
              style={{
                maxHeight: `${expand.operations ? "50rem" : "0"}`,
              }}
            >
              <DashboardSideNavItem
                title={`Mes opérations (${bookings.length})`}
                target="/dashboard/operations"
              />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {isSales && (
            <div className="flex flex-col">
              <div
                className="flex items-center mb-2 cursor-pointer justify-between"
                onClick={() => handleExpand("sales")}
              >
                <div className="flex items-center">
                  <FaChartArea
                    size="16"
                    className="mr-3 mb-1 block text-shamrock"
                  />
                  <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2">
                    Clients / Réservations
                  </p>
                </div>
                <FaChevronDown
                  className={`${expand.sales && "-rotate-180"} transition`}
                />
              </div>
              <div
                className="pl-8 h-100 overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: `${expand.sales ? "50rem" : "0"}`,
                }}
              >
                <DashboardSideNavItem
                  title={`Clients (${users.length})`}
                  target="/dashboard/sales/clients"
                />
                <DashboardSideNavItem
                  title={`Réservations (${allBookings.length})`}
                  target="/dashboard/sales/bookings"
                />
              </div>
            </div>
          )}
          {isAdmin && (
            <div className="flex flex-col">
              <div
                className="flex items-center mb-2 justify-between cursor-pointer"
                onClick={() => handleExpand("admin")}
              >
                <div className="flex items-center">
                  <FaUserCog
                    className="mr-3 mb-1 block text-shamrock"
                    size="16"
                  />

                  <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                    Admin
                  </p>
                </div>
                <FaChevronDown
                  className={`${expand.admin && "-rotate-180"} transition`}
                />
              </div>
              <div
                className="pl-8 h-100 overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: `${expand.admin ? "50rem" : "0"}`,
                }}
              >
                <DashboardSideNavItem
                  title="Questions médicales"
                  target="/dashboard/admin/medical-questions"
                />
                <DashboardSideNavItem
                  title="Cat. opérations"
                  target="/dashboard/admin/operations"
                />
                <DashboardSideNavItem
                  title="Opérations"
                  target="/dashboard/admin/surgeries"
                />
                <DashboardSideNavItem
                  title="Pays"
                  target="/dashboard/admin/countries"
                />
                <DashboardSideNavItem
                  title="Villes"
                  target="/dashboard/admin/cities"
                />
                <DashboardSideNavItem
                  title="Hôtels"
                  target="/dashboard/admin/hotels"
                />
                <DashboardSideNavItem
                  title="Options d'hôtel"
                  target="/dashboard/admin/options"
                />
                <DashboardSideNavItem
                  title="Chambres"
                  target="/dashboard/admin/rooms"
                />
                <DashboardSideNavItem
                  title="Cliniques"
                  target="/dashboard/admin/clinics"
                />
                <DashboardSideNavItem
                  title="Offres"
                  target="/dashboard/admin/offers"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <div
              className="flex items-center mb-2 justify-between cursor-pointer"
              onClick={() => handleExpand("profile")}
            >
              <div className="flex items-center">
                <FaUserAlt
                  className="mr-3 mb-1 block text-shamrock"
                  size="14"
                />

                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Mon profil
                </p>
              </div>
              <FaChevronDown
                className={`${expand.profile && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden transition-all duration-300"
              style={{
                maxHeight: `${expand.profile ? "50rem" : "0"}`,
              }}
            >
              <DashboardSideNavItem
                title="Informations personnelles"
                target="/dashboard/profile"
              />
              <DashboardSideNavItem
                title="Informations médicales"
                target="/dashboard/medical"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div
              className="flex items-center mb-2 justify-between cursor-pointer"
              onClick={() => handleExpand("security")}
            >
              <div className="flex items-center">
                <FaCog className="mr-3 mb-1 block text-shamrock" size="15" />
                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Mon compte
                </p>
              </div>
              <FaChevronDown
                className={`${expand.security && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden transition-all duration-300"
              style={{
                maxHeight: `${expand.security ? "50rem" : "0"}`,
              }}
            >
              <DashboardSideNavItem
                title="Mot de passe et email"
                target="/dashboard/security"
              />
              <DashboardSideNavItem
                title="Code de parrainage"
                target="/dashboard/parrainage"
              />
              <a
                onClick={signOut}
                className="text-gray-500 mt-2 block cursor-pointer hover:underline"
              >
                Se déconnecter
              </a>
            </div>
            <div className="flex items-center">
              <Link href="/offres" passHref={true}>
                <p className="text-sm uppercase  tracking-wide  px-6 font-bold  mb-0 mt-6 cursor-pointer text-shamrock">
                  Offres Spéciales
                </p>
              </Link>
            </div>
            <div className="flex items-center">
              <Link href="/book" passHref={true}>
                <button className="text-white bg-shamrock rounded px-6 py-3 my-6 transition border border-shamrock hover:text-shamrock hover:bg-white">
                  Estimation - Réservation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNav;
