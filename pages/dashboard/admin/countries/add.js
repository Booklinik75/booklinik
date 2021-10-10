import DashboardUi from "../../../../components/DashboardUi";
import { checkAdmin } from "../../../../utils/ServerHelpers";
import { doFileUpload } from "../../../../utils/ClientHelpers";
import { useState, useEffect } from "react";
import slugify from "slugify";
import firebase from "../../../../firebase/clientApp";
import DashboardInput from "../../../../components/DashboardInput";
import DashboardButton from "../../../../components/DashboardButton";
import { useRouter } from "next/router";

export const getServerSideProps = checkAdmin;

const AddCountry = ({ userProfile, token }) => {
  const [form, setFormData] = useState({
    slug: "",
    name: "",
  });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");
  const [inputList, setInputList] = useState([]);
  const router = useRouter();

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

    const imageUploadRes = await doFileUpload(root, fileName, image);

    const additionalDocuments = await Promise.all(
      inputList.map(async (input) => {
        let image = await doFileUpload(
          "countries",
          input.file.name,
          input.fileName
        );

        return {
          file: image.ref.fullPath,
          name: input.name,
        };
      })
    );

    let docData = {
      slug: form.slug,
      name: form.name,
      photo: imageUploadRes.ref.fullPath,
      additionalDocuments: additionalDocuments,
    };

    firebase
      .firestore()
      .collection("countries")
      .add(docData)
      .then((docRef) => {})
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/countries/edit/${form.slug}`);
      });
  }

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter un pays</h1>
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
            required={true}
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
                      required={true}
                      disabled={false}
                      label="Nom du fichier"
                    />
                    <DashboardInput
                      type="file"
                      name={"file"}
                      onChange={(e) => handleInputChange(e, i)}
                      value={x.fileName}
                      required={true}
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

          <DashboardButton defaultText="Ajouter" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddCountry;
