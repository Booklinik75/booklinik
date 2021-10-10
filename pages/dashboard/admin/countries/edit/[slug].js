import DashboardUi from "../../../../../components/DashboardUi";
import { checkAdmin, getCountryData } from "../../../../../utils/ServerHelpers";
import firebase from "../../../../../firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "../../../../../components/DashboardInput";
import { useState } from "react";
import DashboardButton from "../../../../../components/DashboardButton";
import { doFileUpload } from "../../../../../utils/ClientHelpers";
import slugify from "slugify";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const { slug } = ctx.query;
  const country = await getCountryData(slug);
  return {
    props: {
      data: country.data,
      id: country.id,
      auth,
    },
  };
};

const EditCountry = ({ data, id, auth }) => {
  const [form, setFormData] = useState({
    slug: data.slug,
    name: data.name,
  });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");
  const [inputList, setInputList] = useState(data.additionalDocuments);
  const router = useRouter();

  function deleteSelf() {
    firebase
      .firestore()
      .collection("countries")
      .doc(id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/countries");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  const handleChange = (e) => {
    if (e.target.name === "name") {
      form.slug = slugify(e.target.value, { lower: true });
    }

    if (e.target.files !== null) {
      form.image = e.target.files[0];
    }

    setFormData({
      ...form,

      // Trimming any whitespace
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e, index) => {
    const { name } = e.target;
    let value = null;

    if (e.target.type === "file") {
      value = e.target.files[0];
    } else if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

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
        fileName: "",
        input: undefined,
      },
    ]);
  };

  async function doAdd() {
    setLoading("loading");
    const root = "countries";
    const fileName = `${form.slug}-${image.name}`;
    let docData = {};

    const imageUploadRes = await doFileUpload(root, fileName, image);

    const additionalDocuments = await Promise.all(
      inputList.map(async (input, index) => {
        if (
          input.fileName === undefined &&
          data.additionalDocuments[index] === undefined
        ) {
          return null;
        } else if (input.fileName === undefined) {
          return data.additionalDocuments[index];
        } else {
          let image = await doFileUpload(
            "countries",
            input.file.name,
            input.image
          );

          return {
            file: image.ref.fullPath,
            name: input.name,
          };
        }
      })
    );

    if (image !== "") {
      docData = {
        slug: form.slug,
        name: form.name,
        photo: imageUploadRes.ref.fullPath,
        additionalDocuments: additionalDocuments,
      };
    } else {
      docData = {
        slug: form.slug,
        name: form.name,
        additionalDocuments: additionalDocuments,
      };
    }

    firebase
      .firestore()
      .collection("countries")
      .doc(id)
      .update(docData)
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.reload(window.location.pathname);
      });
  }

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex gap-2">
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {data.slug}
              </p>
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {id}
              </p>
            </div>
            <h1 className="text-4xl">
              Édition :<span className="text-shamrock"> {data.name}</span>
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
          <DashboardInput
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            disabled={true}
            label="Slug"
            required={true}
          />
          <DashboardInput
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={false}
            label="Nom"
            required={true}
          />
          <DashboardInput
            type="file"
            name="image"
            onChange={handleImageChange}
            disabled={false}
            label="Image"
            required={false}
            accept="image/*"
          />
          {inputList.map((x, i) => {
            return (
              <div className="box" key={(x, i)}>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <DashboardInput
                      type="text"
                      name={"name"}
                      placeholder="Visa à remplir"
                      onChange={(e) => handleInputChange(e, i)}
                      value={x.name}
                      required={false}
                      disabled={false}
                      label="Nom du fichier"
                    />
                    <DashboardInput
                      type="file"
                      name={"file"}
                      onChange={(e) => handleInputChange(e, i)}
                      value={x.fileName}
                      required={false}
                      disabled={false}
                      accept=".pdf"
                      label="Fichier (.pdf uniquement)"
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

                    <button
                      className="py-1 px-3 rounded text-white bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 transition"
                      onClick={() => handleRemoveClick(i)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {inputList.length === 0 && (
            <div
              onClick={handleAddClick}
              className="w-full flex justify-center rounded transition py-4 border border-dashed border-gray-500 bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
            >
              <button className="py-3 px-10 rounded text-center border border-shamrock text-shamrock transition">
                Ajouter des documents obligatoires
              </button>
            </div>
          )}

          <DashboardButton defaultText="Mettre à jour" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditCountry;
