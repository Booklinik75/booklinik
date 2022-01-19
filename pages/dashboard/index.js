import DashboardUi from "components/DashboardUi";
import DashboardModal from "../../components/DashboardModal";
import DashboardOperationCard from "../../components/DashboardOperationCard";
import Link from "next/link";
import { checkAuth } from "../../utils/ServerHelpers";
import firebase from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "components/Loader";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/browser";
import moment from "moment";
import { useRouter } from "next/router";

export const getServerSideProps = checkAuth;

export default function DashboardIndex({ userProfile, token }) {
  const [user, loading] = useAuthState(firebase.auth());

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const asyncFunc = async () => {
      const entries = [];

      await firebase
        .firestore()
        .collection("bookings")
        .where("user", "==", token.uid)
        .get()
        .then((item) => {
          return item.forEach((doc) =>
            entries.push({
              id: doc.id,
              ...doc.data(),
            })
          );
        });

      setBookings(entries);
    };

    asyncFunc();
  }, []);

  const handleMessage = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("/api/mail", {
      method: "post",
      body: JSON.stringify({
        recipient: "info@booklinik.com",
        templateId: "d-6b9ed961cfdc44228824603584a8b740",
        dynamicTemplateData: {
          email: userProfile.email,
          datetime: moment(new Date()).format("LLLL"),
          message: message,
          path: router.asPath,
        },
      }),
    })
      .then(() => {
        setHasSubmitted(true);

        fetch("/api/mail", {
          method: "post",
          body: JSON.stringify({
            recipient: userProfile.email,
            templateId: "d-57cbc54b5ac345beb1bfc6509381ccee",
            dynamicTemplateData: {
              email: userProfile.email,
              datetime: moment(new Date()).format("LLLL"),
              message: message,
            },
          }),
        });
      })
      .catch((error) => {
        toast.error("Une erreur est survenue.");
        Sentry.captureException(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="h-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
          <DashboardUi userProfile={userProfile} token={token}>
            <div className="col-span-6 lg:col-span-4 flex flex-col gap-4">
              <h1 className="text-4xl">
                Bonjour{" "}
                <span className="text-shamrock">
                  {userProfile.firstName
                    ? userProfile.firstName
                    : userProfile.email}
                </span>
                ,
              </h1>
              <p>
                Bienvenue sur votre profil.
              </p>
              {!userProfile.isMobileVerified && (
                <DashboardModal
                  type="error"
                  content="Votre numéro de téléphone n'est pas vérifié"
                />
              )}
              {[
                userProfile.firstName,
                userProfile.lastName,
                userProfile.email,
                userProfile.address,
                userProfile.mobilePhone,
                userProfile.gender,
//                userProfile.landlinePhone,
                userProfile.birthdate,
              ].some((x) => x === null) ? (
                <DashboardModal
                  type="error"
                  content="Vous devez remplir vos informations"
                  cta="Compléter"
                  target="/dashboard/profile"
                />
              ) : (
                ""
              )}
              {bookings.some((b) => b.status === "awaitingDocuments") && (
                <DashboardModal
                  type="error"
                  content="Pour finaliser votre reservation, vous devrez ajouter des photos"
                  cta="Ajouter"
                  target="/dashboard/operations"
                />
              )}
              <div className="flex flex-col mt-4 gap-2">
                <p className="text-sm text-gray-700 uppercase">
                  Mes Opérations
                </p>

                {bookings !== [] &&
                  bookings.map((booking) => {
                    return (
                      <DashboardOperationCard
                        key={booking.id}
                        booking={booking}
                      />
                    );
                  })}
              </div>
            </div>
            <div className="col-span-6 lg:col-span-2 flex flex-col gap-6 ">
              <div className="w-full rounded border border-shamrock p-4 space-y-2">
                <h3 className="text-2xl">Parrainez un proche</h3>

                <p>
                  Recommandez Booklinik à vos amis et recevez 100€ sur votre
                  voyage. Vos amis profiteront aussi de 100€ sur leurs
                  opérations.
                </p>
                <p className="w-full bg-shamrock text-white uppercase font-2xl text-center py-3 rounded">
                  {userProfile.referalCode ? userProfile.referalCode : "null"}
                </p>
                <Link href="/dashboard/parrainage" className="w-full">
                  <a className="w-full block text-center text-gray-700 text-xs hover:underline">
                    Ajouter un code de parrainage
                  </a>
                </Link>
              </div>
              <div className="w-full rounded border border-gray-600 p-4 space-y-2">
                <h3 className="text-2xl">Assistance Booklinik</h3>
                <p>
                  Nous sommes à votre disposition si vous avez la moindre
                  question.
                </p>
                <p className="text-xs uppercase text-gray-700"></p>
                {hasSubmitted ? (
                  <p className="text-center text-gray-700 text-sm">
                    Votre message a bien été envoyé.
                  </p>
                ) : (
                  <>
                    <textarea
                      rows={3}
                      className="border-2 border-gray-300 bg-gray-100 p-3 w-full transition hover:border-bali focus:outline-none focus:border-shamrock rounded"
                      placeholder="J&lsquo;ai une question à propos de..."
                      value={message}
                      name="message"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="w-full text-bali transition hover:underline hover:text-shamrock"
                      type="submit"
                      onClick={handleMessage}
                      disabled={message === "" || isSubmitting === true}
                    >
                      Envoyer mon message
                    </button>
                  </>
                )}
              </div>
            </div>
          </DashboardUi>
        </>
      )}
    </div>
  );
}
