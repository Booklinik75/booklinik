import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardSideNavItem from "./DashboardSideNavItem";

const DashboardSideNav = ({ isAdmin }) => {
  const router = useRouter();

  const { signOut } = useAuth();

  return (
    <div className="z-10 h-full col-span-2 sticky w-full">
      <div
        className="flex flex-col px-6 py-10 h-full justify-between"
        style={{ maxHeight: "95vh" }}
      >
        <div className="space-y-5">
          <DashboardSideNavItem title="Dashboard" target="/dashboard" />
          <div className="flex flex-col">
            <p className="text-sm text-gray-700 uppercase">Opérations</p>
            <DashboardSideNavItem
              title="Mes opérations (1)"
              target="/dashboard/operations"
            />

            <DashboardSideNavItem
              title="Sauvegardés (2)"
              target="/dashboard/saved"
            />
          </div>
        </div>
        <div className="space-y-5">
          {isAdmin ? (
            <div className="flex flex-col">
              <p className="text-sm text-gray-700 uppercase">Admin</p>
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
          ) : (
            ""
          )}
          <div className="flex flex-col">
            <p className="text-sm text-gray-700 uppercase">Mon profil</p>
            <DashboardSideNavItem
              title="Informations personnelles"
              target="/dashboard/profile"
            />
            <DashboardSideNavItem
              title="Informations médicales"
              target="/dashboard/medical"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-700 uppercase">Mon compte</p>
            <DashboardSideNavItem
              title="Mot de passe et email"
              target="/dashboard/security"
              disabled={true}
            />
            <DashboardSideNavItem
              title="Code de parrainage"
              target="/dashboard/parrainage"
              disabled={true}
            />
          </div>
          <a
            onClick={signOut}
            className="text-gray-500 cursor-pointer hover:underline"
          >
            Se déconnecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNav;
