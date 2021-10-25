import DashboardUi from "../../components/DashboardUi";
import DashboardInput from "../../components/DashboardInput";
import { checkAuth } from "../../utils/ServerHelpers";
import ProfileSelect from "../../components/ProfileSelect";
import DashboardButton from "../../components/DashboardButton";
import { useState } from "react";
import { formatDate } from "../../utils/ClientHelpers";
import firebase from "firebase/clientApp";
import { useRouter } from "next/router";

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
    props: { auth, referer },
  };
};

const Parrainage = ({ auth, referer }) => {
  const { userProfile, token } = auth.props;
  const [code, setCode] = useState(userProfile.refererCode || "");
  const router = useRouter();
  const [ref, setRef] = useState(referer);

  const handleSubmit = (e) => {
    e.preventDefault();

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
              .catch((err) => console.log(err));

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
        <p>
          Recommandez Booklinik à vos amis et recevez 100€ sur votre voyage. Vos
          amis profiteront aussi de 100€ sur leurs opérations.
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase text-gray-500">
              Votre code de parrainage
            </p>
            <p className="px-6 py-3 bg-shamrock text-white uppercase text-2xl text-center rounded max-w-max">
              {userProfile.referalCode ? userProfile.referalCode : "null"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <DashboardInput
                  className="w-[24rem] flex-grow-0"
                  label="Ajouter un code de parrainage"
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
                <p>Vous avez été parrainé par :</p>
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
