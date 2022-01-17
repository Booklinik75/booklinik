import DashboardUi from "components/DashboardUi";
import DashboardInput from "components/DashboardInput";
import { checkAuth } from "utils/ServerHelpers";
import DashboardButton from "components/DashboardButton";
import { useState } from "react";
import firebase from "firebase/clientApp";
import { useRouter } from "next/router";
import { FaCopy } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import DashboardModal from "Components/DashboardModal";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) {
    return auth;
  }

  let referer = null;

  if (auth.props.userProfile.referer) {
    await firebase
      .firestore()
      .collection("users")
      .doc(auth.props.userProfile.referer)
      .get()
      .then((docRef) => {
        referer = docRef.data();
      });
  }

  return {
    props: { auth, referer: referer || null },
  };
};

const Parrainage = ({ auth, referer }) => {
  const { userProfile, token } = auth.props;
  const [code, setCode] = useState(userProfile.refererCode || "");
  const [error, setError] = useState("");
  const router = useRouter();
  const [ref, setRef] = useState(referer);

  console.log("asdsda", userProfile);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code === userProfile.referalCode) {
      setCode("");
      setError("Vous ne pouvez pas utiliser votre propre code");
      return;
    }

    if (!userProfile.referer) {
      firebase
        .firestore()
        .collection("users")
        .where("referalCode", "==", code)
        .get()
        .then((docRef) =>
          docRef.forEach((doc) => {
            firebase
              .firestore()
              .collection("users")
              .doc(token.uid)
              .update({
                referer: doc.id,
                refererCode: code,
                referalBalance: userProfile.referalBalance + 100,
              })
              .then(() => {
                router.replace(router.asPath);
                setRef(doc.data());
              })
              .catch((err) => {});

            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({ referalBalance: doc.data().referalBalance + 100 });
          })
        );
    }
  };

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-10 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Parrainage</h1>
          <p className="px-6 py-3 bg-shamrock text-white rounded text-2xl">
            Solde : {userProfile.referalBalance} €
          </p>
        </div>
        {error && <DashboardModal type="error" content={error} />}
        <p>
          Recommandez Booklinik à vos amis et recevez 100€ sur votre voyage. Vos
          amis profiteront aussi de 100€ sur leurs opérations.
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase text-gray-500">
              Votre code de parrainage
            </p>
            <Tippy content="Cliquez pour copier">
              <p
                className="px-6 py-3 bg-shamrock text-white uppercase text-2xl text-center rounded max-w-max 
            transition hover:bg-shamrock/70 hover:cursor-pointer w-max flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    userProfile.referalCode ? userProfile.referalCode : ""
                  );
                }}
              >
                {userProfile.referalCode ? userProfile.referalCode : "null"}
                <FaCopy />
              </p>
            </Tippy>
          </div>
          <div className="-mt-3 flex flex-wrap gap-2">
            <FacebookShareButton
              url="https://www.booklinik.com"
              quote={`Profitez d'un bon d'achat de 100€ pour votre première réservation Booklinik avec mon code de parrainage: ${userProfile.referalCode}`}
              className="cursor-pointer"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url="https://www.booklinik.com"
              title={`Profitez d'un bon d'achat de 100€ pour votre première réservation Booklinik avec mon code de parrainage: ${userProfile.referalCode}`}
              className="cursor-pointer"
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <DashboardInput
                  className="w-[24rem] flex-grow-0"
                  label="Entrer le code promotionnel de votre parrain"
                  onChange={(e) => {
                    setCode(e.target.value.trim());
                  }}
                  disabled={userProfile.referer}
                  value={code}
                />
                <DashboardButton
                  defaultText="Valider"
                  className="max-w-max"
                  onClick={handleSubmit}
                  disabled={userProfile.referer}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-xs uppercase text-gray-500">Historique</p>
            {referer && (
              <>
                <p>Entrez le code promotionnel de votre parrain :</p>
                <p>
                  -{" "}
                  {referer.firstName && referer.lastName
                    ? `${referer.firstName} ${referer.lastName}`
                    : referer.email}{" "}
                  <span className="text-gray-400">
                    ({userProfile.refererCode})
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardUi>
  );
};

export default Parrainage;
