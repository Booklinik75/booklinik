import { useState, useEffect } from "react";
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

const DashboardSideNav = ({ userProfile, token }) => {
  const router = useRouter();
  const isAdmin = userProfile.role === "admin" ? true : false;
  const isSales =
    userProfile.role === "admin" || userProfile.role === "sales" ? true : false;
  const { signOut } = useAuth();

  const [bookings, setBookings] = useState([]);
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
    };

    asyncFunc();

    setExpand({
      ...expand,
      [router.pathname.split("/")[2]]: !expand[router.pathname.split("/")[2]],
    });
  }, []);

  return (
    <div
      className="z-10 h-full col-span-2 sticky w-full"
      style={{ zIndex: "1" }}
    >
      <div
        className="flex flex-col px-6 py-10 h-full shadow"
        // style={{ background: "#F5FFFB", boxShadow: "2px 3px 5px #0001" }}
        style={{ background: "rgb(251 255 253)" }}
      >
        <div className="space-y-5 mb-4">
          <div className="flex items-center sideNav__dashboard">
            <FaChartPie
              className={`mr-3 mb-1 block ${
                router.pathname == "/dashboard" && "opacity-50"
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
                <FaPlus className="mr-3 mb-1 block" size="16" />
                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Opérations
                </p>
              </div>
              <FaChevronDown
                className={`${expand.operations && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden"
              style={{
                maxHeight: `${expand.operations ? "50rem" : "0"}`,
                transition: "max-height 0.5s",
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
                  <FaChartArea size="16" className="mr-3 mb-1 block" />
                  <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2">
                    Sales
                  </p>
                </div>
                <FaChevronDown
                  className={`${expand.sales && "-rotate-180"} transition`}
                />
              </div>
              <div
                className="pl-8 h-100 overflow-hidden"
                style={{
                  maxHeight: `${expand.sales ? "50rem" : "0"}`,
                  transition: "max-height 0.5s",
                }}
              >
                <DashboardSideNavItem
                  title="Clients"
                  target="/dashboard/sales/clients"
                />
                <DashboardSideNavItem
                  title="Réservations"
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
                  <FaUserCog className="mr-3 mb-1 block" size="16" />

                  <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                    Admin
                  </p>
                </div>
                <FaChevronDown
                  className={`${expand.admin && "-rotate-180"} transition`}
                />
              </div>
              <div
                className="pl-8 h-100 overflow-hidden"
                style={{
                  maxHeight: `${expand.admin ? "50rem" : "0"}`,
                  transition: "max-height 0.5s",
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
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <div
              className="flex items-center mb-2 justify-between cursor-pointer"
              onClick={() => handleExpand("profile")}
            >
              <div className="flex items-center">
                <FaUserAlt className="mr-3 mb-1 block" size="14" />

                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Mon profil
                </p>
              </div>
              <FaChevronDown
                className={`${expand.profile && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden"
              style={{
                maxHeight: `${expand.profile ? "50rem" : "0"}`,
                transition: "max-height 0.5s",
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
                <FaCog className="mr-3 mb-1 block" size="15" />
                <p className="text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer">
                  Mon compte
                </p>
              </div>
              <FaChevronDown
                className={`${expand.security && "-rotate-180"} transition`}
              />
            </div>
            <div
              className="pl-8 h-100 overflow-hidden"
              style={{
                maxHeight: `${expand.security ? "50rem" : "0"}`,
                transition: "max-height 0.5s",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNav;
