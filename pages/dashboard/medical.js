import DashboardUi from "../../components/DashboardUi";
import { checkAuth } from "../../utils/ServerHelpers";
import firebase from "../../firebase/clientApp";
import { HiCheckCircle } from "react-icons/hi";
import DashboardButton from "../../components/DashboardButton";
import slugify from "slugify";

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

  console.log(medicalQuestions());

  return {
    props: { auth, medicalQuestions: medicalQuestions() },
  };
};

const MedicalProfile = ({ auth, medicalQuestions }) => {
  console.log(medicalQuestions);
  return (
    <DashboardUi
      isAdmin={auth.props.userProfile.role === "admin" ? true : false}
    >
      <div className="col-span-12 space-y-3 transition">
        <h1 className="text-4xl">Informations médicales</h1>
        <p className="flex items-center gap-2">
          <span className="text-shamrock">
            <HiCheckCircle size={32} />
          </span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <form className="w-full space-y-4">
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
                  >
                    <option value={true}>Oui</option>
                    <option value={false}>Non</option>
                  </select>
                  {medicalQuestion.hasPrecision === true ? (
                    <input
                      type="text"
                      name={`${medicalQuestion.id}_precision`}
                      placeholder={medicalQuestion.precision}
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
          <DashboardButton defaultText="Sauvegarder mes informations" />
        </form>
      </div>
    </DashboardUi>
  );
};

export default MedicalProfile;
