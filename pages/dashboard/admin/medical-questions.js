import DashboardUi from "../../../components/DashboardUi";
import { checkAdmin, getMedicalQuestions } from "../../../utils/ServerHelpers";
import { useState } from "react";
import firebase from "../../../firebase/clientApp";
import DashboardButton from "../../../components/DashboardButton";

export const getServerSideProps = async (ctx) => {
  const userProfile = await checkAdmin(ctx);
  const medicalQuestions = await getMedicalQuestions();

  return {
    props: { userProfile, medicalQuestions },
  };
};

const MedicalQuestionsEditor = ({ medicalQuestions }) => {
  const [inputList, setInputList] = useState(medicalQuestions);
  const [isLoading, setLoading] = useState("idle");

  const handleInputChange = (e, index) => {
    const { name } = e.target;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        questionContent: "",
        precision: "",
        published: true,
        isRequired: true,
        isPrecisionForTrue: true,
        hasPrecision: true,
      },
    ]);
  };

  function doUpdate() {
    setLoading("loading");

    inputList.map((input) => {
      firebase
        .firestore()
        .collection("medicalQuestions")
        .where("questionContent", "==", input.questionContent)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (document) {
            document.ref.set(input);
          });

          if (querySnapshot.empty != false) {
            firebase.firestore().collection("medicalQuestions").add(input);
          }

          setLoading("idle");
        })
        .catch((err) => {
          setLoading("idle");
        });
    });
  }

  return (
    <DashboardUi isAdmin={true}>
      <div className="col-span-12 space-y-3 transition">
        <h1 className="text-4xl">Édition : questions médicales</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doUpdate();
          }}
        >
          {inputList.map((x, i) => {
            return (
              <div
                className={
                  "box transition " + (x.published ? "" : "opacity-30")
                }
                key={(x, i)}
              >
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      Question
                    </label>
                    <input
                      type="text"
                      className="p-3 border border-gray-700 rounded"
                      placeholder="Question"
                      onChange={(e) => handleInputChange(e, i)}
                      name="questionContent"
                      value={x.questionContent}
                      required={true}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      Publié ?
                    </label>
                    <input
                      type="checkbox"
                      className="p-3 border border-gray-700 rounded"
                      onChange={(e) => handleInputChange(e, i)}
                      name="published"
                      checked={x.published}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      A une précision ?
                    </label>
                    <input
                      type="checkbox"
                      className="p-3 border border-gray-700 rounded"
                      onChange={(e) => handleInputChange(e, i)}
                      name="hasPrecision"
                      checked={x.hasPrecision}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      Précision
                    </label>
                    <input
                      type="text"
                      className="p-3 border border-gray-700 rounded"
                      placeholder="Ex : si oui, pourquoi ?"
                      onChange={(e) => handleInputChange(e, i)}
                      name="precision"
                      required={true}
                      value={x.precision}
                    />
                    <p className="text-xs mt-2 text-gray-400">
                      Écrire{" "}
                      <span className="px-1 font-mono py-0.5 rounded bg-blue-100 text-blue-900">
                        null
                      </span>{" "}
                      si aucune.
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      Précision pour oui ?
                    </label>
                    <input
                      type="checkbox"
                      className="p-3 border border-gray-700 rounded"
                      onChange={(e) => handleInputChange(e, i)}
                      name="isPrecisionForTrue"
                      checked={x.isPrecisionForTrue}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 uppercase">
                      Obligatoire ?
                    </label>
                    <input
                      type="checkbox"
                      className="p-3 border border-gray-700 rounded"
                      onChange={(e) => handleInputChange(e, i)}
                      name="isRequired"
                      checked={x.isRequired}
                    />
                  </div>
                </div>

                <div className="btn-box space-x-2 my-2 transition">
                  {inputList.length - 1 === i && (
                    <button
                      onClick={handleAddClick}
                      className="py-1 px-3 rounded text-white bg-shamrock border border-shamrock hover:bg-white hover:text-shamrock transition"
                    >
                      Ajouter
                    </button>
                  )}

                  {inputList.length !== 1 && (
                    <button
                      className="py-1 px-3 rounded text-white bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 transition"
                      onClick={() => handleRemoveClick(i)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <DashboardButton defaultText="Sauvegarder" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default MedicalQuestionsEditor;
