import { useState, useEffect, useRef } from "react";
import BookingDataSpan from "./bookingComponents/BookingDataSpan";
import Moment from "node_modules/react-moment/dist/index";
import formatPrice from "utils/formatPrice";
import { useContext } from "react";
import { BookContext } from "utils/bookContext";
import Link from "next/link";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/browser";
import moment from "moment";
import { useRouter } from "next/router";
import validateContactForm from "../utils/validateContactForm";
import PhoneInput from "react-phone-input-2";
import MD5 from "crypto-js/md5";
import { useAuth } from "hooks/useAuth";
import "react-phone-input-2/lib/style.css";
import { AiOutlineClose } from "react-icons/ai";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "../firebase/clientApp";
import { BiError } from "react-icons/bi";
import errors from "utils/firebase_auth_errors";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);

  if (auth.props.userProfile) return serverRedirect("/dashboard");

  return {
    props: {
      auth,
    },
  };
};
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const ModalNoSignUp = ({ onClose, visible, booking }) => {
  const [form, setForm] = useState({
    email: "",
    message: "",
    name: "",
    phoneNumber: "",
    value: "",
  });
  const [bookingDataUpdate, setBookingDataUpdate] = useState(booking);
  const [startDate, setStartDate] = useState(booking.startDate);
  const [endDate, setEndDate] = useState(booking.endDate);
  const [totalSelectedNights, setTotalSelectedNights] = useState(
    booking.totalSelectedNights
  );
  const [minimumNights, setMinimumNights] = useState(booking.minimumNights);
  const bookingOptionsTotalPrice = booking.options
    ? booking.options
        ?.map((option) => option.isChecked && Number(option.price))
        .reduce((a, b) => a + b)
    : 0;
  const totalPrice =
    Number(booking.surgeries[0].surgeryPrice) +
    Number(booking.totalExtraTravellersPrice) +
    bookingOptionsTotalPrice +
    Number(booking.roomPrice) * Number(totalSelectedNights);
  const { isChecked, handleUseReferral } = useContext(BookContext);
  const ref = useRef(null);
  const [isLoading, setLoading] = useState("idle");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errors, setErrros] = useState({});

  const router = useRouter(); //stop

  const handleFormSubmit = (e) => {
    const { email, message, name, phoneNumber } = form;
    setLoading("loading");
    e.preventDefault();
    setIsSubmitting(true);

    const { errors, valid } = validateContactForm(form);
    if (!valid) {
      setErrros(errors);
      setIsSubmitting(false);
      setLoading("idle");
    } else {
      // Authentification firebase anonymous

      firebase
        .auth()
        .signInAnonymously()
        .then(() => {
          setFormSent(true);
          // update current user
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              const booking = JSON.parse(localStorage.getItem("bookBooklinik"));
              var firestoreObjectSetBooking = firebase
                .firestore()
                .collection("bookingsNoConnexion")
                .add({
                  email: email,
                  user: user.uid,
                  status: message,
                  name: name,
                  message: message,
                  phoneNumber: phoneNumber,

                  total:
                    Number(booking.surgeries[0].surgeryPrice) +
                    Number(booking.totalExtraTravellersPrice) +
                    Number(booking.roomPrice) * Number(totalSelectedNights) +
                    bookingOptionsTotalPrice,
                  ...booking,
                });
            }
          });

          // redirect to dashboard
          // router.push("/dashboard");
        })

        .catch((error) => {
          if (errors[error.code]) {
            setError(errors[error.code]);
          } else {
            setError("Une erreur est survenue");
          }
          Sentry.captureException(error);
        })
        .finally(() => {
          setLoading("idle");
          firebase.auth().signOut();
          router.push("/");
        });
      if (email) {
        fetch("/api/mail", {
          method: "post",
          body: JSON.stringify({
            recipient: "info@booklinik.com",
            templateId: "d-b2d6e1304ba7400ca27756c7cf642afe",
            dynamicTemplateData: {
              email: email,
              name: name,
              phoneNumber: phoneNumber,
              datetime: moment(new Date()).format("LLLL"),
              message: message,
              operation: form.operation,
              value: value,
              booking: {
                date: booking.created,
                offerName: booking.offerName,
                surgeryName: booking.surgeries[0].surgeryName,
                surgeryCategoryName: booking.surgeries[0].surgeryCategoryName,
                startDate: startDate,
                endDate: endDate,
                hotelName: booking.hotelName,
                total: totalPrice,
                totalSelectedNights: totalSelectedNights,
                room: booking.room,
                city: booking.city,
              },
            },
          }),
        })
          .then(() => {
            setFormSent(true);
            fetch("/api/mail", {
              method: "post",
              body: JSON.stringify({
                recipient: email,
                templateId: "d-54ea2f11e4da48bb923afcc2e43b95fee",
                dynamicTemplateData: {
                  email: email,
                  name: name,
                  phoneNumber: phoneNumber,
                  datetime: moment(new Date()).format("LLLL"),
                  message: message,
                  operation: form.operation,
                  value: value,
                  booking: {
                    date: booking.created,
                    offerName: booking.offerName,
                    surgeryName: booking.surgeries[0].surgeryName,
                    surgeryCategoryName:
                      booking.surgeries[0].surgeryCategoryName,
                    startDate: startDate,
                    endDate: endDate,
                    hotelName: booking.hotelName,
                    total: totalPrice,
                    totalSelectedNights: totalSelectedNights,
                    room: booking.room,
                    city: booking.city,
                  },
                },
              }),
            });
          })
          .catch((error) => {
            Sentry.captureException(error);
          })
          .finally(() => {
            setIsSubmitting(false);
            setErrros({});
          });
      }
    }
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "phoneNumber"
          ? e.target.value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*?)\..*/g, "$1")
              .trim()
          : e.target.value,
    });
  };

  const handlePhoneNumber = (phone) => {
    setForm({
      ...form,
      phoneNumber: `+${phone}`,
    });
  };

  const getInitialState = () => {
    const value = "";
    return value;
  };

  const [value, setValue] = useState(getInitialState);
  useEffect(() => {
    if (!endDate) {
      setErrros({ ...errors, date: "Sélectionnez une date de retour" });
      setIsSubmitting(true);
    }
    return () => {
      setErrros({ ...errors, date: "" });
      setIsSubmitting(false);
    };
  }, [endDate]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex flex-wrap justify-center items-center  overflow-auto  z-50">
      <div id="contactform" className="  lg:mt-0 xl:mt-0 lg:absolute p-4 ">
        <div className="lg:mt-0 xl:mt-0 relative  rounded-xl bg-shamrock gap-0 text-white placeholder-white">
          <div className="px-3 pt-4">
            <span className="cursor-pointer">
              <AiOutlineClose
                className="hover:text-gray-500"
                size={20}
                onClick={onClose}
              />
            </span>
          </div>
          <div className="mx-4 xl:mx-auto py-14 px-2  lg:px-10 grid grid-cols-1 lg:grid-cols-2 pt-5">
            <div className="space-y-6 h-full">
              <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
              <div className="py-6 space-y-6 leading-9 ">
                {console.log(startDate)}
                <p className=" lg:flex-row lg:items-center">
                  Vous souhaitez réaliser une opération
                </p>
                <span>
                  {" "}
                  <span className="">
                    <BookingDataSpan
                      string={booking.surgeries[0].surgeryName}
                    />{" "}
                  </span>
                </span>
                <div className="flex items-center flex-wrap md:flex-nowrap whitespace-nowrap mb-5">
                  <p className="lg:flex-row lg:items-center">
                    Votre voyage s&apos;étendra du{" "}
                  </p>{" "}
                  <span
                    id="inputStartDate"
                    className="border py-1 px-2 md:py-2 md:px-4 rounded align-middle mx-2 border-white cursor-pointer w-max  text-white"
                  >
                    <ReactDatePicker
                      minDate={new Date()}
                      locale="fr"
                      dateFormat="dd/MM/yyyy"
                      selected={new Date(startDate)}
                      onChange={(date) => {
                        setStartDate(date), setEndDate();
                      }}
                      disabledKeyboardNavigation
                      className={"bg-shamrock   "}
                    />
                  </span>
                  au{" "}
                  <span
                    id="inputEndDate"
                    className={`border py-1 px-2 md:py-2 md:px-4 rounded align-middle mx-2 cursor-pointer w-max text-white  ${
                      !endDate ? "border-red-600" : "border-white"
                    }`}
                  >
                    <ReactDatePicker
                      minDate={addDays(startDate, parseInt(minimumNights))}
                      locale="fr"
                      selected={
                        endDate
                          ? new Date(endDate)
                          : addDays(startDate, parseInt(booking.minimumNights))
                      }
                      dateFormat="dd/MM/yyyy"
                      className="bg-shamrock"
                      onChange={(date) => {
                        let timeDiff = Math.abs(
                          date.getTime() - new Date(startDate).getTime()
                        );
                        let numberOfNights = Math.ceil(
                          timeDiff / (1000 * 3600 * 24)
                        );
                        setEndDate(date);
                        setTotalSelectedNights(numberOfNights);
                      }}
                    />
                  </span>
                </div>
                {errors && errors.date ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.date}
                  </span>
                ) : (
                  ""
                )}
                <p>
                  pour une durée de{" "}
                  <span className="font-bold">{totalSelectedNights} </span>
                  jours.
                </p>
                {booking.extraBabies > 0 ||
                booking.extraChilds > 0 ||
                booking.extraTravellers > 0 ? (
                  <p className="flex md:flex-row whitespace-">
                    Vous serez accompagné-e par
                    <p> </p>
                    <span className="font-bold">
                      {booking.extraTravellers > 0 ? (
                        <BookingDataSpan
                          string={`${booking.extraTravellers} voyageur${
                            booking.extraTravellers > 1 ? "s" : ""
                          }`}
                        />
                      ) : (
                        ""
                      )}
                      {booking.extraChilds > 0 ? (
                        <BookingDataSpan
                          string={`${booking.extraChilds} enfant${
                            booking.extraChilds > 1 ? "s" : ""
                          }`}
                        />
                      ) : (
                        ""
                      )}
                      {booking.extraBabies > 0 ? (
                        <BookingDataSpan
                          string={`${booking.extraBabies} bébé${
                            booking.extraBabies > 1 ? "s" : ""
                          }`}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                    <p>de votre choix pour découvrir</p>
                    <p> </p>
                    <span className="font-bold">
                      <BookingDataSpan string={booking.city} />
                    </span>
                  </p>
                ) : (
                  ""
                )}{" "}
                <p className="">
                  L&apos;hôtel dans lequel vous résiderez est au{" "}
                  <span className="font-bold whitespace-nowrap">
                    <BookingDataSpan string={booking.hotelName} />{" "}
                  </span>
                </p>
                <p>
                  (très bon choix) et vous logerez en
                  <span className="font-bold whitespace-nowrap">
                    {" "}
                    <BookingDataSpan string={booking.roomName} />
                  </span>
                </p>
                {booking.options ? (
                  <p className="">
                    Vous avez selectionné les options suivantes :{" "}
                    <span className="font-bold">
                      {booking.options.map((option) => {
                        return option.isChecked === true ? (
                          <BookingDataSpan string={option.name} />
                        ) : (
                          ""
                        );
                      })}
                    </span>
                  </p>
                ) : (
                  ""
                )}
              </div>

              <p className="pb-6 !mt-0 flex flex-col items-start gap-2 lg:flex-row lg:whitespace-nowrap lg:items-center">
                Le prix tout compris de votre voyage sur-mesure est de :{" "}
                <span className="text-2xl flex-row flex  rounded text-shamrock px-4 py-2 mx-2 bg-white ">
                  {formatPrice(
                    isChecked
                      ? totalPrice - userProfile.referalBalance
                      : totalPrice
                  )}{" "}
                  €
                </span>
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="space-y-6">
                {!formSent ? (
                  <>
                    <div>
                      <p className="uppercase text-sm mb-2">Nom</p>
                      <input
                        type="text"
                        className={`w-full bg-transparent border-b outline-none placeholder-white ${
                          errors && errors.name
                            ? "border-red-600 "
                            : "border-white"
                        } p-3`}
                        placeholder="Nom"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                      />
                      {errors && errors.name ? (
                        <span className="text-red-600 text-sm mt-3">
                          {errors.name}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div
                      className={`${
                        errors && errors.phoneNumber ? "error-input" : ""
                      }`}
                    >
                      <p className="uppercase text-sm mb-2">
                        Numéro de téléphone
                      </p>
                      <PhoneInput
                        country={"fr"}
                        value={form.phoneNumber}
                        onChange={(phone) => handlePhoneNumber(phone)}
                      />
                      {errors && errors.phoneNumber ? (
                        <span className="text-red-600 text-sm mt-3">
                          {errors.phoneNumber}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div>
                      <p className="uppercase text-sm mb-2">Votre email</p>
                      <input
                        type="email"
                        className={`w-full bg-transparent border-b outline-none placeholder-white ${
                          errors && errors.email
                            ? "border-red-600 "
                            : "border-white"
                        } p-3`}
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                      />
                      {errors && errors.email ? (
                        <span className="text-red-600 text-sm mt-3">
                          {errors.email}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div>
                      <p className="uppercase text-sm mb-2">Votre message</p>
                      <textarea
                        className={`w-full h-24 bg-white bg-opacity-10 border-b outline-none placeholder-white ${
                          errors && errors.message
                            ? "border-red-600 "
                            : "border-white"
                        } p-3`}
                        placeholder="J&lsquo;ai une question à propos de ..."
                        value={form.message}
                        name="message"
                        onChange={handleFormChange}
                      ></textarea>
                      {errors && errors.message ? (
                        <span className="text-red-600 text-sm mt-3">
                          {errors.message}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex flex-row  justify-end ">
                      <button
                        type="submit"
                        className={`mx-3 float-right rounded bg-white/10 ${
                          !isSubmitting
                            ? " hover:text-shamrock hover:bg-white "
                            : ""
                        }' p-3 transition `}
                        disabled={isSubmitting}
                      >
                        Envoyer
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex-col justify-items-center ">
                    <p className="text-center  xl:text-lg">
                      Votre message a bien été envoyé.
                      <br /> Nous vous recontacterons dans les plus brefs
                      délais.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNoSignUp;
