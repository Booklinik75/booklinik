import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getCities,
  getOperationCategories,
} from "../../../../utils/ServerHelpers";
import { doFileUpload } from "../../../../utils/ClientHelpers";
import { useState, useEffect } from "react";
import slugify from "slugify";
import firebase from "../../../../firebase/clientApp";
import DashboardInput from "../../../../components/DashboardInput";
import DashboardButton from "../../../../components/DashboardButton";
import { useRouter } from "next/router";
import ProfileSelect from "../../../../components/ProfileSelect";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const cities = await getCities();
  const categories = await getOperationCategories();

  const citiesOptions = [];
  const categoriesOptions = [];

  cities.map((city) => {
    citiesOptions.push({ value: city.slug, label: city.name });
  });

  categories.map((category) => {
    categoriesOptions.push({ value: category.slug, label: category.name });
  });

  return {
    props: { citiesOptions, categoriesOptions, auth },
  };
};

const AddSurgery = ({ citiesOptions, categoriesOptions, auth }) => {
  const [form, setFormData] = useState({
    slug: "",
    name: "",
    excerpt: "",
    minimumNights: 0,
    countries: [],
    category: categoriesOptions[0].value,
    startingPrice: 0,
  });
  const [isLoading, setLoading] = useState("idle");
  const [inputList, setInputList] = useState([]);
  const [selectedCities, setselectedCities] = useState([]);
  const router = useRouter();
  const [mdValue, setMdValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "name") {
      form.slug = slugify(e.target.value, { lower: true });
    }

    setFormData({
      ...form,

      // Trimming any whitespace
      [e.target.name]: e.target.value,
    });
  };

  const handleCountries = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setselectedCities(value);
  };

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
        title: "",
        photosCount: 1,
        description: "",
      },
    ]);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`surgery/${file.name}`).put(file);

    // upload file then store it in its state
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setIsUploading(true);
      },
      (error) => {
        console.log(error);
      },
      () => {
        setIsUploading(false);
        storageRef
          .child(`surgery/${file.name}`)
          .getDownloadURL()
          .then((url) => {
            setImageUrl(url);
          });
      }
    );
  };

  async function doAdd() {
    setLoading("loading");
    const root = "surgeries";

    let docData = {
      slug: form.slug,
      name: form.name,
      requiredPictures: inputList,
      excerpt: form.excerpt,
      category: form.category,
      cities: selectedCities,
      startingPrice: form.startingPrice,
      additionalDocuments: inputList,
      descriptionBody: mdValue,
      photoUrl: imageUrl,
    };

    firebase
      .firestore()
      .collection("surgeries")
      .add(docData)
      .then((docRef) => {})
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/surgeries/edit/${form.slug}`);
      });
  }

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter une opération</h1>
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
            name="photo"
            value={form.photo}
            onChange={handlePhotoUpload}
            disabled={false}
            label="Photo"
            required={true}
          />
          <DashboardInput
            type="number"
            name="startingPrice"
            value={form.startingPrice}
            onChange={handleChange}
            disabled={false}
            label="Prix de base"
            required={true}
            min={0}
          />
          <DashboardInput
            type="number"
            name="minimumNights"
            value={form.minimumNights}
            onChange={handleChange}
            disabled={false}
            label="Nuits minimum"
            required={true}
            min={0}
          />
          <ProfileSelect
            label="Ville(s)"
            name="country"
            options={citiesOptions}
            value={form.cities}
            onChange={handleCountries}
            multiple={true}
          />
          <ProfileSelect
            label="Catégorie"
            name="category"
            options={categoriesOptions}
            value={form.category}
            onChange={handleChange}
            multiple={false}
          />
          <div>
            <label className="text-xs uppercase text-gray-500 w-full">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              disabled={false}
              label="excerpt"
              required={true}
              rows={3}
              placeholder="Écrivez une courte description"
              className="w-full rounded border-2 outline-none border-gray-200 p-3 transition hover:border-bali focus:border-shamrock disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-gray-500 w-full">
              Description
            </label>
            <MDEditor value={mdValue} onChange={setMdValue} />
          </div>
          {inputList.map((x, i) => {
            return (
              <div className="box w-full" key={(x, i)}>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500 uppercase">
                      Titre du set de photos
                    </label>
                    <input
                      type="text"
                      className="p-3 border border-gray-700 rounded"
                      placeholder="Photos du crâne"
                      value={x.title}
                      onChange={(e) => handleInputChange(e, i)}
                      name="title"
                      required={true}
                    />
                    <DashboardInput
                      type="number"
                      name="photosCount"
                      placeholder="Nombre de photos"
                      value={x.photosCount}
                      onChange={(e) => handleInputChange(e, i)}
                      min={1}
                      required={true}
                      disabled={false}
                      label="Nombre de photos"
                    />
                    <label className="text-xs uppercase text-gray-500 w-full">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={x.description}
                      onChange={(e) => handleInputChange(e, i)}
                      disabled={false}
                      label="description"
                      required={true}
                      rows={3}
                      placeholder="Nous avons besoin de photos de la zone d'opération afin que le chirurgien valide l'acte. 1 photo face dessus, 1 photo arrière crane, 1 photo coté gauche, 1 photo coté droite."
                      className="w-full rounded border-2 outline-none border-gray-200 p-3 transition hover:border-bali focus:border-shamrock disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed"
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
                Ajouter des photos
              </button>
            </div>
          )}
          <DashboardButton
            defaultText="Ajouter"
            status={isLoading}
            disabled={isUploading}
          />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddSurgery;
