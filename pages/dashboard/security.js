import DashboardUi from "components/DashboardUi";
import DashboardInput from "components/DashboardInput";
import { checkAuth } from "utils/ServerHelpers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import firebase from "../../firebase/clientApp";
import DashboardButton from "Components/DashboardButton";
import { useAuthState } from "react-firebase-hooks/auth";

export const getServerSideProps = checkAuth;

const PasswordAndEmail = ({ userProfile, token }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(firebase.auth());
  const [profile, setProfile] = useState(userProfile);
  const [authObjectLoad, setAuthObjectLoad] = useState(false);

  const [isEmailLoading, setEmailLoading] = useState("idle");
  const [isPasswordLoading, setPasswordLoading] = useState("idle");

  const [newEmail, setNewEmail] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    passwordConfirmation: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
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

  const updateEmail = (e) => {
    e.preventDefault();

    setEmailLoading("loading");
    const emailIsValid = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (emailIsValid(newEmail)) {
      user
        .updateEmail(newEmail)
        .then((e) => {
          toast.success("E-mail mis à jour");
        })
        .catch((e) => {
          if (e.code === "auth/requires-recent-login") {
            toast.warn("Veuillez vous reconnecter.");
            firebase
              .auth()
              .signOut()
              .then(() => {
                router.push("/login");
              });
          } else if (e.code === "auth/invalid-email") {
            toast.error("L'email n'est pas correct !");
          } else {
            toast.error("Une erreur est survenue");
          }
        })

        .finally(() => setEmailLoading(false));
    } else {
      toast.error("L'email n'est pas correct !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setPasswordLoading("loading");

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      passwords.oldPassword
    );

    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        if (passwords.newPassword === passwords.passwordConfirmation) {
          firebase
            .auth()
            .currentUser.updatePassword(passwords.newPassword)
            .then(() => {
              toast.success("Mot de passe mis à jour");
            })
            .catch((e) => {
              toast.error("Une erreur est survenue");
            });
        } else {
          toast.error("Les deux mots de passe ne correspondent pas");
        }
      })
      .catch((e) => {
        if (e.code === "auth/wrong-password") {
          toast.error("Mot de passe incorrect");
        } else {
          toast.error("Une erreur est survenue");
        }
      })
      .finally(() => {
        setPasswordLoading(false);
      });
  };

  const handlePasswordUpdate = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    user?.email && setAuthObjectLoad(true);
  }, [firebase.auth().currentUser]);

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Email et mot de passe</h1>
        <p>
          Velit proident elit consectetur tempor excepteur Lorem consequat
          nostrud qui et in sit labore. Amet non ut sit laboris pariatur nisi
          culpa nulla dolor ad excepteur nulla consectetur. Proident amet
          ullamco quis ut reprehenderit culpa cillum et irure Lorem.
        </p>
        {authObjectLoad && (
          <>
            <h2 className="text-2xl">Adresse e-mail</h2>
            <div>
              <form className="grid grid-cols-12 gap-4" onSubmit={updateEmail}>
                <DashboardInput
                  type="email"
                  name="currentEmail"
                  value={user?.email}
                  disabled
                  label="Adresse e-mail actuel"
                />
                <DashboardInput
                  type="email"
                  name="newEmail"
                  required
                  label="Nouvelle adresse email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <DashboardButton
                  defaultText="Changer mon adresse mail"
                  status={isEmailLoading}
                />
              </form>
            </div>
            <h2 className="text-2xl">Mot de passe</h2>
            <div>
              <form
                className="grid grid-cols-12 gap-4"
                onSubmit={updatePassword}
              >
                <DashboardInput
                  type="password"
                  name="oldPassword"
                  required
                  label="Ancien mot de passe"
                  value={passwords.oldPassword}
                  onChange={handlePasswordUpdate}
                />
                <br />
                <DashboardInput
                  type="password"
                  name="newPassword"
                  required
                  label="Nouveau mot de passe"
                  value={passwords.newPassword}
                  onChange={handlePasswordUpdate}
                />
                <DashboardInput
                  type="password"
                  name="passwordConfirmation"
                  required
                  label="Confirmer le mot de passe"
                  value={passwords.passwordConfirmation}
                  onChange={handlePasswordUpdate}
                />
                <DashboardButton
                  defaultText="Changer mon mot de passe"
                  status={isPasswordLoading}
                />
              </form>
            </div>
          </>
        )}
      </div>
    </DashboardUi>
  );
};

export default PasswordAndEmail;
