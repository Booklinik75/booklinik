import DashboardUi from "components/DashboardUi";
import { useState } from "react";
import { checkAuth } from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import JSONPretty from "react-json-pretty";
import Dropdown from "react-dropdown";
import DashboardButton from "Components/DashboardButton";
import slugify from "slugify";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import DashboardInput from "Components/DashboardInput";
import { FaEye } from "react-icons/fa";

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

  const currentOperation = [];
  await firebase
    .firestore()
    .collection("surgeries")
    .where("slug", "==", booking.surgery)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        currentOperation.push(doc.data());
      });
    })
    .catch((err) => {});

  if (auth.props.userProfile.role === "admin") {
    currentOperation[0].requiredPictures.map((set, index) => {
      let slug = slugify(set.title);

      if (booking.picturesSet?.[slug]) {
        currentOperation[0].requiredPictures[index] = {
          ...currentOperation[0].requiredPictures[index],
          done: true,
        };
      } else {
        currentOperation[0].requiredPictures[index] = {
          ...currentOperation[0].requiredPictures[index],
          done: false,
        };
      }
    });
  }

  return {
    props: {
      auth,
      booking,
      currentOperation: currentOperation[0],
    },
  };
};

const Booking = ({ booking, auth, currentOperation }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState("idle");

  const statusOptions = [
    { value: "awaitingDocuments", label: "En attente de photos" },
    { value: "examining", label: "En cours d'examen" },
    { value: "awaitingEstimate", label: "En attente de devis" },
    { value: "awaitingPayment", label: "En attente de règlement" },
    { value: "validated", label: "Validé" },
    { value: "cancelled", label: "Annulé" },
  ];

  const currentOption = statusOptions.filter(
    (option) => option.value === booking.status
  )[0];

  const [status, setStatus] = useState(currentOption);

  const [estimatePrice, setEstimatePrice] = useState(booking.total);

  const [useReferalBalance, setUseReferalBalance] = useState(false);
  // const [estimateFile, setEstimateFile] = useState("");

  const updateStatus = () => {
    setLoading("loading");

    firebase
      .firestore()
      .collection("bookings")
      .doc(booking.id)
      .update({ status: status.value })
      .then(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.reload(window.location.pathname);
      });
  };

  const definedStatusUpdate = (status) => {
    setLoading("loading");
    firebase
      .firestore()
      .collection("bookings")
      .doc(booking.id)
      .update({ status: status })
      .then(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.reload(window.location.pathname);
      });
  };

  // const toBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

  const handleEstimate = (e) => {
    e.preventDefault();

    setStatus("awaitingPayment");

    if (estimatePrice !== booking.total || useReferalBalance) {
      let newPrice = estimatePrice;

      if (useReferalBalance) {
        newPrice = newPrice - booking.customer.referalBalance;
      }

      firebase
        .firestore()
        .collection("bookings")
        .doc(booking.id)
        .update({ alternativeTotal: newPrice })
        .then(() => {
          fetch("/api/mail", {
            method: "post",
            body: JSON.stringify({
              recipient: booking.customer.email,
              templateId: "d-4e1bda2d9da349d1987a1a8c69238484",
              dynamicTemplateData: {
                payment_link: `https://${process.env.ABSOLUTE_URL_ORIGIN}/checkout/${booking.id}`,
              },
            }),
          }).then(() => {
            definedStatusUpdate("awaitingPayment");
          });

          firebase
            .firestore()
            .collection("users")
            .doc(booking.customer.id)
            .update({ referalBalance: 0 });
        });
    }
  };

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6">
        <div className="mb-4">
          <h1 className="text-4xl flex">
            <span className="font-bold">Réservation&nbsp;:&nbsp;</span>
            {booking.id}
          </h1>
          <p>
            {/* See client's page */}
            <Link href={`/dashboard/sales/clients/${booking.customer.id}`}>
              <a className="text-blue-500 flex gap-1 items-center">
                <FaEye /> Voir la fiche client
              </a>
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-3 space-y-2">
            <p className="text-sm text-gray-800 uppercase">Données</p>
            <div className="h-96 rounded w-full p-4 overflow-y-auto bg-gray-50 border border-gray-500 border-dashed flex">
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm text-gray-800 uppercase">Dates</p>
                  <p className="text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()}
                    &nbsp;-&nbsp;
                    {new Date(booking.endDate).toLocaleDateString()}
                    {booking.endDate > new Date().getTime() && (
                      <span className="text-red-500">&nbsp;(en cours)</span>
                    )}
                    {booking.totalSelectedNights > 0 && (
                      <span className="text-green-500">
                        &nbsp;(
                        {booking.totalSelectedNights}
                        {booking.totalSelectedNights > 1 ? " jours" : " jour"})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 uppercase font-medium">
                    Opération
                  </p>
                  <p className="text-gray-600">{booking.surgery}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 uppercase font-medium">
                    Prix
                  </p>
                  <p className="text-gray-600 flex gap-1">
                    <span
                      className={`${
                        booking.alternativeTotal &&
                        booking.total !== booking.alternativeTotal &&
                        "line-through"
                      }`}
                    >
                      {booking.total}€
                    </span>
                    {booking.alternativeTotal &&
                      booking.total !== booking.alternativeTotal && (
                        <span className="text-green-500">
                          (devis&nbsp;:&nbsp;{booking.alternativeTotal}€)
                        </span>
                      )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 uppercase font-medium">
                    Status
                  </p>
                  <p className="text-gray-600">{currentOption.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 uppercase font-medium">
                    Destination
                  </p>
                  <p className="text-gray-600">
                    {booking.hotelName}, {booking.roomName}
                    <br />@{" "}
                    <span className="first-letter:uppercase">
                      {booking.city}
                    </span>
                  </p>
                </div>
                {booking.options && (
                  <div>
                    <p className="text-sm text-gray-800 uppercase font-medium">
                      Options
                    </p>
                    <p className="text-gray-600">
                      {booking.options.map(
                        (option) =>
                          option.isChecked &&
                          `${option.name} (+${option.price}€)`
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-800 uppercase font-medium">
                    Voyageurs
                  </p>
                  <p className="text-gray-600">
                    {booking.extraTravellers + 1} adulte(s),{" "}
                    {booking.extraChilds || "0"} enfant(s),{" "}
                    {booking.extraBabies || "0"} bébé(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 space-y-2">
            <p className="text-sm text-gray-800 uppercase">Raw data</p>
            <div className="h-96 overflow-y-scroll w-full bg-blue-50 border-blue-500 p-3 rounded">
              <JSONPretty id="json-pretty" data={booking} />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2">
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
                onClick={updateStatus}
                className="text-center"
                disabled={status.value === booking.status}
                status={isLoading}
              />
            </div>
          </div>
          {auth.props.userProfile.role !== "role" && (
            <div className="col-span-2">
              <div className="border rounded p-3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-2xl">Photos médicales</p>
                  <p className="text-xs text-white px-2 py-1 uppercase rounded bg-shamrock">
                    Admin
                  </p>
                </div>
                {currentOperation.requiredPictures.map((pictureSet) => (
                  <div className="flex flex-col mb-2" key={pictureSet.title}>
                    <p className="first-letter:capitalize font-bold">
                      {pictureSet.title}
                    </p>
                    {booking.picturesSet?.[slugify(pictureSet?.title)]?.map(
                      (link, index) => (
                        <Link key={index} href={link}>
                          <a className="hover:underline hover:text-shamrock hover:cursor-pointer flex flex-row items-center gap-2">
                            Photo {index + 1}{" "}
                            <FaExternalLinkAlt className="text-shamrock" />
                          </a>
                        </Link>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {booking.status === "awaitingEstimate" && (
            <div className="col-span-2">
              <div className="border rounded p-3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-2xl">Importer un devis</p>
                  <p className="text-xs text-white px-2 py-1 uppercase rounded bg-shamrock">
                    awaitingestimate
                  </p>
                </div>
                <p className="text-sm">
                  Cette action entrainera l&apos;envoi du devis par e-mail,
                  ainsi que d&apos;un lien pour procéder au règlement.
                </p>
                <p className="text-sm flex items-center items-center gap-2">
                  <span className="font-bold">Utiliser solde parrainage :</span>{" "}
                  {booking.customer.referalBalance || 0} €
                  <input
                    type="checkbox"
                    name="useReferalBalance"
                    checked={useReferalBalance}
                    onChange={(e) => {
                      setUseReferalBalance(e.target.checked);
                    }}
                  />
                </p>
                <form onSubmit={handleEstimate} className="flex flex-col gap-2">
                  <DashboardInput
                    type="number"
                    label="Prix"
                    value={estimatePrice}
                    onChange={(e) => {
                      setEstimatePrice(e.target.value);
                    }}
                    min={0}
                    required={true}
                    name="price"
                  />
                  {/* <DashboardInput
                    type="file"
                    label="Devis"
                    required={true}
                    name="estimate"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setEstimateFile(e.target.files[0]);
                      }
                    }}
                  /> */}
                  <DashboardButton defaultText="Envoyer" />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardUi>
  );
};

export default Booking;
