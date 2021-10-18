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
    .catch((err) => console.log(err));

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

  const [estimatePrice, setEstimatePrice] = useState(booking.total);
  // const [estimateFile, setEstimateFile] = useState("");

  const updateStatus = () => {
    setLoading("loading");

    console.log(status.value);
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

    if (estimatePrice !== booking.total) {
      firebase
        .firestore()
        .collection("bookings")
        .doc(booking.id)
        .update({ alternativeTotal: Number(estimatePrice) })
        .then(() => {
          fetch("/api/mail", {
            method: "post",
            body: JSON.stringify({
              recipient: booking.customer.email,
              templateId: "d-4e1bda2d9da349d1987a1a8c69238484",
              dynamicTemplateData: {
                payment_link: `https://booklinik.com/checkout/${booking.id}`,
              },
            }),
          }).then(() => {
            definedStatusUpdate("awaitingPayment");
          });
        });
    }
  };

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
                    {booking.picturesSet?.[slugify(pictureSet.title)].map(
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
