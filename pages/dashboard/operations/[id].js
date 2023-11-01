import { useState } from "react";

// utils
import { checkAuth, serverRedirect } from "utils/ServerHelpers";

// global components
import DashboardUi from "components/DashboardUi";
import DashboardInput from "components/DashboardInput";
import ProfileSelect from "components/ProfileSelect";
import DashboardButton from "components/DashboardButton";
import BookingDetailBox from "components/BookingDetailBox";

// libraries
import firebase from "firebase/clientApp";
import moment from "moment";
import Dropzone from "react-dropzone";
import { RiErrorWarningFill } from "react-icons/ri";
import {
  FaCalendar,
  FaHotel,
  FaPlaneDeparture,
  FaUserAlt,
  FaBed,
  FaDownload,
  FaUpload,
  FaCheck,
  FaCreditCard,
} from "react-icons/fa";
import { RiCloseCircleLine, RiCloseCircleFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

// utils
import { getBackEndAsset, doFileUpload } from "utils/ClientHelpers";
import formatPrice from "utils/formatPrice";

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
  data.startDate =
    typeof data.startDate === "string"
      ? data.startDate
      : new Date(data.startDate.toDate()).toString();
  data.endDate =
    typeof data.endDate === "string"
      ? data.endDate
      : new Date(data.endDate.toDate()).toString();
  data.created = data.created
    ? typeof data.created === "string"
      ? data.created
      : new Date(data?.created?.toDate()).toString()
    : "";

  const currentOperationCategory = [];

  data.surgeries.forEach(
    async (surgery) =>
      await firebase
        .firestore()
        .collection("operationCategories")
        .where("slug", "==", surgery.surgeryCategory)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            currentOperationCategory.push(doc.data());
          });
        })
        .catch((err) => {})
  );

  const currentOperations = [];
  data.surgeries.forEach(
    async (surgery) =>
      await firebase
        .firestore()
        .collection("surgeries")
        .where("slug", "==", surgery.surgery)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            currentOperations.push(doc.data());
          });
        })
        .catch((err) => {})
  );

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
    .catch((err) => {});

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
    .catch((err) => {});

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

  currentOperations.map((currentOperation) => {
    currentOperation.requiredPictures.map((set, index) => {
      let slug = slugify(set.title);

      if (data.picturesSet?.[slug]) {
        currentOperation.requiredPictures[index] = {
          ...currentOperation.requiredPictures[index],
          done: true,
        };
      } else {
        currentOperation.requiredPictures[index] = {
          ...currentOperation.requiredPictures[index],
          done: false,
        };
      }
    });
  });

  return {
    props: {
      bookingId: id,
      data: data,
      auth,
      currentOperationCategory,
      currentOperations: currentOperations,
      currentCountry: currentCountry[0],
    },
  };
};

const OperationPage = ({
  auth,
  data,
  bookingId,
  currentOperationCategory,
  currentOperations,
  currentCountry,
}) => {
  const [isLoading, setIsLoading] = useState("idle");
  const router = useRouter();

  const [picturesImporter, setPicturesImporter] = useState({
    set: undefined,
    visibility: false,
  });

  const [pictures, setPictures] = useState([]);

  const deletePicture = (e, index) => {
    e.stopPropagation();

    let oldPictures = pictures;
    oldPictures.splice(index, 1);
    setPictures([...oldPictures]);
  };

  const surgeriesName = () => {
    const surgeryNames = [];
    data.surgeries.map((operation) => surgeryNames.push(operation.surgeryName));
    if (surgeryNames.length > 1) {
      return surgeryNames.join(", ");
    } else {
      return surgeryNames[0];
    }
  };
  const surgeryCategoriesName = () => {
    const surgeryNameCategories = [];
    data.surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length > 1) {
      let uniqueCategories = [...new Set(surgeryNameCategories)];
      return uniqueCategories.join(", ");
    } else {
      return surgeryNameCategories[0];
    }
  };

  const uploadPictureSet = async () => {
    const pictureSetLinks = [];
    setIsLoading("loading");

    if (Number(pictures.length) === Number(picturesImporter.set.photosCount)) {
      Promise.all(
        pictures.map(async (file) => {
          // build storage object
          const fileRef = `customer_data/${data.user}/${bookingId}/${slugify(
            picturesImporter.set.title
          )}`;
          const fileName = `${(Math.random() + 1).toString(36).substring(7)}_${
            file.name
          }`;

          // upload action
          const imageUploadRes = await doFileUpload(fileRef, fileName, file);

          // save links
          pictureSetLinks.push(
            await getBackEndAsset(imageUploadRes.ref.fullPath)
          );
        })
      ).then(() => {
        firebase
          .firestore()
          .collection("bookings")
          .doc(bookingId)
          .update({
            [`picturesSet.${slugify(picturesImporter.set.title)}`]: [
              ...pictureSetLinks,
            ],
          })
          .then(() => {
            setIsLoading("done");
            setTimeout(() => {
              setIsLoading("idle");
            }, 1000);
            router.reload(window.location.pathname);
          });

        setIsLoading("idle");
      });
    }
  };

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      {picturesImporter.visibility &&
        createPortal(
          <div
            className="fixed w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center z-20"
            style={{ marginTop: "-100vh" }}
            onClick={(e) => {
              e.stopPropagation();
              setPicturesImporter({
                set: undefined,
                visibility: false,
              });
              setPictures([]);
            }}
          >
            <div
              className="bg-white rounded shadow-lg p-8 z-30 flex flex-col m-8 md:max-w-3xl lg:max-w-3xl gap-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex justify-between items-center">
                <p className="text-3xl">
                  {`Ajouter ${picturesImporter.set.photosCount} ${picturesImporter.set.title}`}
                </p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setPicturesImporter({
                      set: undefined,
                      visibility: false,
                    });
                    setPictures([]);
                  }}
                  className="transition w-1 h-8 hover:cursor-pointer hover:text-red-600 group"
                >
                  <div className="relative">
                    <RiCloseCircleLine
                      size={24}
                      className="absolute right-0 top-0 opacity-100 group-hover:opacity-0"
                    />
                    <RiCloseCircleFill
                      size={24}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
              <p>{picturesImporter.set.description}</p>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  if (
                    acceptedFiles.length + pictures.length >
                    picturesImporter.set.photosCount
                  ) {
                    toast.warn(
                      `Nombre de photos limité à ${picturesImporter.set.photosCount}`
                    );
                  } else {
                    setPictures([
                      ...pictures,
                      ...acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      ),
                    ]);
                  }
                }}
                accept="image/*"
                multiple={true}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      {...getRootProps()}
                      className="w-full flex flex-col gap-4 rounded items-center justify-center bg-gray-100 border overflow-hidden border-dashed border-gray-400 py-12 px-4
                      transition-all hover:bg-gray-200 hover:border-gray-600 hover:cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p className="text-white p-4 rounded text-center bg-shamrock">
                        Cliquez ici pour ajouter des photos, ou glissez
                        directement vos photos
                      </p>
                      {pictures.length > 0 && (
                        <div className="flex items-center justify-center gap-4">
                          {pictures?.map((picture, index) => (
                            <div
                              className="rounded overflow-hidden shadow relative group hover:cursor-pointer z-20"
                              key={`${picture.name}-${picture.lastModified}`}
                              onClick={(e) => {
                                deletePicture(e, index);
                              }}
                            >
                              <div className="transition opacity-0 group-hover:opacity-100 bg-red-200 z-10 flex bg-opacity-30 w-full h-full absolute items-center justify-center">
                                <p className="text-white drop-shadow uppercase text-sm">
                                  Supprimer
                                </p>
                              </div>
                              <Image
                                src={picture.preview}
                                width={100}
                                height={100}
                                objectFit="cover"
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
              <div className="w-full flex justify-end gap-4 ">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setPicturesImporter({
                      set: undefined,
                      visibility: false,
                    });
                    setPictures([]);
                  }}
                  className="group px-5 py-3 hover:cursor-pointer"
                >
                  <p className="group-hover:underline">Annuler</p>
                </div>
                <DashboardButton
                  defaultText="Soumettre les photos"
                  className="w-max"
                  disabled={pictures.length < picturesImporter.set.photosCount}
                  onClick={uploadPictureSet}
                  status={isLoading}
                />
              </div>
            </div>
          </div>,
          document.querySelector("body")
        )}
      <div className="grid grid-cols-10 col-span-10 grid-flow-column auto-rows-max gap-4">
        <div className="col-span-10 space-y-4 max-h-max">
          <div className="flex justify-between gap-4 flex-col items-start md:flex-row md:items-center">
            <div>
              <h1 className="text-4xl">
                {`${surgeryCategoriesName()} `}à
                <span className="capitalize">{` ${data.city}`}</span>
                {data.clinicName && `- ${data.clinicName}`}
              </h1>
              <h2 className="text uppercase text-shamrock">
                {surgeriesName()}
              </h2>
            </div>
            {/* <div className="transition h-max flex border border-red-500 rounded py-2 px-4 items-center gap-4 group">
              <div className="relative">
                <RiErrorWarningFill className="transition text-red-500 animate-ping z-10 absolute" />
                <RiErrorWarningFill className="transition text-red-500" />
              </div>
              <p>Documents manquants</p>
            </div> */}
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
            <p className="text-3xl rounded shadow bg-shamrock py-2 px-4 absolute right-4 top-4 text-white z-10">
              {formatPrice(
                data.alternativeTotal ? data.alternativeTotal : data.total
              )}
              &nbsp;€
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 grid gap-4 grid-cols-1 md:grid-cols-3">
              <p className="text-sm text-gray-500 uppercase col-span-1 md:col-span-3 -mb-3">
                Opérations
              </p>
              {data.surgeries.map((surgery) => {
                return (
                  <BookingDetailBox
                    icon={currentOperationCategory.map((currentOpCategory, i) =>
                      currentOpCategory.slug === surgery.surgeryCategory ? (
                        <Image
                          src={currentOpCategory.icon}
                          width={18}
                          height={18}
                          alt=""
                          key={currentOpCategory.slug}
                        />
                      ) : (
                        ""
                      )
                    )}
                    key={surgery.surgery}
                    col={1}
                  >
                    {surgery.surgeryName}
                  </BookingDetailBox>
                );
              })}
            </div>

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
              col={2}
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

            {data.options && (
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
            )}
          </div>
        </div>
        <div className="col-span-10 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 grid-flow-column auto-rows-max">
          <p className="text-1xl text-shamrock font-medium ">
            UNE FOIS VOS PHOTOS TELECHARGEES VOTRE CONSEILLER VOUS CONTACTERA
            SOUS 24H.
          </p>
          {currentOperations.length > 0 &&
            currentOperations.map(
              (currentOperation) =>
                currentOperation.requiredPictures.length > 0 && (
                  <div className="col-span-1 flex flex-col gap-2 border border-gray-800 p-4 rounded">
                    <p className="text-3xl">
                      Documents requis ({currentOperation.name})
                    </p>
                    <p>
                      Afin de finaliser votre séjour, vous devez remplir ces
                      documents.
                    </p>
                    {currentOperation.requiredPictures.map(
                      (requiredPicturesSet, i) => (
                        <div
                          key={`${slugify(requiredPicturesSet.title)}_${i}`}
                          className={`transition h-max flex border justify-between rounded py-2 px-4 items-center gap-4 group ${
                            requiredPicturesSet.done
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-red-500 hover:shadow hover:bg-red-500 hover:cursor-pointer hover:animate-pulse"
                          }`}
                          onClick={() => {
                            if (!requiredPicturesSet.done) {
                              setPicturesImporter({
                                set: requiredPicturesSet,
                                visibility: true,
                              });
                            }
                          }}
                        >
                          <p className="transition group-hover:text-white">
                            {requiredPicturesSet.photosCount}
                            <span className="lowercase">
                              {" "}
                              {requiredPicturesSet.title}
                            </span>
                          </p>
                          {requiredPicturesSet.done ? (
                            <FaCheck />
                          ) : (
                            <FaUpload className="transition text-red-500 group-hover:text-white" />
                          )}
                        </div>
                      )
                    )}
                    <p className="text-sm text-gray-500 uppercase text-center">
                      Photos accessible uniquement par votre chirurgien.
                    </p>
                  </div>
                )
            )}
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
          {data.status === "awaitingPayment" && (
            <div className="col-span-1 flex flex-col gap-2 border border-blue-500 p-4 rounded">
              <p className="text-3xl">Régler votre opération</p>
              <p>Vous pouvez désormais régler votre opération.</p>
              <Link href={`/checkout/${bookingId}`}>
                <a>
                  <div className="transition h-max flex justify-between border border-blue-500 rounded py-2 px-4 items-center gap-4 hover:shadow hover:bg-blue-500 hover:cursor-pointer group">
                    <p className="transition group-hover:text-white">Régler</p>
                    <FaCreditCard className="transition text-blue-500 group-hover:text-white" />
                  </div>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardUi>
  );
};

export default OperationPage;
