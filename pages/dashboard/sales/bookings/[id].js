import DashboardUi from "components/DashboardUi";
import { useEffect, useState } from "react";
import { checkAuth } from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import JSONPretty from "react-json-pretty";
import Dropdown from "react-dropdown";
import DashboardButton from "Components/DashboardButton";
import slugify from "slugify";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import DashboardInput from "components/DashboardInput";
import { FaEye, FaPlus } from "react-icons/fa";
import EditOperations from "components/editComponents/EditOperations";
import EditTravellers from "components/editComponents/EditTravellers";
import EditCity from "components/editComponents/EditCity";
import EditHotels from "components/editComponents/EditHotels";
import EditRooms from "components/editComponents/EditRooms";
import EditOptions from "components/editComponents/EditOptions";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const operationCategories = [];
  await firebase
    .firestore()
    .collection("surgeries")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        operationCategories.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch((err) => {});

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

  const cities = [];
  await firebase
    .firestore()
    .collection("cities")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        cities.push(doc.data());
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
      operationCategories,
      cities,
      currentOperation: currentOperation[0],
    },
  };
};

const Booking = ({
  booking,
  cities,
  auth,
  currentOperation,
  operationCategories,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState("idle");
  const [openPopupData, setOpenPopupData] = useState(false);
  const [operations, setOperations] = useState([
    { id: "1", surgeryName: booking.surgeryName },
  ]);
  const [optionLists, setOptionLists] = useState([]);
  const [options, setOptions] = useState([...booking.options]);
  const [startDate, setStartDate] = useState(booking.startDate);
  const [endDate, setEndDate] = useState(booking.endDate);
  const [voyageurs, setVoyageurs] = useState({
    adults: booking.extraTravellers + 1,
    babies: booking.extraBabies,
    childs: booking.extraChilds,
  });
  const [city, setCity] = useState(booking.city);
  const [hotel, setHotel] = useState({
    name: booking.hotelName,
    slug: booking.hotel,
  });
  const [roomName, setRoomName] = useState(booking.roomName);

  const handleEditable = (e) => {
    // get all input to edit
    const inputs = document.querySelectorAll(
      ".border.p-2.px-4.rounded.align-middle.mx-2"
    );
    if (e.target.id === "inputTravellers") {
      setOpenEditVoyageurs((openEditVoyageurs) => !openEditVoyageurs);
    } else {
      inputs.forEach((input) => {
        if (input.id === e.target.id && e.target.id !== "inputTravellers") {
          input.setAttribute("contenteditable", "true");
          input.classList.remove("border-shamrock");
          input.classList.remove("cursor-pointer");
          input.classList.add("border-black");
          input.classList.add("cursor-text");
        }
      });
    }
  };
  const handleAddNewSurgery = () => {
    setOperations([
      ...operations,
      {
        id: `${operations.length + 1}`,
        surgeryName: "enter a new surgery",
        cities: [],
      },
    ]);
  };
  const handleAddNewOptions = () => {
    setOptions([
      ...options,
      {
        isChecked: false,
        name: "enter a new option",
        price: 95,
      },
    ]);
  };

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

  // ,aybe use like this?
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

  useEffect(() => {
    document.onclick = (e) => {
      if (openPopupData) {
        if (e.target.closest("#raw-data") === null) {
          setOpenPopupData(false);
        }
      }
    };

    // options lists
    const getOperations = async () => {
      const options = [];
      await firebase
        .firestore()
        .collection("options")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.data()[0].forEach((data) => {
              options.push(data);
            });
          });
        })
        .catch((err) => {});
      setOptionLists(options);
    };
    getOperations();

    // first I tried to get All the cities that first booking surgery have
    const getSurgeryCity = async () => {
      await firebase
        .firestore()
        .collection("surgeries")
        .where("name", "==", booking.surgeryName)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            setOperations((operations) => {
              if (operations[0].surgeryName === booking.surgeryName) {
                const isExists = operations.find(
                  (operation) => operation.surgeryName === doc.data().name
                );
                if (isExists) {
                  return operations.map((operation) => {
                    return operation.surgeryName === doc.data().name
                      ? { ...operation, cities: doc.data().cities }
                      : operation;
                  });
                }
              }
              return operations;
            });
          });
        })
        .catch((err) => {});
    };
    getSurgeryCity();
  }, [openPopupData, booking]);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6">
        <div className="mb-4">
          <h1 className="text-4xl flex">
            <span className="font-bold">Réservation&nbsp;:&nbsp;</span>
            {booking.id}
          </h1>
          <p className="flex items-center gap-5">
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
            <p className="text-sm text-gray-800 font-bold uppercase">Données</p>
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
                        booking.total !== booking.alternativeTotal &&
                        "line-through"
                      }`}
                    >
                      {booking.total}€
                    </span>
                    {booking.total !== booking.alternativeTotal && (
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
            <p className="text-sm font-bold text-gray-800 uppercase">
              Raw Data
            </p>
            <div className="h-96 overflow-scroll w-full bg-white border-blue-500 p-3 rounded">
              <JSONPretty id="json-pretty" data={booking} />
            </div>
          </div>

          <div className="col-span-6 my-10 ">
            <p className="text-sm font-bold text-gray-800 uppercase mb-5">
              Modifier Les Donnes
            </p>
            <div className="bg-white border-gray-200 p-5 rounded border">
              <div className="flex items-center whitespace-nowrap mb-5 edit-operations">
                Vous souhaitez réaliser une
                {operations?.map((operation, i) => (
                  <EditOperations
                    operation={operation}
                    key={i}
                    id={operation.id}
                    operations={operations}
                    setOperations={setOperations}
                    operationCategories={operationCategories}
                  />
                ))}
                <span
                  className="bg-shamrock p-1 rounded-full cursor-pointer"
                  onClick={handleAddNewSurgery}
                >
                  <FaPlus color="white" size="10" />
                </span>
              </div>
              <div className="flex items-center whitespace-nowrap mb-5">
                Votre voyage s&apos;étedra du
                <span
                  id="inputStartDate"
                  className="border p-2 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer w-max"
                >
                  <ReactDatePicker
                    selected={new Date(startDate)}
                    onChange={(date) => setStartDate(date)}
                  />
                </span>
                au
                <span
                  id="inputEndDate"
                  className="border p-2 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer w-max"
                >
                  <ReactDatePicker
                    selected={new Date(endDate)}
                    onChange={(date) => setEndDate(date)}
                  />
                </span>
                pour une dureé de 4 jours.
              </div>
              <div
                className="flex items-center whitespace-nowrap mb-5"
                id="edit-voyageurs"
              >
                Vous serez accompagné-e par
                <EditTravellers
                  voyageurs={voyageurs}
                  setVoyageurs={setVoyageurs}
                />
                de votre choix pour découvrir
                <EditCity
                  city={city}
                  operations={operations}
                  cities={cities}
                  setCity={setCity}
                />
              </div>
              <div className="flex items-center whitespace-nowrap mt-7 mb-7">
                L&apos;hôtel dans lequel vous résiderez est au
                <EditHotels hotel={hotel} setHotel={setHotel} city={city} />
                {"("}trés bon choiz{")"} et vous logerez en
                <EditRooms
                  roomName={roomName}
                  setRoomName={setRoomName}
                  hotel={hotel}
                />
              </div>
              <div className="flex items-center whitespace-nowrap mb-5">
                Vous avez selectuineé les options suivantes :
                {options.map((option, i) => (
                  <EditOptions
                    key={i}
                    id={i + 1}
                    option={option}
                    options={options}
                    optionLists={optionLists}
                    setOptions={setOptions}
                  />
                ))}
                {optionLists.length - booking.options.length !==
                  options.length && (
                  <span
                    className="bg-shamrock p-1 rounded-full cursor-pointer"
                    onClick={handleAddNewOptions}
                  >
                    <FaPlus color="white" size="10" />
                  </span>
                )}
              </div>
              <div className="flex items-center mt-14">
                Le prix tout compris de votre voyage sur-mesure est de{" "}
                <span className="border text-white whitespace-nowrap block p-2 px-4 border-shamrock bg-shamrock rounded  mx-3">
                  {booking.total}€
                </span>
              </div>
              <button className="min-w-max transition px-5 py-3 mt-10 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock group hover:bg-white">
                Mettre à jour
              </button>
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
