import Link from "next/link";
import Logo from "../public/booklinik-logo.svg";
import Image from "next/image";
import SideBanner from "../public/assets/login.jpeg";
import firebase from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useState,useContext } from "react";
import { BookContext } from "utils/bookContext";
import { BiError } from "react-icons/bi";
import DashboardButton from "../components/DashboardButton";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";
import errors from "utils/firebase_auth_errors";
import * as Sentry from "@sentry/browser";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.props.userProfile) return serverRedirect("/dashboard");

  return {
    props: {
      auth,
    },
  };
};

const Login = () => {
  const [formData, updateFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  const { isChecked, handleUseReferral } = useContext(BookContext);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState("idle");
  const [booking, setBooking] = useState(null || JSON.parse(
    localStorage.getItem("bookBooklinik")
  ));

  
  function doLogIn() {
    const { email, password } = formData;
    setLoading("loading");
    
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        var user = userCredential.user;
        var firestoreUserObject = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();
    
        
     
        const userData = firestoreUserObject.data();
     
       
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
                recipient:  user.email,
                templateId: "d-b504c563b53846fbadb0a53151a82d57",
              }),
            });
           
            if(booking){
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
              }
            
          })
        
        
     
    
      // redirect to dashboard
       router.push("/dashboard");
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

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  return (
    <div className="h-screen relative">
      <div className="nav top-0 absolute flex w-full justify-between z-50 p-10 bg-white shadow-lg space-x-12 items-center">
        <Link href="/">
          <a>
            <Image src={Logo} alt="Booklinik" />
          </a>
        </Link>

        <div className="flex flex-col md:flex-row gap-1 items-end">
          <p className="text-right">Pas encore de compte ?</p>
          <Link href="/signup">
            <a className="text-gray-700 hover:underline">S&apos;inscrire</a>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-10 h-full">
        <div className="flex items-center col-span-10 lg:col-span-6">
          {console.log(booking)}
          <div className="mx-auto w-2/3 md:w-1/2 space-y-6">
            <h1 className="text-4xl">Bonjour !</h1>
            {error && (
              <p className="text-red-500 flex items-center text-sm gap-1">
                <BiError />
                {error}
              </p>
            )}
            <form
              className="flex flex-col w-full space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                doLogIn();
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
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock focus:border-2"
              />
              <Link href="/reset-password">
                <a className="text-bali text-sm hover:underline">
                  Mot de passe oublié ?
                </a>
              </Link>
              <div className="flex flex-col md:flex-row w-full justify-between space-y-4">
                <div className="hidden md:block">
                  <p className="text-sm text-gray-700">
                    Vous n&apos;avez pas encore de compte ?
                  </p>
                  <Link href="/signup">
                    <a className="text-sm text-gray-500 transition hover:underline">
                      S&apos;inscrire
                    </a>
                  </Link>
                </div>
                <div>
                  <DashboardButton
                    defaultText="Se&nbsp;connecter"
                    status={isLoading}
                    className="w-full"
                  ></DashboardButton>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="relative hidden col-span-4 lg:block">
          <Image
            src={SideBanner}
            layout="fill"
            objectFit="cover"
            className="h-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
