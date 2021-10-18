import DashboardUi from "../../../../../components/DashboardUi";
import DashboardInput from "../../../../../components/DashboardInput";
import { useState } from "react";
import firebase from "../../../../../firebase/clientApp";
import {
  checkAdmin,
  getHotelNameById,
  gatherOptionsFromHotelId,
} from "../../../../../utils/ServerHelpers";
import DashboardButton from "../../../../../components/DashboardButton";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const { id } = ctx.query;
  const hotelName = await getHotelNameById(id);
  const options = await gatherOptionsFromHotelId(id);

  return {
    props: { hotelName, id, options, auth },
  };
};

const EditOptions = ({ hotelName, id, options, auth }) => {
  const router = useRouter();
  const [inputList, setInputList] = useState(options);
  const [isLoading, setLoading] = useState("idle");

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleChange = (e, index) => {
    const { name } = e.target;
    const value = e.target.value;

    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        name: "",
        price: 0,
      },
    ]);
  };

  function deleteSelf() {
    firebase
      .firestore()
      .collection("options")
      .doc(id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/options");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  function doAdd() {
    setLoading("loading");

    firebase
      .firestore()
      .collection("options")
      .doc(id)
      .set({ ...[inputList] })
      .catch(() => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/options/edit/${id}`);
      });
  }

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6 space-y-3 max-h-full transition">
        <div className="flex gap-6 items-center justify-between">
          <div className="space-y-3">
            <div className="flex gap-2">
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {id}
              </p>
            </div>
            <h1 className="text-4xl gap-2">
              Édition d&apos;options :
              <span className="ml-2 text-shamrock">{hotelName}</span>
            </h1>
            <p></p>
          </div>
          <div>
            <button
              onClick={deleteSelf}
              className="bg-red-500 rounded transition px-6 py-3 border border-red-500 text-white hover:text-red-500 hover:bg-white"
            >
              Supprimer
            </button>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doAdd();
          }}
          className="space-y-4"
        >
          {inputList.map((x, i) => {
            return (
              <div key={(x, i)}>
                <div className="space-y-4 p-4 bg-gray-100 rounded shadow">
                  <div className="flex gap-4">
                    <DashboardInput
                      type="text"
                      onChange={(e) => handleChange(e, i)}
                      value={x.name}
                      name="name"
                      label="Nom de l'option"
                      required={true}
                    />
                    <DashboardInput
                      type="number"
                      onChange={(e) => handleChange(e, i)}
                      value={parseInt(x.price)}
                      name="price"
                      label="Prix de l'option (0 pour gratuit)"
                      required={true}
                      min={0}
                    />
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
              </div>
            );
          })}
          <DashboardButton defaultText="Mettre à jour" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditOptions;
