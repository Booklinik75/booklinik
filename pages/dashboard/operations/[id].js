import DashboardUi from "components/DashboardUi";
import DashboardInput from "components/DashboardInput";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";
import ProfileSelect from "components/ProfileSelect";
import DashboardButton from "components/DashboardButton";
import { useState } from "react";
import firebase from "firebase/clientApp";
import moment from "moment";
import { RiErrorWarningFill } from "react-icons/ri";
import {
  FaCalendar,
  FaHotel,
  FaPlaneDeparture,
  FaUserAlt,
  FaBed,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import BookingDetailBox from "components/BookingDetailBox";
import slugify from "slugify";
import { getBackEndAsset } from "utils/ClientHelpers";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) {
    return auth;
  }

  const { id } = ctx.query;
  const userId = auth.props.token.uid;

  const docRef = firebase.firestore().collection("bookings").doc(id);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().user !== userId) return serverRedirect("/404");

  const data = doc.data();
  data.startDate = new Date(data.startDate.toDate()).toString();
  data.endDate = new Date(data.endDate.toDate()).toString();

  const currentOperationCategory = [];

  await firebase
    .firestore()
    .collection("operationCategories")
    .where("slug", "==", data.surgeryCategory)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        currentOperationCategory.push(doc.data());
      });
    })
    .catch((err) => console.log(err));

  const currentOperation = [];
  await firebase
    .firestore()
    .collection("surgeries")
    .where("slug", "==", data.surgery)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        currentOperation.push(doc.data());
      });
    })
    .catch((err) => console.log(err));

  const currentCity = [];
  await firebase
    .firestore()
    .collection("cities")
    .where("slug", "==", data.city)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        currentCity.push(doc.data());
      });
    })
    .catch((err) => console.log(err));

  const currentCountry = [];
  await firebase
    .firestore()
    .collection("countries")
    .where("slug", "==", currentCity[0].country)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        currentCountry.push(doc.data());
      });
    })
    .catch((err) => console.log(err));

  if (currentCountry[0].additionalDocuments) {
    await Promise.all(
      currentCountry[0].additionalDocuments.map(async (doc, index) => {
        await getBackEndAsset(doc.file).then((res) => {
          currentCountry[0].additionalDocuments[index] = {
            ...currentCountry[0].additionalDocuments[index],
            url: res,
          };
        });
      })
    );
  }

  return {
    props: {
      data: data,
      auth,
      currentOperationCategory: currentOperationCategory[0],
      currentOperation: currentOperation[0],
      currentCountry: currentCountry[0],
    },
  };
};

const OperationPage = ({
  auth,
  data,
  currentOperationCategory,
  currentOperation,
  currentCountry,
}) => {
  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="grid grid-cols-10 col-span-10 grid-flow-column auto-rows-max gap-4">
        <div className="col-span-10 space-y-4 max-h-max">
          <div className="flex justify-between gap-4 flex-col items-start md:flex-row md:items-center">
            <div>
              <h1 className="text-4xl">
                {`${data.surgeryCategoryName} `}à
                <span className="capitalize">{` ${data.city}`}</span>
                {data.clinicName && `- ${data.clinicName}`}
              </h1>
              <h2 className="text uppercase text-shamrock">
                {data.surgeryName}
              </h2>
            </div>
            <div className="transition h-max flex border border-red-500 rounded py-2 px-4 items-center gap-4 hover:bg-red-500 group">
              <div className="relative">
                <RiErrorWarningFill className="transition text-red-500 group-hover:text-white animate-ping z-10 absolute" />
                <RiErrorWarningFill className="transition text-red-500 group-hover:text-white" />
              </div>
              <p className="transition group-hover:text-white">
                Documents manquants
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-10 lg:col-span-7 flex flex-col gap-4">
          <div className="h-60 w-full relative rounded overflow-hidden">
            <Image
              src={data.roomPhotoLink}
              layout="fill"
              alt={data.room}
              objectFit="cover"
            />
            <p className="text-3xl rounded shadow bg-shamrock py-2 px-4 absolute right-4 top-4 z-10 text-white">
              {data.hotelPrice *
                data.totalSelectedNights *
                (1 +
                  data.extraBabies +
                  data.extraChilds +
                  data.extraTravellers) +
                data.surgeryPrice}{" "}
              €
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BookingDetailBox
              icon={
                <Image
                  src={currentOperationCategory.icon}
                  width={18}
                  height={18}
                  alt=""
                />
              }
              title={"Opérations"}
              col={1}
            >
              {data.surgeryName}
            </BookingDetailBox>

            <BookingDetailBox
              icon={<FaCalendar className="text-bali" size={18} />}
              title={"Date du voyage"}
              col={1}
            >
              {`${moment(data.startDate).format("DD[/]MM[/]YY")} - ${moment(
                data.endDate
              ).format("DD[/]MM[/]YY")}`}
            </BookingDetailBox>

            <BookingDetailBox
              icon={<FaHotel className="text-bali" size={18} />}
              title="Hôtel"
              col={1}
            >
              {data.hotelName}
            </BookingDetailBox>

            <BookingDetailBox
              icon={<FaPlaneDeparture className="text-bali" size={18} />}
              title="Destination du voyage"
              col={1}
            >
              <span className="capitalize">{data.city}</span>
            </BookingDetailBox>

            <BookingDetailBox
              icon={<FaUserAlt className="text-bali" size={18} />}
              title="Nombre de voyageurs"
              col={1}
            >
              {1 + data.extraBabies + data.extraChilds + data.extraTravellers}
              &nbsp;voyageurs
            </BookingDetailBox>

            <BookingDetailBox
              icon={<FaBed className="text-bali" size={18} />}
              title="Type de chambre"
              col={1}
            >
              {data.roomName}
            </BookingDetailBox>

            <div className="col-span-1 md:col-span-3 grid gap-4 grid-cols-1 md:grid-cols-3">
              <p className="text-sm text-gray-500 uppercase col-span-1 md:col-span-3 -mb-3">
                Options
              </p>
              {data.options.map((option) => {
                return (
                  option.isChecked && (
                    <BookingDetailBox col={1}>{option.name}</BookingDetailBox>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-span-10 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 grid-flow-column auto-rows-max">
          <div className="col-span-1 flex flex-col gap-2 border border-red-500 p-4 rounded">
            <p className="text-3xl">Documents manquants</p>
            <p>
              Afin de finaliser votre séjour, vous devez remplir ces documents.
            </p>
            {currentOperation.requiredPictures.map((requiredPicturesSet, i) => (
              <div
                key={`${slugify(requiredPicturesSet.title)}_${i}`}
                className="transition h-max flex border justify-between border-red-500 rounded py-2 px-4 items-center gap-4 hover:shadow hover:bg-red-500 hover:cursor-pointer hover:animate-pulse group"
              >
                <p className="transition group-hover:text-white">
                  {requiredPicturesSet.photosCount}
                  <span className="lowercase">
                    {" "}
                    {requiredPicturesSet.title}
                  </span>
                </p>
                <FaUpload className="transition text-red-500 group-hover:text-white" />
              </div>
            ))}
          </div>
          <div className="col-span-1 flex flex-col gap-2 border border-shamrock p-4 rounded">
            <p className="text-3xl">Préparez votre voyage</p>
            <p>
              Nous vous mettons a disposition des documents pour faciliter votre
              voyage.
            </p>
            {currentCountry.additionalDocuments.map((document, i) => (
              <Link href={document.url} key={`${slugify(document.name)}_${i}`}>
                <a>
                  <div className="transition h-max flex justify-between border border-shamrock rounded py-2 px-4 items-center gap-4 hover:shadow hover:bg-shamrock hover:cursor-pointer hover:animate-pulse group">
                    <p className="transition group-hover:text-white">
                      {document.name}
                    </p>
                    <FaDownload className="transition text-shamrock group-hover:text-white" />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardUi>
  );
};

export default OperationPage;
