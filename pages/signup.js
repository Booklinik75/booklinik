import Link from "next/link";
import Logo from "../public/booklinik-logo.svg";
import Image from "next/image";
import SideBanner from "../public/assets/login.jpeg";
import firebase from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useContext,useState,useEffect } from "react";
import DashboardButton from "../components/DashboardButton";
import * as Yup from "yup";
import { BiError } from "react-icons/bi";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";
import errors from "utils/firebase_auth_errors";
import * as Sentry from "@sentry/browser";
import MD5 from "crypto-js/md5";
import PhoneInput from "react-phone-input-2";
import ModalNoSignUp from "Components/ModalNoSignUp";
import "react-phone-input-2/lib/style.css";
export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.props.userProfile) return serverRedirect("/dashboard");

  return {
    props: {
      auth,
    },
  };
};

const SignUp = () => {
  const [formData, updateFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [isChecked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setLoading] = useState("idle");
  const validationSchema = Yup.object({

    email: Yup.string().email().required(),
    password: Yup.string().required("Le mot de passe est requis"),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    ),
  });
  useEffect(()=>{
    if (typeof window !== 'undefined') {
      setBooking(JSON.parse(
        localStorage.getItem("bookBooklinik")
      ));
    }
  },[])


  function doSignUp() {
    const { email, password, confirmPassword, phoneNumber } = formData;

    setLoading("loading");

    if (password != confirmPassword) {
      setLoading("idle");
      return setError("Les mots de passe ne correspondent pas.");
    }

    if (phoneNumber.trim() === "") {
      setLoading("idle");
      return setError("Le numéro de téléphone ne doit pas être vide");
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // update current user
        var user = userCredential.user;

        // update firestore
        var firestoreUserObject = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (firestoreUserObject.exists) {
          const userData = firestoreUserObject.data();
        } else {
          const userData = {
            acceptsMarketing: isChecked,
            address: null,
            birthdate: null,
            email: email,
            firstName: null,
            landlinePhone: null,
            lastname: null,
            mobilePhone: phoneNumber,
            isMobileVerified: false,
            role: "guest",
            referalCode: `${email.split("@")[0].substring(0, 5)}-${MD5(
              Math.random().toString()
            )
              .toString()
              .substring(0, 5)}`,
            signupDate: new Date().toUTCString(),
            referalBalance: 0,
          };

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set(userData)
            .then((docRef) => {
              // send confirmation email
              fetch("/api/mail", {
                method: "POST",
                body: JSON.stringify({
                  recipient: email,
                  templateId: "d-51683413333641cc9bd64848bda8fa19",
                }),
              });

              // if user have't login and do book
              if (router.query.i === "anonBooking") {
                const booking = JSON.parse(
                  localStorage.getItem("bookBooklinik")
                );

                 const totalPrice =
                Number(booking.surgeries[0].surgeryPrice) +
                Number(booking.totalExtraTravellersPrice) +
                booking.options
                  ?.map((option) => option.isChecked && Number(option.price))
                  .reduce((a, b) => a + b) +
                Number(booking.roomPrice) * Number(booking.totalSelectedNights);

                firebase
                  .firestore()
                  .collection("bookings")
                  .add({
                    user: user.uid,
                    status: "awaitingDocuments",
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
                  })
                  .then(() => {
                    fetch("/api/mail", {
                      method: "post",
                      body: JSON.stringify({
                        recipient: "info@booklinik.com",
                        templateId: "d-351874c7be9348778ef89f40ddfe8729",
                        dynamicTemplateData: {
                          booking: {
                            date: booking.created,
                            offerName: booking.offerName,
                            surgeryName: booking.surgeries[0].surgeryName,
                            surgeryCategoryName: booking.surgeries[0].surgeryCategoryName,
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            hotelName: booking.hotelName,
                            total:totalPrice,
                            totalSelectedNights: booking.totalSelectedNights,
                            room: booking.room,
                            city: booking.city,
                          },
                        },
                      }),
                    });
                  })
                  .then(() => {
                    localStorage.removeItem("bookBooklinik");
                    router.push("/dashboard");
                  });
              } else {
                // redirect to dashboard
                router.push("/dashboard");
              }
            })
            .catch((error) => {
              Sentry.captureException(error);
              setError("Une erreur est survenue");
            });
        }

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
  }

  const doBookWithLogin=() => {
    router.push("/login");
    localStorage.setItem("bookBooklinik",
      localStorage.getItem("bookBooklinik")
    );
    return;
  }

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleCChange = () => {
    setChecked(!isChecked);
  };

  const handlePhoneNumber = (phone) => {
    updateFormData({
      ...formData,
      phoneNumber: `+${phone}`,
    });
  };

  const handleOnClose= () => {

    setShowModal(false);

  };



  return (
    <div className="h-screen relative signup">
      {console.log(booking)}
      <div className="nav top-0 absolute flex flex-row w-full justify-between z-50 p-10 bg-white shadow-lg">
        <Link href="/">
          <a>
            <Image src={Logo} alt="Booklinik" />
          </a>
        </Link>

        <div className="flex flex-row gap-1">
          <p>Vous avez déjà un compte ?</p>

            <a className="text-gray-700 hover:underline" onClick={doBookWithLogin}>Se connecter</a>

        </div>
      </div>
      <div className="grid grid-cols-10 h-full">
        <div className="flex items-center col-span-10 lg:col-span-6">
          <div className="mx-auto w-3/4 lg:w-1/2 space-y-6 mt-40 lg:mt-20">
            <h1 className="text-4xl">Bienvenue !</h1>
            {error && (
              <p className="text-red-500 flex items-center text-sm gap-1">
                <BiError />
                {error}
              </p>
            )}
            <p></p>
            <form
              className="flex flex-col w-full space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                doSignUp();
              }}
            >
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock"
              />
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                onChange={handleChange}
                value={formData.password}
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock focus:border-2"
              />
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="password"
              >
                Confirmation de mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                onChange={handleChange}
                value={formData.confirmPassword}
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock focus:border-2"
              />
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="password"
              >
                Numéro de téléphone
              </label>
              <PhoneInput
                country={"fr"}
                inputProps={{
                  required: true,
                }}
                value={formData.phoneNumber}
                onChange={(phone) => handlePhoneNumber(phone)}
              />
              <div className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  name="acceptsMarketing"
                  id="acceptsMarketing"
                  onChange={handleCChange}
                  checked={isChecked}
                  className="rounded-full"
                />
                <label htmlFor="acceptsMarketing" className="">
                  Recevoir les bons plans Booklinik
                </label>
              </div>
              <p className="text-xs text-gray-500">
                En créant mon compte je reconnais avoir lu et accepté les
                Conditions Générales de Vente et les Conditions Générales
                d&apos;Utilisation, et je confirme être âgé d&apos;au moins 18
                ans.
              </p>
              <div className="flex flex-row justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Vous avez déjà un compte ?
                  </p>
                  <Link href="/login">
                    <a className="text-sm text-gray-500 transition hover:underline">
                      Se connecter
                    </a>
                  </Link>
                </div>

              </div>
              <div className="grid grid-cols-1 lg:flex lg:flex-row lg:gap-3 grid justify-items-center">


                            <DashboardButton
                                  defaultText="S'inscrire"
                                  status={isLoading}
                                ></DashboardButton>



            <div className="flex gap-3 pt-6 ">
         {   booking?( <button
                  type="submit"
                  onClick={()=>setShowModal(true)}
                  className={`min-w-max transition px-4  py-3 lg:px-10 rounded border border-shamrock bg-shamrock text-white && "hover:text-shamrock group hover:bg-white"`}
                  >Continuer sans inscription
                  </button>):("")
           }     

              </div>



                </div>

            </form>

          </div>

        </div>

        <div className="relative hidden col-span-4 lg:block">
          {console.log(booking)}
          <Image
            src={SideBanner}
            layout="fill"
            objectFit="cover"
            className="h-full"
            alt=""
          />

        </div>
        {booking?(  <ModalNoSignUp onClose={handleOnClose} visible={showModal} booking={booking} />):""}

      </div>

    </div>
  );
};

export default SignUp;
