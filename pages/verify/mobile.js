import Logo from "public/booklinik-logo.svg";
import Image from "next/image";
import { checkAuth } from "utils/ServerHelpers";
import DashboardButton from "Components/DashboardButton";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import firebase from "firebase/clientApp";
import { toast } from "react-toastify";

export const getServerSideProps = checkAuth;

const VerifyPhone = ({ userProfile, token }) => {
  const [isLoading, setLoading] = useState("idle");
  const router = useRouter();
  const [verificationSID, setVerificationSID] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // if phone number is verified, redirect to dashboard
  if (userProfile.isMobileVerified) router.push("/dashboard");

  // if user is missing a phone number, redirect to profile page
  if (!userProfile.mobilePhone) router.push("/dashboard/profile?error=mpn");

  const initiateVerification = () => {
    setLoading("loading");

    fetch("/api/verify/send_text", {
      method: "POST",
      body: JSON.stringify({
        recipient: userProfile.mobilePhone,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          setLoading("success");

          // read the sid from the response and store it in state
          res.json().then((data) => {
            setVerificationSID(data.verificationSID);
          });
        }
      })
      .catch((err) => {
        // error toast
        toast.error("Une erreur est survenue, veuillez réessayer.");
      })
      .finally(() => {
        setLoading("idle");
      });
  };

  const verifyCode = () => {
    setLoading("loading");

    fetch("/api/verify/verify_code", {
      method: "POST",
      body: JSON.stringify({
        code: verificationCode,
        recipient: userProfile.mobilePhone,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // if result is "approved"
          res.json().then((data) => {
            if (data.status === "approved") {
              setVerificationSuccess(true);

              // update user profile
              firebase
                .firestore()
                .collection("users")
                .doc(token.uid)
                .update({
                  isMobileVerified: true,
                })
                .then(() => {
                  // redirect to dashboard
                  setLoading("done");
                  setTimeout(() => {
                    setLoading("idle");
                  }, 2000);
                  router.push("/dashboard/profile?vs=1");
                });
            } else {
              // error toast
              toast.error("Code invalide.");
            }
          });
        }
      })
      .catch((err) => {
        // error toast
        toast.error("Une erreur est survenue, veuillez réessayer.");
      })
      .finally(() => {
        setLoading("idle");
      });
  };

  return (
    <div className="max-w-lg h-screen mx-auto flex items-center justify-center">
      <div className="flex flex-col">
        <div className="w-full flex items-center justify-center my-4">
          <Image src={Logo} alt="Booklinik+ Logo" />
        </div>
        <div className="w-full flex items-center justify-center my-4">
          <h1 className="text-2xl text-shamrock">
            Vérifier mon numéro de téléphone
          </h1>
        </div>
        <div className="w-full flex items-center justify-center my-4 flex-col gap-8 text-center">
          <p>
            Afin de pouvoir continuer, veuillez vérifier votre numéro de
            téléphone. Vous recevrez un SMS contenant un code de vérification.
            Pour le recevoir, veuillez cliquer sur le bouton ci-dessous.
          </p>
          <div className="flex flex-col gap-2">
            {verificationSID && (
              <>
                <p className="text-shamrock">
                  Un code de vérification a été envoyé à{" "}
                  <strong>{userProfile.mobilePhone}</strong>.
                </p>
                <input
                  type="text"
                  name="verificationCode"
                  className="w-full px-4 py-2 border border-shamrock rounded"
                  placeholder="Code de vérification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </>
            )}
            <DashboardButton
              status={isLoading}
              onClick={() => {
                if (!verificationSID) initiateVerification();
                else verifyCode();
              }}
              defaultText={
                verificationSID
                  ? "Vérifier le code reçu"
                  : "Recevoir le code par SMS"
              }
              disabled={
                isLoading === "loading" ||
                (verificationSID && !verificationCode)
              }
            />
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">
                {`Vous recevrez un SMS au numéro suivant : ${userProfile.mobilePhone}`}
              </p>
              <p className="text-sm text-gray-400 hover:underline hover:text-gray-600 transition-colors">
                <Link href="/dashboard/profile">
                  <a>Modifier mon numéro de téléphone</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
