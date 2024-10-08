import { useState } from "react";
import Link from "next/link";
import Logo from "public/booklinik-logo.svg";
import Image from "next/image";
import SideBanner from "public/assets/login.jpeg";
import firebase from "firebase/clientApp";
import { firebaseAdmin } from "firebase/clientAdmin";
import { FaCheck } from "react-icons/fa";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";
import moment from "moment";
import DashboardButton from "components/DashboardButton";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) {
    return auth;
  }

  let booking = {};
  const { id, success, session_id, canceled } = ctx.query;

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

  // to get all names surgeries
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

  // to get all names surgeries category
  const surgeryCategoriesName = () => {
    const surgeryNameCategories = [];
    booking.surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length > 1) {
      let uniqueCategories = [...new Set(surgeryNameCategories)];
      return uniqueCategories.join(", ");
    } else {
      return surgeryNameCategories[0];
    }
  };

  const stripeSession = await fetch(
    `${process.env.ABSOLUTE_URL_ORIGIN}/api/retrieve_stripe_session/${session_id}`,
    {
      method: "get",
    }
  )
    .then(async (res) => {
      if (booking.status === "validated")
        return serverRedirect(`/dashboard/operations/${booking.id}`);
      if (!res.ok) return {};

      const stripeRes = await res.json();

      firebaseAdmin
        .firestore()
        .collection("bookings")
        .doc(booking.id)
        .update({ status: "validated", stripeSession: session_id })
        .then(async () => {
          await fetch(`${process.env.ABSOLUTE_URL_ORIGIN}/api/mail`, {
            method: "post",
            body: JSON.stringify({
              recipient: stripeRes.customer_details.email,
              templateId: "d-b6f63445f1d547ffa59e05e0e8d47dbd",
              dynamicTemplateData: {
                booking: {
                  id: booking.id,
                  surgeryName: surgeriesName(),
                  surgeryCategoryName: surgeryCategoriesName(),
                  link: `https://${process.env.ABSOLUTE_URL_ORIGIN}/dashboard/operations/${booking.id}`,
                },
                payment: {
                  total: Number(stripeRes.amount_total) / 100,
                  date: moment(new Date()).format("llll"),
                  status: "Payé",
                },
              },
            }),
          });

          if (auth.props.userProfile.referer) {
            firebase
              .firestore()
              .collection("users")
              .doc(auth.props.userProfile.referer)
              .get()
              .then((docRef) => {
                let paids = [];
                firebase
                  .firestore()
                  .collection("bookings")
                  .where("user", "==", auth.props.token.user_id)
                  .get()
                  .then((querySnapshot) => {
                    if (querySnapshot.docs.length) {
                      querySnapshot.docs.map(async (booking) => {
                        if (booking.data().status === "validated") {
                          paids.push(booking.data());
                        }
                      });
                    }

                    if (paids.length === 1) {
                      firebaseAdmin
                        .firestore()
                        .collection("users")
                        .doc(docRef.id)
                        .update({
                          referalBalance: docRef.data().referalBalance + 100,
                        })
                        .catch((err) => {
                          console.log("err", err);
                        });
                    }
                  });
              });
          }
        });

      return stripeRes;
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw err;
      return {};
    });

  if (stripeSession.redirect) return stripeSession;

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

  const stripeArgs = {
    success: success || null,
    session_id: session_id || null,
    canceled: canceled || null,
  };

  if (booking.status !== "awaitingPayment") return serverRedirect("/404");

  booking.totalTravellers =
    1 + booking.extraBabies + booking.extraChilds + booking.extraTravellers;

  return {
    props: { auth, booking, stripeArgs, stripeSession },
  };
};

const Checkout = ({ booking, stripeArgs, auth, stripeSession }) => {
  // promo code state
  const [promoCode, setPromoCode] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState(false);
  const { userProfile, token } = auth.props;

  // to get all names surgeries
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

  // to get all names surgeries category
  const surgeryCategoriesName = () => {
    const surgeryNameCategories = [];
    booking.surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length > 1) {
      let uniqueCategories = [...new Set(surgeryNameCategories)];
      return uniqueCategories.join(", ");
    } else {
      return surgeryNameCategories[0];
    }
  };

  const initiatePayment = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );

    const body = {};

    fetch("/api/checkout_sessions", {
      method: "post",
      body: JSON.stringify({
        price: booking.alternativeTotal
          ? booking.alternativeTotal
          : booking.total,
        product: surgeriesName(),
        image: booking.hotelPhotoLink,
        id: booking.id,
        promoCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => stripe.redirectToCheckout({ sessionId: data.id }));
  };

  return (
    <div className="h-screen relative">
      <div className="nav top-0 absolute flex flex-row w-full justify-between z-50 p-10 bg-white shadow-lg">
        <Link href="/">
          <a>
            <Image src={Logo} alt="Booklinik" />
          </a>
        </Link>
        {stripeSession.payment_status === "paid" && (
          <Link href={`/dashboard/operations/${booking.id}`}>
            <a className="border-2 border-shamrock rounded px-6 py-3 text-shamrock hover:cursor-pointer hover:bg-shamrock hover:text-white transition">
              Voir ma réservation
            </a>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-10 h-full">
        <div className="flex items-center col-span-10 lg:col-span-6">
          <div className="mx-auto w-1/2 space-y-6">
            <div className="w-full h-48 rounded relative overflow-hidden shadow-lg">
              <Image
                src={booking.hotelPhotoLink}
                layout="fill"
                objectFit="cover"
                alt=""
              />
            </div>
            {stripeArgs.canceled === "true" && (
              <div className="w-full p-4 bg-yellow-100 border-yellow-500 rounded">
                <p className="text-yellow-700">
                  Votre paiement a bien été annulé.
                </p>
              </div>
            )}
            <div>
              <h1 className="text-4xl text-shamrock">
                Règlement de votre opération
              </h1>
              <p className="text-sm uppercase text-gray-400 flex gap-1">
                Besoin d&apos;aide ? Appelez nous au
                <Link href="tel:0186653500">
                  <a className="hover:text-shamrock transition-colors">
                    01 86 65 35 00
                  </a>
                </Link>
              </p>
            </div>

            <div className="w-full flex gap-2 flex-col">
              <p className="text-xl font-bold">Résumé</p>
              <p>
                {surgeryCategoriesName()}, {surgeriesName()}
              </p>
              <p>
                À <span className="capitalize">{booking.city}</span>, du{" "}
                {moment(booking.startDate).format("DD[/]MM[/]YY")} au{" "}
                {moment(booking.endDate).format("DD[/]MM[/]YY")}{" "}
              </p>
              <p>{`${booking.totalTravellers} voyageur${
                Number(booking.totalTravellers) > 1 ? "s" : ""
              }`}</p>
              {!promoCodeInput && (
                <button
                  onClick={() => {
                    setPromoCodeInput(true);
                  }}
                  className="transition-colors hover:text-shamrock w-max mt-3 text-gray-500"
                >
                  Vous avez un code promotionnel ?
                </button>
              )}
              {promoCodeInput && (
                <div className="w-full mt-3">
                  <input
                    className="w-full p-2 border-2 border-shamrock rounded"
                    type="text"
                    placeholder="Code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setPromoCodeInput(false);
                    }}
                    className="transition-colors hover:text-shamrock w-max mt-3 text-gray-500"
                  >
                    Annuler
                  </button>
                </div>
              )}
              <hr className="border-gray-900" />
              <div className="flex w-full justify-between gap-4 text-xl text-bali mb-4">
                <p className="font-bold ">Total</p>
                <p>
                  {booking.alternativeTotal
                    ? booking.alternativeTotal
                    : booking.total}
                  &nbsp;€
                </p>
              </div>
              {stripeSession &&
                Object.keys(stripeSession).length === 0 &&
                Object.getPrototypeOf(stripeSession) === Object.prototype && (
                  <>
                    <DashboardButton
                      isPayment
                      defaultText="Payer par carte bancaire"
                      onClick={initiatePayment}
                    />
                    <div className="text-center">
                      <p className="text-xs text-gray-400">
                        Règlement en ligne via Stripe — 100% sécurisé
                      </p>
                    </div>
                  </>
                )}
              {stripeSession.payment_status === "paid" && (
                <>
                  <div className="w-full p-4 bg-green-50 border-green-500 rounded">
                    <p className="text-shamrock text-center flex items-center justify-center gap-2">
                      <FaCheck /> Votre paiement a bien été effectué.
                    </p>
                  </div>
                  <p className="text-sm text-gray-60 text-center">
                    Un email de confirmation a été envoyé à{" "}
                    <span className="font-bold">
                      {stripeSession.customer_details.email}
                    </span>
                    .
                  </p>
                </>
              )}
            </div>
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

export default Checkout;
