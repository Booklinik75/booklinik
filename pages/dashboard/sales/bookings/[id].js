import DashboardUi from "components/DashboardUi";
import { useEffect, useState } from "react";
import {
  checkAuth,
  getOperationCategories,
  getSurgeries,
} from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import JSONPretty from "react-json-pretty";
import Dropdown from "react-dropdown";
import DashboardButton from "Components/DashboardButton";
import slugify from "slugify";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import DashboardInput from "components/DashboardInput";
import { FaEye, FaPlus, FaCircleNotch } from "react-icons/fa";
import EditOperations from "components/editComponents/EditOperations";
import EditTravellers from "components/editComponents/EditTravellers";
import EditCity from "components/editComponents/EditCity";
import EditHotels from "components/editComponents/EditHotels";
import EditRooms from "components/editComponents/EditRooms";
import EditOptions from "components/editComponents/EditOptions";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import UpdateSuccessPopup from "Components/UpdateSuccessPopup";
import { set } from "date-fns";
import formatPrice from "utils/formatPrice";

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

  const operationCategories = await getOperationCategories();
  const allOperation = await getSurgeries();

  booking.startDate =
    typeof booking.startDate === "string"
      ? booking.startDate
      : new Date(booking.startDate.toDate()).toString();
  booking.endDate =
    typeof booking.endDate === "string"
      ? booking.endDate
      : new Date(booking.endDate.toDate()).toString();
  booking.created = booking.created
    ? typeof booking.created === "string"
      ? booking.created
      : new Date(booking?.created?.toDate()).toString()
    : "";

  const currentOperation = [];
  await firebase
    .firestore()
    .collection("surgeries")
    .where("slug", "==", booking.surgeries[0].surgery)
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
      allOperation,
      currentOperation: currentOperation[0],
    },
  };
};

const Booking = ({
  auth,
  booking,
  operationCategories,
  cities,
  allOperation,
  currentOperation,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState("idle");
  const [openPopupData, setOpenPopupData] = useState(false);
  const [operations, setOperations] = useState([...booking.surgeries]);
  // const [operation, setOperation] = useState({
  //   surgeryName: booking.surgeryName,
  //   surgery: booking.surgery,
  //   surgeryCategory: booking.surgeryCategory,
  //   surgeryPrice: booking.surgeryPrice,
  //   surgeryMinDays: booking.surgeryMinDays,
  // });
  const [options, setOptions] = useState(
    booking.options ? booking.options : []
  );
  const [startDate, setStartDate] = useState(booking.startDate);
  const [endDate, setEndDate] = useState(booking.endDate);
  const [voyageurs, setVoyageurs] = useState({
    adults: booking.extraTravellers + 1,
    babies: booking.extraBabies,
    childs: booking.extraChilds,
  });
  const [city, setCity] = useState(booking.city);
  const [hotel, setHotel] = useState({
    hotelId: booking.hotelId,
    hotelName: booking.hotelName,
    hotel: booking.hotel,
    hotelPrice: booking.hotelPrice,
    hotelRating: booking.hotelRating,
    hotelPhotoLink: booking.hotelPhotoLink,
  });
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState({
    roomName: booking.roomName,
    room: booking.room,
    roomPrice: booking.roomPrice,
    roomPhotoLink: booking.roomPhotoLink,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [totalSelectedNights, setTotalSelectedNights] = useState(
    booking.totalSelectedNights
  );
  const [minimumNights, setMinimumNights] = useState(booking.minimumNights);
  const [totalPrice, setTotalPrice] = useState(booking.total);

  const handleAddNewOptions = () => {
    setOptions([
      ...options,
      {
        isChecked: false,
        name: "Choisir une option",
        price: 0,
      },
    ]);
  };
  const handleAddNewOperations = () => {
    setOperations([
      ...operations,
      {
        surgeryName: "Choisir une opération",
        surgery: "",
        surgeryCategory: "",
        surgeryPrice: 0,
        surgeryMinDays: 0,
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

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const handleUpdate = () => {
    if (!loadingUpdate) {
      setLoadingUpdate(true);

      firebase
        .firestore()
        .collection("bookings")
        .doc(booking.id)
        .update({
          surgeries: operations,
          hotelId: hotel.hotelId,
          hotelName: hotel.hotelName,
          hotel: hotel.hotel,
          hotelPrice: hotel.hotelPrice,
          hotelRating: hotel.hotelRating,
          hotelPhotoLink: hotel.hotelPhotoLink,
          roomName: room.roomName,
          room: room.room,
          roomPrice: room.roomPrice,
          roomPhotoLink: room.roomPhotoLink,
          city,
          options,
          total: totalPrice,
          extraTravellers: voyageurs.adults - 1,
          extraBabies: voyageurs.babies,
          extraChilds: voyageurs.childs,
          endDate,
          startDate,
          minimumNights,
          totalExtraTravellersPrice:
            (voyageurs.childs + (voyageurs.adults - 1) + voyageurs.babies) *
            450,
          totalSelectedNights,
        })
        .then(() => {
          window.location.reload();
          setUpdateSuccess(true);
          setLoadingUpdate(false);
        })
        .catch((err) => {});
    }
  };

  const surgeriesName = () => {
    const surgeryNames = [];
    booking.surgeries.map((operation) =>
      surgeryNames.push(operation.surgeryName)
    );
    if (surgeryNames.length > 1) {
      return surgeryNames.join(", ");
    } else {
      return surgeryNames[0];
    }
  };

  const offerName = booking.offerName;

  useEffect(() => {
    // this is initialPrice before referal, we use this for referal
    const initialPrice =
      Number(booking.surgeries[0].surgeryPrice) +
      Number(booking.totalExtraTravellersPrice) +
      booking.options
        ?.map((option) => option.isChecked && Number(option.price))
        .reduce((a, b) => a + b, 0) +
      Number(booking.roomPrice) * Number(booking.totalSelectedNights);
    // this is new price

    const allTotalPrice =
      options
        .map((option) => option.isChecked && Number(option.price))
        .reduce((a, b) => a + b, 0) +
      operations.reduce((prev, curr) => prev + curr.surgeryPrice, 0) +
      room.roomPrice * totalSelectedNights +
      hotel.hotelPrice * totalSelectedNights +
      (voyageurs.childs + (voyageurs.adults - 1) + voyageurs.babies) * 450;
    setTotalPrice(allTotalPrice - (initialPrice - booking.total));

    // set minimumNight
    setMinimumNights(() => {
      let minimumNightsTime = [];
      operations.forEach((operation) => {
        minimumNightsTime.push(operation.surgeryMinDays);
      });
      return Math.max(...minimumNightsTime);
    });

    // get rooms
    const getRooms = async () => {
      const rooms = [];
      await firebase
        .firestore()
        .collection("rooms")
        .where("hotel", "==", hotel.hotel)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            rooms.push(doc.data());
          });
        })
        .catch((err) => {});
      setRooms(rooms);
    };
    getRooms();
  }, [
    openPopupData,
    booking,
    hotel,
    options,
    operations,
    setTotalPrice,
    room,
    totalSelectedNights,
    voyageurs,
  ]);

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

                  {offerName ? (
                    <p className="text-gray-600">{offerName}</p>
                  ) : (
                    <p className="text-gray-600">{surgeriesName()}</p>
                  )}
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
                        (option, i) =>
                          option.isChecked &&
                          `${
                            i !== 0 &&
                            booking.options.filter((opt) => opt.isChecked)
                              .length > 1
                              ? ", "
                              : ""
                          }${option.name} (+${option.price}€)`
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
              Modifier les données
            </p>
            <div className="bg-white border-gray-200 p-5 rounded border">
              <div className="flex items-center whitespace-nowrap mb-5 edit-operations flex-wrap gap-2">
                Vous souhaitez réaliser une
                {operations.map((operation) => (
                  <EditOperations
                    key={operation.surgery}
                    operation={operation}
                    setOperations={setOperations}
                    operationCategories={operationCategories}
                    operations={operations}
                    allOperation={allOperation}
                  />
                ))}
                <button
                  className="bg-shamrock p-1 rounded-full ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddNewOperations}
                  disabled={operations.find(
                    (opt) => opt.surgeryName === "Choisir une opération"
                  )}
                >
                  <FaPlus color="white" size="10" />
                </button>
              </div>
              <div className="flex items-center whitespace-nowrap mb-5">
                Votre voyage s&apos;étendra du
                <span
                  id="inputStartDate"
                  className="border p-2 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer w-max"
                >
                  <ReactDatePicker
                    minDate={new Date()}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"
                    selected={new Date(startDate)}
                    onChange={(date) => setStartDate(date)}
                  />
                </span>
                au
                <span
                  id="inputEndDate"
                  className={`border p-2 px-4 rounded align-middle mx-2 cursor-pointer w-max ${
                    minimumNights > totalSelectedNights
                      ? "border-red-600"
                      : "border-shamrock"
                  }`}
                >
                  <ReactDatePicker
                    minDate={addDays(startDate, parseInt(minimumNights))}
                    locale="fr"
                    selected={new Date(endDate)}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                      let timeDiff = Math.abs(
                        date.getTime() - new Date(booking.startDate).getTime()
                      );
                      let numberOfNights = Math.ceil(
                        timeDiff / (1000 * 3600 * 24)
                      );
                      setEndDate(date);
                      setTotalSelectedNights(numberOfNights);
                    }}
                  />
                </span>
                pour une durée de {totalSelectedNights} jours.{" "}
                <span className="ml-2 text-red-400">
                  {minimumNights > totalSelectedNights
                    ? `${minimumNights} jours minimum requis`
                    : ""}
                </span>
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
                <EditHotels
                  hotel={hotel}
                  setHotel={setHotel}
                  city={city}
                  setOptions={setOptions}
                />
                {"("}très bon choix{")"} et vous logerez en
                <EditRooms rooms={rooms} room={room} setRoom={setRoom} />
              </div>
              <div className="flex items-center whitespace-nowrap mb-5 flex-wrap gap-2">
                Vous avez selectioné les options suivantes :
                {!options.find(
                  (option) =>
                    option.isChecked || option.name === "Choisir une option"
                )
                  ? " ajouter une nouvelle option"
                  : ""}
                {options.length
                  ? options.map(
                      (option, i) =>
                        (option.isChecked ||
                          option.name === "Choisir une option") && (
                          <EditOptions
                            key={i}
                            id={i + 1}
                            option={option}
                            options={options}
                            setOptions={setOptions}
                          />
                        )
                    )
                  : " aucune option"}
                {options.find((option) => option.isChecked === false) && (
                  <button
                    className="bg-shamrock p-1 rounded-full ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddNewOptions}
                    disabled={options.find(
                      (opt) => opt.name === "Choisir une option"
                    )}
                  >
                    <FaPlus color="white" size="10" />
                  </button>
                )}
              </div>
              <div className="flex items-center mt-14">
                Le prix tout compris du voyage sur-mesure est de{" "}
                <span className="border text-white whitespace-nowrap block p-2 px-4 border-shamrock bg-shamrock rounded  mx-3">
                  {booking.total}€
                </span>
              </div>
              <button
                disabled={
                  !rooms.find(
                    (bookingRoom) => room.roomName === bookingRoom.name
                  ) ||
                  options.find((opt) => opt.name === "Choisir une option") ||
                  operations.find(
                    (opt) => opt.surgeryName === "Choisir une opération"
                  ) ||
                  loadingUpdate ||
                  minimumNights > totalSelectedNights
                }
                className="min-w-max transition px-5 py-3 mt-10 bg-shamrock text-white rounded border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-shamrock disabled:text-white group hover:bg-white border-shamrock hover:text-shamrock"
                onClick={handleUpdate}
              >
                {loadingUpdate ? (
                  <span className="flex items-center">
                    Chargement en cours
                    <FaCircleNotch className="animate-spin ml-2" />
                  </span>
                ) : (
                  "Mettre à jour"
                )}
              </button>
              {updateSuccess && (
                <UpdateSuccessPopup close={() => setUpdateSuccess(false)} />
              )}
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
                <p className="text-sm flex items-center gap-2">
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
