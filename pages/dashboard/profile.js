import DashboardUi from "../../components/DashboardUi";
import DashboardInput from "../../components/DashboardInput";
import { checkAuth } from "../../utils/ServerHelpers";
import ProfileSelect from "../../components/ProfileSelect";
import DashboardButton from "../../components/DashboardButton";
import { useState } from "react";
import { formatDate } from "../../utils/ClientHelpers";
import firebase from "../../firebase/clientApp";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import DashboardModal from "components/DashboardModal";

export const getServerSideProps = checkAuth;

const genderOptions = [
  { value: "man", label: "Homme" },
  { value: "woman", label: "Femme" },
];

const ProfilePage = ({ userProfile, token }) => {
  const [isLoading, setLoading] = useState("idle");
  const [profile, setProfile] = useState(userProfile);
  const router = useRouter();

  // get error code in url
  const errorCode = router.query.error;

  // get verificationStatus in url
  const verificationStatus = router.query.vs;

  // is phone number verified
  const [isPhoneVerified, setPhoneVerified] = useState(
    profile.isMobileVerified || false
  );

  // is there a phone number
  const [hasPhoneNumber, setHasPhoneNumber] = useState(profile.mobilePhone);

  // has phone number changed
  const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);

  const handleChange = (e) => {
    // if user is updating his phone number, set isMobileVerified to false
    if (e.target.name === "mobilePhone") {
      setPhoneNumberChanged(true);
    }

    setProfile({
      ...profile,

      // Trimming any whitespace
      [e.target.name]: e.target.value,
    });
  };

  function doUpdate() {
    setLoading("loading");

    firebase
      .firestore()
      .collection("users")
      .doc(token.uid)
      .update({
        ...profile,
        isMobileVerified: phoneNumberChanged ? false : isPhoneVerified,
      })
      .then(() => {
        toast.success("Informations mises à jour");
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1500);
        router.push(`/dashboard`);
        // refresh getServerSideProps without reloading page
      //  router.reload();
      })
      .catch((error) => {
        toast.error("Erreur lors de la mise à jour");
        setLoading("idle");
      })
      .finally(setLoading("idle"));
  }

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Informations personnelles</h1>
        <p>Renseignez vos informations personnelles.</p>

        {errorCode === "mpn" && !profile.mobilePhone && (
          <DashboardModal
            type="error"
            content="Vous devez renseigner votre numéro de téléphone pour pouvoir réserver"
          />
        )}
        {verificationStatus === "1" && profile.isMobileVerified && (
          <DashboardModal
            type="success"
            content="Votre numéro de téléphone a été vérifié avec succès"
            cta="Je réserve mon opération"
            target="/book"
          />
        )}
        {!profile.isMobileVerified && (
          <DashboardModal
            type="error"
            content="Votre numéro de téléphone n'est pas vérifié"
          />
        )}
        <div>
          <form
            className="grid grid-cols-12 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              doUpdate();
            }}
          >
            <DashboardInput
              type="text"
              name="firstName"
              value={profile.firstName ?? ""}
              onChange={handleChange}
              autoComplete="first-name"
              label="Prénom"
            />
            <DashboardInput
              type="text"
              name="lastName"
              value={profile.lastName ?? ""}
              onChange={handleChange}
              autoComplete="last-name"
              label="Nom de famille"
            />
            <DashboardInput
              type="date"
              name="birthdate"
              value={formatDate(profile.birthdate) ?? ""}
              onChange={handleChange}
              autoComplete="bday"
              label="Date de naissance"
            />
            <ProfileSelect
              label="Sexe"
              name="gender"
              options={genderOptions}
              value={profile.gender}
              onChange={handleChange}
            />
            <div className="col-span-12 flex-grow md:col-span-6 flex flex-col gap-2">
              <DashboardInput
                type="tel"
                name="mobilePhone"
                value={profile.mobilePhone}
                onChange={handleChange}
                autoComplete="bday"
                placeholder="Numéro de téléphone"
                label={
                  errorCode === "mpn" ? (
                    <span className="text-red-500">Numéro de téléphone</span>
                  ) : (
                    "Numéro de téléphone"
                  )
                }
                className={`${
                  errorCode === "mpn" && !profile.mobilePhone
                    ? "border-red-500"
                    : ""
                }`}
              />
              {!isPhoneVerified && hasPhoneNumber && (
                <button
                  type="button"
                  className="hover:underline py-1 rounded max-w-max text-sm text-shamrock"
                  onClick={() => {
                    setLoading("loading");
                    router.push("/verify/mobile");
                  }}
                >
                  Vérifier mon numéro de téléphone
                </button>
              )}
            </div>
            <DashboardInput
              type="tel"
              name="landlinePhone"
              value={profile.landlinePhone}
              onChange={handleChange}
              autoComplete="tel-local"
              label="Téléphone fixe"
            />
            <DashboardInput
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              autoComplete="tel-local"
              label="Adresse postale"
            />
            <DashboardInput
              type="text"
              name="referalCode"
              value={profile.referalCode}
              onChange={handleChange}
              label="Modifier votre code parrainage"
            />
            <DashboardButton
              defaultText="Sauvegarder mes informations"
              status={isLoading}
            ></DashboardButton>
          </form>
        </div>
      </div>
    </DashboardUi>
  );
};

export default ProfilePage;
