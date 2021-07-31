import DashboardNavigation from "../../components/DashboardNavigation";
import DashboardSideNav from "../../components/DashboardSideNav";
import DashboardModal from "../../components/DashboardModal";
import DashboardOperationCard from "../../components/DashboardOperationCard";
import Link from "next/link";
import { checkAuth } from "../../utils/ServerHelpers";

export const getServerSideProps = checkAuth;

export default function DashboardIndex({ userProfile }) {
  return (
    <div className="h-screen">
      <DashboardNavigation />

      <div
        className="grid grid-cols-12"
        style={{
          height: "calc(100% - 75px)",
        }}
      >
        <DashboardSideNav />
        <div className="col-span-10 shadow-lg grid grid-cols-6 p-12 gap-10">
          <div className="col-span-6 lg:col-span-4 flex flex-col gap-4">
            <h1 className="text-4xl">
              Bonjour{" "}
              <span className="text-shamrock">
                {userProfile.firstName
                  ? userProfile.firstName
                  : userProfile.email}
                ,
              </span>
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. {}
            </p>
            {[
              userProfile.firstName,
              userProfile.lastName,
              userProfile.email,
              userProfile.address,
              userProfile.mobilePhone,
              userProfile.gender,
              userProfile.landlinePhone,
              userProfile.birthdate,
            ].some((x) => x === null) ? (
              <DashboardModal
                content="Vous devez remplir vos informations"
                cta="Compléter"
                target="/dashboard/profile"
              />
            ) : (
              ""
            )}
            <DashboardModal
              content="Vous devez ajoutez des documents dans une opération"
              cta="Ajouter"
              target="/dashboard/operations"
            />
            <div className="flex flex-col mt-4 gap-2">
              <p className="text-sm text-gray-700 uppercase">Mes Opérations</p>
              <DashboardOperationCard
                operationID="123"
                state="awaitingDocuments"
              />
              <DashboardOperationCard
                operationID="123"
                state="awaitingEstimate"
              />
            </div>
          </div>
          <div className="col-span-6 lg:col-span-2 flex flex-row lg:flex-col gap-6">
            <div className="w-1/2 lg:w-full rounded border border-shamrock p-4 space-y-2">
              <h3 className="text-2xl">Parrainez un proche</h3>
              <p>
                Recommandez Booklinik à vos amis et recevez 100€ sur votre
                voyage. Vos amis profiteront aussi de 100€ sur leurs opérations.
              </p>
              <p className="w-full bg-shamrock text-white uppercase font-2xl text-center py-3 rounded">
                MAXM1002021
              </p>
              <Link href="#" className="w-full">
                <a className="w-full block text-center text-gray-700 text-xs hover:underline">
                  Ajouter un code de parrainage
                </a>
              </Link>
            </div>
            <div className="w-1/2 lg:w-full rounded border border-gray-600 p-4 space-y-2">
              <h3 className="text-2xl">Assistance Booklinik</h3>
              <p>
                Nous sommes à votre disposition si vous avez la moindre
                question.
              </p>
              <p className="text-xs uppercase text-gray-700"></p>
              <input
                type="textarea"
                className="h-16 border-b border-gray-600 bg-gray-100 p-3 w-full"
                placeholder="J&lsquo;ai une question à propos de..."
              />
              <button className="w-full text-bali transition hover:underline hover:text-shamrock ">
                Envoyer mon message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
