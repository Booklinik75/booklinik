import { useState } from "react";
import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import JSONPretty from "react-json-pretty";
import Dropdown from "react-dropdown";
import DashboardButton from "Components/DashboardButton";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) return auth;

  let booking = {};
  const { id } = ctx.query;

  await firebase
    .firestore()
    .collection("bookings")
    .doc(id)
    .get()
    .then(async (snapshot) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(snapshot.data().user)
        .get()
        .then((userData) => {
          booking = {
            ...snapshot.data(),
            id: snapshot.id,
            customer: { ...userData.data(), id: userData.id },
          };
        });
    });

  booking.startDate = new Date(booking.startDate.toDate()).toString();
  booking.endDate = new Date(booking.endDate.toDate()).toString();

  return {
    props: {
      auth,
      booking,
    },
  };
};

const Booking = ({ booking, auth }) => {
  const statusOptions = [
    { value: "examining", label: "En attente de photos" },
    { value: "awaitingEstimate", label: "En attente de devis" },
    { value: "awaitingPayment", label: "En attente de règlement" },
    { value: "validated", label: "Validé" },
    { value: "cancelled", label: "Annulé" },
  ];

  const currentOption = statusOptions.filter(
    (option) => option.value === booking.status
  )[0];

  const [status, setStatus] = useState(currentOption);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6">
        <h1 className="text-4xl flex mb-2">
          <span className="font-bold">Réservation&nbsp;:&nbsp;</span>
          {booking.id}
        </h1>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-3 space-y-2">
            <p className="text-sm text-gray-800 uppercase">Données</p>
            <div className="h-96 rounded w-full bg-gray-50 border border-gray-500 border-dashed flex items-center justify-center">
              <p className="text-7xl">🚧</p>
            </div>
          </div>
          <div className="col-span-3 space-y-2">
            <p className="text-sm text-gray-800 uppercase">Raw data</p>
            <div className="h-96 overflow-y-scroll w-full bg-blue-50 border-blue-500 p-3 rounded">
              <JSONPretty id="json-pretty" data={booking} />
            </div>
          </div>
          <div className="col-span-2">
            <div className="border rounded p-3 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-2xl">Statut</p>
                {status.value !== booking.status && (
                  <p className="text-xs text-gray-400">
                    Changements non-sauvegardés
                  </p>
                )}
              </div>
              <Dropdown
                options={statusOptions}
                placeholder="Select an option"
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
              />
              <DashboardButton
                defaultText="Sauvegarder"
                onClick={() => {
                  console.log(status);
                }}
                className="text-center"
                disabled={status.value === booking.status}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardUi>
  );
};

export default Booking;
