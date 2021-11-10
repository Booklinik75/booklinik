import DashboardUi from "../../components/DashboardUi";
import DashboardInput from "../../components/DashboardInput";
import { checkAuth } from "../../utils/ServerHelpers";
import ProfileSelect from "../../components/ProfileSelect";
import DashboardButton from "../../components/DashboardButton";
import { useState } from "react";
import { formatDate } from "../../utils/ClientHelpers";
import firebase from "../../firebase/clientApp";

export const getServerSideProps = checkAuth;

const genderOptions = [
  { value: "man", label: "Homme" },
  { value: "woman", label: "Femme" },
];

const ProfilePage = ({ userProfile, token }) => {
  const [isLoading, setLoading] = useState("idle");
  const [profile, setProfile] = useState(userProfile);

  const handleChange = (e) => {
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
      .update(profile)
      .finally(setLoading("idle"));
  }

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Informations personnelles</h1>
        <p>Renseignez vos informations personnelles.</p>
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
            <DashboardInput
              type="tel"
              name="mobilePhone"
              value={profile.mobilePhone}
              onChange={handleChange}
              autoComplete="bday"
              label="Téléphone mobile"
            />
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
              name="referer"
              value={profile.referer ?? ""}
              onChange={handleChange}
              label="Code de parrainage"
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
