import DashboardUi from "../../../../../components/DashboardUi";
import {
  checkAdmin,
  getCities,
  getOperationCategories,
  getSurgeryData,
} from "../../../../../utils/ServerHelpers";
import { useState } from "react";
import slugify from "slugify";
import firebase from "../../../../../firebase/clientApp";
import DashboardInput from "../../../../../components/DashboardInput";
import DashboardButton from "../../../../../components/DashboardButton";
import { useRouter } from "next/router";
import ProfileSelect from "../../../../../components/ProfileSelect";
import MDEditor from "@uiw/react-md-editor";

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query;

  const userProfile = await checkAdmin(ctx);
  const cities = await getCities();
  const categories = await getOperationCategories();
  const surgeryData = await getSurgeryData(slug);

  const citiesOptions = [];
  const categoriesOptions = [];

  cities.map((city) => {
    citiesOptions.push({ value: city.slug, label: city.name });
  });

  categories.map((category) => {
    categoriesOptions.push({ value: category.slug, label: category.name });
  });

  return {
    props: { citiesOptions, categoriesOptions, surgeryData },
  };
};

const EditSurgery = ({ citiesOptions, categoriesOptions, surgeryData }) => {
  const [form, setFormData] = useState({
    slug: surgeryData.props.data.slug,
    name: surgeryData.props.data.name,
    countries: surgeryData.props.data.countries,
    category: surgeryData.props.data.category,
    excerpt: surgeryData.props.data.excerpt,
    startingPrice: surgeryData.props.data.startingPrice,
    minimumNights: surgeryData.props.data.minimumNights,
  });
  const [isLoading, setLoading] = useState("idle");
  const [inputList, setInputList] = useState(
    surgeryData.props.data.requiredPictures
  );
  const [selectedCities, setselectedCities] = useState(
    surgeryData.props.data.cities
  );
  const router = useRouter();
  const [mdValue, setMdValue] = useState(
    surgeryData.props.data.descriptionBody
  );

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

  function deleteSelf() {
    firebase
      .firestore()
      .collection("surgeries")
      .doc(surgeryData.props.id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/surgeries");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

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
      startingPrice: parseInt(form.startingPrice),
      additionalDocuments: inputList,
      descriptionBody: mdValue,
      minimumNights: parseInt(form.minimumNights),
    };

    firebase
      .firestore()
      .collection("surgeries")
      .doc(surgeryData.props.id)
      .set(docData)
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
    <DashboardUi isAdmin={true}>
      <div className="col-span-10 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex gap-2">
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {surgeryData.props.data.slug}
              </p>
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {surgeryData.props.id}
              </p>
            </div>
            <h1 className="text-4xl gap-2">
              Édition :
              <span className="ml-2 text-shamrock">
                {surgeryData.props.data.name}
              </span>
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
            label="Pays"
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

          <DashboardButton defaultText="Mettre à jour" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditSurgery;
