import { useEffect, useState } from "react";
import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";
import { firebaseAdmin } from "firebase/clientAdmin";
import firebase from "firebase/clientApp";
import Link from "next/link";
import { SiFirebase } from "react-icons/si";
import { FaUserAlt, FaCalendar, FaPlus } from "react-icons/fa";
import moment from "moment";
import DashboardOperationCard from "components/DashboardOperationCard";
import Dropdown from "react-dropdown";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) return auth;
  const { id } = ctx.query;

  let user = {};
  let userBookings = [];

  await firebaseAdmin
    .auth()
    .getUser(id)
    .then(async (userRecord) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .get()
        .then((userData) => {
          user = {
            auth: {
              uid: userRecord.uid,
              email: userRecord.email,
              emailVerified: userRecord.emailVerified,
              creationTime: userRecord.metadata.creationTime,
              lastSignInTime: userRecord.metadata.lastSignInTime,
              lastRefreshTime: userRecord.metadata.lastRefreshTime,
            },
            details: { ...userData.data() },
          };
        });

      await firebase
        .firestore()
        .collection("bookings")
        .where("user", "==", userRecord.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userBookings.push({ ...doc.data(), id: doc.id });
          });
        });
    });

  let medicalQuestions = [];
  await firebase
    .firestore()
    .collection("medicalQuestions")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        medicalQuestions.push({ ...doc.data(), id: doc.id });
      });
    });
  let queestiosnAnswered = {};
  await firebase
    .firestore()
    .collection("medicalAnswers")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === id) {
          console.log("asd", doc.data());
          queestiosnAnswered = { ...doc.data(), id: doc.id };
        }
      });
    })
    .catch((err) => {});

  userBookings.map((userBooking) => {
    userBooking.startDate =
      typeof userBooking.startDate === "string"
        ? userBooking.startDate
        : new Date(userBooking.startDate.toDate()).toString();
    userBooking.endDate =
      typeof userBooking.endDate === "string"
        ? userBooking.endDate
        : new Date(userBooking.endDate.toDate()).toString();
    userBooking.created = userBooking.created
      ? typeof userBooking.created === "string"
        ? userBooking.created
        : new Date(userBooking?.created?.toDate()).toString()
      : "";
  });

  return {
    props: {
      auth,
      user,
      queestiosnAnswered,
      medicalQuestions,
      userBookings,
    },
  };
};

const Customer = ({
  auth,
  user,
  queestiosnAnswered,
  medicalQuestions,
  userBookings,
}) => {
  const router = useRouter();

  const roleOptions = [
    { value: "sales", label: "Commercial/sales" },
    { value: "guest", label: "Guest/invité" },
  ];

  if (auth.props.userProfile.role === "admin")
    roleOptions.push({ value: "admin", label: "Administrateur" });

  const [role, setRole] = useState(
    roleOptions.filter((r) => r.value === user.details.role)[0]
  );

  console.log(queestiosnAnswered);

  useEffect(() => {
    if (
      user.details.role === "admin" &&
      auth.props.userProfile.role !== "admin"
    )
      return;

    if (role?.value !== user.details.role) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.auth.uid)
        .update({ role: role.value })
        .then(() => {
          toast.success("Rôle mis à jour");
          router.replace(router.asPath);
        })
        .catch(() => {});
    }
  }, [role]);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6">
        <p className="bg-gray-200 mb-2 font-mono text-red-900 text-xs p-2 rounded max-w-max">
          {user.auth.uid}
        </p>
        <h1 className="text-4xl flex mb-2">
          {!user.details.firstName || !user.details.lastName
            ? user.auth.email
            : `${user.details.firstName} ${user.details.lastName}`}
        </h1>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase text-gray-600 mt-4">
              Sélectionner un rôle
              <Dropdown
                options={roleOptions}
                placeholder="Sélectionnez un role"
                value={role}
                onChange={(e) => {
                  setRole(e);
                }}
                className="max-w-max"
              />
            </p>
          </div>
          <div>
            <h2 className="text-2xl flex items-center gap-1 mb-2">
              <SiFirebase size={20} style={{ color: "#F2A43A" }} /> Firebase
              Authentication
            </h2>
            <p>
              <span className="font-bold">E-mail : </span> {user.auth.email} (
              {user.auth.emailVerified ? "Vérifié" : "Non-vérifié"})
            </p>
            <p>
              <span className="font-bold">Date de création :</span>{" "}
              {moment(user.auth.creationTime).format("ll [à] LT")}
            </p>
            <p>
              <span className="font-bold">Dernière mise à jour :</span>{" "}
              {moment(user.auth.lastRefreshTime).format("ll [à] LT")}
            </p>
            <p>
              <span className="font-bold">Dernière connexion :</span>{" "}
              {moment(user.auth.lastSignInTime).format("ll [à] LT")}
            </p>
            <p>
              <span className="font-bold">Unique ID :</span> {user.auth.uid}
            </p>
          </div>
          <div>
            <h2 className="text-2xl flex items-center gap-1 mb-2">
              <FaUserAlt size={20} className="text-shamrock" /> Détails
            </h2>
            <p>
              <span className="font-bold">Adresse : </span>{" "}
              {user.details.address || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Date de naissance :</span>{" "}
              {(user.details.birthdate &&
                moment(user.details.birthdate).format("ll")) || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Genre :</span>{" "}
              {user.details.gender || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Téléphone fixe :</span>{" "}
              {user.details.landlinePhone || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Téléphone mobile :</span>{" "}
              {user.details.mobilePhone || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Référant :</span>{" "}
              {user.details.referer || (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Role :</span>{" "}
              {user.details.role || <span className="text-gray-400">null</span>}
            </p>
          </div>
          <div>
            <h2 className="text-2xl flex items-center gap-1 mb-2">
              <FaCalendar size={20} className="text-blue-600" /> Réservations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {userBookings.length > 0 ? (
                userBookings.map((booking) => {
                  return (
                    <Link
                      key={booking.id}
                      href={`/dashboard/sales/reservations/${booking.id}`}
                    >
                      <a className="hover:bg-gray-100 rounded">
                        <div className="col-span-1">
                          <DashboardOperationCard
                            booking={booking}
                            salesMode
                            withId
                          />
                        </div>
                      </a>
                    </Link>
                  );
                })
              ) : (
                <span className="text-gray-400">Aucune réservation</span>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl flex items-center gap-1 mb-2">
              <FaPlus size={20} className="text-red-600" /> Médicales
            </h2>
            <p>
              <span className="font-bold">Poids :</span>{" "}
              {queestiosnAnswered.weight ? (
                `${queestiosnAnswered.weight} kg`
              ) : (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <p>
              <span className="font-bold">Taille :</span>{" "}
              {queestiosnAnswered.height ? (
                `${queestiosnAnswered.height} cm`
              ) : (
                <span className="text-gray-400">null</span>
              )}
            </p>
            <>
              {medicalQuestions.length > 0 ? (
                medicalQuestions.map((medicalQuestion) => (
                  <p key={medicalQuestion.id}>
                    <span className="font-bold">
                      {medicalQuestion.questionContent.includes("?")
                        ? medicalQuestion.questionContent.split("?")[0]
                        : medicalQuestion.questionContent}{" "}
                      :
                    </span>{" "}
                    {typeof queestiosnAnswered.answers === "undefined" ? (
                      <span className="text-gray-400">null</span>
                    ) : typeof queestiosnAnswered.answers[
                        medicalQuestion.id
                      ] !== "undefined" ? (
                      queestiosnAnswered.answers[medicalQuestion.id][
                        `${medicalQuestion.id}_value`
                      ] ? (
                        "Oui"
                      ) : (
                        "Non" || <span className="text-gray-400">null</span>
                      )
                    ) : (
                      <span className="text-gray-400">null</span>
                    )}
                  </p>
                ))
              ) : (
                <span className="text-gray-400">Aucune réponse médicale</span>
              )}
            </>
          </div>
        </div>
      </div>
    </DashboardUi>
  );
};

export default Customer;
