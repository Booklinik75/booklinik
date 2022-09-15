import { useState } from "react";
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

const ModalNoSignUp = ({ onClose, visible,booking }) => {

  const { signOut } = useAuth();
  const [form, setForm] = useState({
    email: "",
    message: "",
    name: "",
    phoneNumber: "",
    value: "",
  });


  const totalPrice =
    Number(booking.surgeries[0].surgeryPrice) +
    Number(booking.totalExtraTravellersPrice) +
    booking.options
      ?.map((option) => option.isChecked && Number(option.price))
      .reduce((a, b) => a + b) +
    Number(booking.roomPrice) * Number(booking.totalSelectedNights);
  const { isChecked, handleUseReferral } = useContext(BookContext);
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
                  email:email,
                  user: user.uid,
                  status: message,
                  name: name,
                  message: message,
                  phoneNumber: phoneNumber,

                  total:
                    Number(booking.surgeries[0].surgeryPrice) +
                    Number(booking.totalExtraTravellersPrice) +
                    Number(booking.roomPrice) *
                      Number(booking.totalSelectedNights) +
                    booking.options
                      ?.map(
                        (option) => option.isChecked && Number(option.price)
                      )
                      .reduce((a, b) => a + b),
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
        });
        if (email){
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
              startDate: booking.startDate,
              endDate: booking.endDate,
              hotelName: booking.hotelName,
              total: totalPrice,
              totalSelectedNights: booking.totalSelectedNights,
              room: booking.room,
              city: booking.city,
          }}
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
                  surgeryCategoryName: booking.surgeries[0].surgeryCategoryName,
                  startDate: booking.startDate,
                  endDate: booking.endDate,
                  hotelName: booking.hotelName,
                  total: totalPrice,
                  totalSelectedNights: booking.totalSelectedNights,
                  room: booking.room,
                  city: booking.city,
              }

            }  }),

          });
        })
        .catch((error) => {
          Sentry.captureException(error);
        })
        .finally(() => {
          setIsSubmitting(false);
          setErrros({});
        });}
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

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center  overflow-auto  z-50">
      <div id="contactform" className="py-40 mt-40 lg:mt-0 xl:mt-0 absolute">
        <div className="mx-4 xl:mx-auto  mt-40 lg:mt-0 xl:mt-0 l py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1 lg:grid-cols-2 gap-0 px-10 text-white placeholder-white ">
          <div className="space-y-6 h-full">
            <h1 className="text-2xl mb-6">Parfait, on y est presque !</h1>
            <div className="py-6 space-y-6 leading-9 ">
              <p className=" lg:flex-row lg:items-center">
                Vous souhaitez réaliser une{" "}
                
                  <span className="font-bold">
                    <BookingDataSpan
                      string={booking.surgeries[0].surgeryCategoryName}

                    />{" "}
                  </span>
                  sur{" "}
              
                <span className="font-bold	 ">
                  <BookingDataSpan string={booking.surgeries[0].surgeryName} />
                </span>
              </p>
              <p className="">
                Votre voyage s&apos;étendra du{" "}
                <span className="font-bold">
                  <BookingDataSpan>
                    <Moment
                      format="DD MMM YYYY"
                      date={booking.startDate}
                      locale="fr"
                    />
                  </BookingDataSpan>
                  au{" "}
                  <BookingDataSpan>
                    <Moment
                      format="DD MMM YYYY"
                      date={booking.endDate}
                      locale="fr"
                    />
                  </BookingDataSpan>
                </span>
                pour une durée de{" "}
                <span className="font-bold">
                  {booking.totalSelectedNights}{" "}
                </span>
                jours.
              </p>
              {booking.extraBabies > 0 ||
              booking.extraChilds > 0 ||
              booking.extraTravellers > 0 ? (
                <p className="flex ">
                  Vous serez accompagné-e par{" "}
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
                  de votre choix pour découvrir{" "}
                  <span className="font-bold">
                    <BookingDataSpan string={booking.city} />
                  </span>
                </p>
              ) : (
                ""
              )}{" "}
              <p className="">
                L&apos;hôtel dans lequel vous résiderez est au{" "}
                <span className="font-bold">
                  <BookingDataSpan string={booking.hotelName} />{" "}
                </span>
               </p>
               <p>
                (très bon choix) et vous logerez en
                <span className="font-bold">{" "} 
                  <BookingDataSpan string={booking.roomName} />
                </span>
              </p>
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
            </div>

            <p className="pb-6 !mt-0 flex flex-col items-start gap-2 lg:flex-row lg:items-center">
              Le prix tout compris de votre voyage sur-mesure est de :{" "}
              <span className="text-2xl rounded text-shamrock px-4 py-2 mx-2 bg-white ">
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
                  <div className="flex flex-row  justify-end">
                    <button
                      type="submit"
                      className="mx-3 float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 hover:text-shamrock"
                      disabled={isSubmitting}
                    >
                      Envoyer
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                      onClick={onClose}
                    >
                      Fermer
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex-col items-center justify-center">
                  <p className="text-center">
                    Votre message a bien été envoyé. Nous vous recontacterons
                    dans les plus brefs délais.
                  </p>

                  <button
                    type="submit"
                    className="float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 mx-5  hover:text-shamrock item-center"
                    onClick={onClose&&signOut}
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalNoSignUp;
