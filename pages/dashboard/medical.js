import DashboardUi from "../../components/DashboardUi";
import { checkAuth } from "../../utils/ServerHelpers";
import firebase from "../../firebase/clientApp";
import { HiCheckCircle } from "react-icons/hi";
import DashboardButton from "../../components/DashboardButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) {
    return auth;
  }

  const snapshot = await firebase
    .firestore()
    .collection("medicalQuestions")
    .get();
  const medicalQuestions = () => {
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  };

  return {
    props: { auth, medicalQuestions: medicalQuestions() },
  };
};

const MedicalProfile = ({ auth, medicalQuestions }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(firebase.auth());
  const [isLoading, setLoading] = useState("idle");
  const [formData, setFormData] = useState({
    weight: 0,
    height: 0,
    answers: {},
  });

  const handleInputChange = (e, index) => {
    const { name } = e.target;

    if (name !== "weight" && name !== "height") {
      if (name.toString().includes("_value")) {
        setFormData({
          ...formData,
          answers: {
            ...formData.answers,
            [name.replace("_value", "")]: {
              ...formData.answers[name.replace("_value", "")],
              [name.replace("_value", "_title")]:
                e.target.attributes.ariaDetails.nodeValue,
              [name]: Boolean(e.target.value),
            },
          },
        });
      } else {
        setFormData({
          ...formData,
          answers: {
            ...formData.answers,
            [name.replace("_precision", "")]: {
              ...formData.answers[name.replace("_precision", "")],
              [name]: e.target.value,
            },
          },
        });
      }
    } else {
      setFormData({ ...formData, [name]: parseInt(e.target.value) });
    }
  };

  const submitData = (e) => {
    e.preventDefault();
    setLoading("idle");

    firebase
      .firestore()
      .collection("medicalAnswers")
      .doc(user.uid)
      .set(formData)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard`);
      });
  };

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-12 space-y-3 transition">
        <h1 className="text-4xl">Informations médicales</h1>
        <p className="flex items-center gap-2">
          <span className="text-shamrock">
            <HiCheckCircle size={32} />
          </span>
          Veuillez indiquer vos informations médicales afin que l&apos;on puisse
          confirmer vos demandes de reservations. Vous pouvez modifier ces
          informations à tout moment.
        </p>
        <form className="w-full space-y-4" onSubmit={submitData}>
          <div className="flex gap-6">
            <div className="w-1/6 space-y-2">
              <label htmlFor="weight" className="flex justify-between">
                <span className="uppercase text-sm">Poids</span>{" "}
                <span className="text-xs text-gray-400">champ requis</span>
              </label>
              <input
                name="weight"
                type="number"
                placeholder="175 cm"
                min={0}
                required={true}
                onChange={(e) => handleInputChange(e, -1)}
                className=" w-full p-3 border outline-none rounded border-gray-400 transition hover:border-bali focus:border-shamrock"
              />
            </div>
            <div className="w-1/6 space-y-2">
              <label htmlFor="height" className="flex justify-between">
                <span className="uppercase text-sm">Taille</span>{" "}
                <span className="text-xs text-gray-400">champ requis</span>
              </label>
              <input
                name="height"
                type="number"
                placeholder="95 kg"
                min={0}
                required={true}
                onChange={(e) => handleInputChange(e, -1)}
                className=" w-full p-3 border outline-none rounded border-gray-400 transition hover:border-bali focus:border-shamrock"
              />
            </div>
          </div>
          {medicalQuestions.map((medicalQuestion, index) => {
            return medicalQuestion.published === true ? (
              <div key={index} className="space-y-2 w-1/2">
                <label className="block w-full">
                  {medicalQuestion.questionContent}
                </label>
                <div className="flex gap-3">
                  <select
                    name={`${medicalQuestion.id}_value`}
                    className="w-1/4 p-3 rounded border outline-none border-gray-400 transition hover:border-bali focus:border-shamrock"
                    onChange={(e) => handleInputChange(e, index)}
                    ariaDetails={medicalQuestion.questionContent}
                    required={true}
                  >
                    <option selected={true} disabled={true}>
                      Sélectionner
                    </option>
                    <option value={true}>Oui</option>
                    <option value={false}>Non</option>
                  </select>
                  {medicalQuestion.hasPrecision === true ? (
                    <input
                      type="text"
                      required={true}
                      name={`${medicalQuestion.id}_precision`}
                      placeholder={medicalQuestion.precision}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-3/4 p-3 border outline-none rounded border-gray-400 transition hover:border-bali focus:border-shamrock"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            );
          })}
          {!loading && (
            <DashboardButton
              defaultText="Sauvegarder mes informations"
              status={isLoading}
            />
          )}
        </form>
      </div>
    </DashboardUi>
  );
};

export default MedicalProfile;
