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
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const { slug } = ctx.query;
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
    props: { citiesOptions, categoriesOptions, surgeryData, auth },
  };
};

const EditSurgery = ({
  citiesOptions,
  categoriesOptions,
  surgeryData,
  auth,
}) => {
  const [form, setFormData] = useState({
    slug: surgeryData.data.slug,
    name: surgeryData.data.name,
    countries: surgeryData.data.countries,
    category: surgeryData.data.category,
    excerpt: surgeryData.data.excerpt,
    startingPrice: surgeryData.data.startingPrice,
    minimumNights: surgeryData.data.minimumNights,
  });
  const [isLoading, setLoading] = useState("idle");
  const [inputList, setInputList] = useState(surgeryData.data.requiredPictures);
  const [inputDoctorList, setInputDoctorList] = useState(
    surgeryData.data.doctor
  );
  const [inputBeforeAfterList, setInputBeforeAfterList] = useState(
    surgeryData.data.beforeafter
  );
  const [selectedCities, setselectedCities] = useState(surgeryData.data.cities);
  const router = useRouter();
  const [mdValue, setMdValue] = useState(surgeryData.data.descriptionBody);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingDoctorUrl, setIsUploadingDoctorUrl] = useState(false);
  const [photoUrl, setphotoUrl] = useState(surgeryData.data.photoUrl);


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
  const handleInputDoctorChange = (e, index) => {
    const { name } = e.target;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    const list = [...inputDoctorList];
    list[index][name] = value;
    setInputDoctorList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const handleDoctorRemoveClick = (index) => {
    const list = [...inputDoctorList];
    list.splice(index, 1);
    setInputDoctorList(list);
  };
  const handleBeforeAfterRemoveClick = (index) => {
    const list = [...inputBeforeAfterList];
    list.splice(index, 1);
    setInputBeforeAfterList(list);
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

  const handleDoctorAddClick = () => {
    setInputDoctorList([
      ...inputDoctorList,
      {
        name: "",
        photoUrl: "",
      },
    ]);
  };

  const handlebeforeafterAddClick = () => {
    setInputBeforeAfterList([
      ...inputBeforeAfterList,
      {
        leftimage: "",
        rightimage: "",
      },
    ]);
  };

  function deleteSelf() {
    firebase
      .firestore()
      .collection("surgeries")
      .doc(surgeryData.id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/surgeries");
      });
  }

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
            setphotoUrl(url);
          });
      }
    );
  };

  const handlePhotoDoctorUpload = (e, index) => {
    const { name, files } = e.target;
    
    const storageRef = firebase.storage().ref();
    const list = [...inputDoctorList];
 

    const uploadTask = storageRef
      .child(`doctor/${files[0].name}`)
      .put(files[0]);
    // upload file then store it in its state
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //  setIsUploadingDoctorUrl(true);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //  setIsUploadingDoctorUrl(false);
        storageRef
          .child(`doctor/${files[0].name}`)
          .getDownloadURL()
          .then((url) => {
            list[index][name] = url;
            setInputDoctorList(list);
          });
      }
    );
  };

  const handleBeforeAfterUpload = (e, index) => {
    const { name, files } = e.target;

    const storageRef = firebase.storage().ref();
    const list = [...inputBeforeAfterList];

    const uploadTask = storageRef
      .child(`before_after/${files[0].name}`)
      .put(files[0]);
    // upload file then store it in its state
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //  setIsUploadingDoctorUrl(true);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //  setIsUploadingDoctorUrl(false);
        storageRef
          .child(`before_after/${files[0].name}`)
          .getDownloadURL()
          .then((url) => {
            list[index][name] = url;
            setInputBeforeAfterList(list);
          });
      }
    );
  };
  async function doAdd() {
    setLoading("loading");

    let Data = {
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
      photoUrl: photoUrl,
      doctor: inputDoctorList,
      beforeafter: inputBeforeAfterList,
    };
    firebase
      .firestore()
      .collection("surgeries")
      .doc(surgeryData.id)
      .update(Data)
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
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex gap-2">
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {surgeryData.data.slug}
              </p>
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {surgeryData.id}
              </p>
            </div>
            <h1 className="text-4xl gap-2">
              Édition :
              <span className="ml-2 text-shamrock">
                {surgeryData.data.name}
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
            type="file"
            name="photo"
            value={form.photo}
            onChange={handlePhotoUpload}
            disabled={false}
            label="Photo"
            required={false}
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
          {inputDoctorList
            ? inputDoctorList.map((x, i) => {
                return (
                  <div key={(x, i)}>
                    <label className="text-sm text-gray-500 uppercase">
                      Titre + photo Médecin n°{i + 1}
                    </label>
                    <DashboardInput
                      type="text"
                      name="name"
                      value={x.name}
                      onChange={(e) => handleInputDoctorChange(e, i)}
                      disabled={false}
                      label="Nom "
                      required={false}
                    />

                    <DashboardInput
                      type="file"
                      name="photoUrl"
                      onChange={(e) => handlePhotoDoctorUpload(e, i)}
                      disabled={false}
                      label="Photo Médecin"
                      required={false}
                    />
                    <div className="btn-box space-x-2 my-2 transition">
                      {inputDoctorList.length - 1 === i &&
                        inputDoctorList.length < 4 && (
                          <button
                            onClick={handleDoctorAddClick}
                            className="py-1 px-3 rounded text-white bg-shamrock border border-shamrock hover:bg-white hover:text-shamrock transition"
                          >
                            Ajouter
                          </button>
                        )}

                      <button
                        className="py-1 px-3 rounded text-white bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 transition"
                        onClick={() => handleDoctorRemoveClick(i)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })
            : ""}
          {inputDoctorList ? (
            inputDoctorList.length === 0 && (
              <div
                onClick={handleDoctorAddClick}
                className="w-full flex justify-center rounded transition py-4 border border-dashed border-gray-500 bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
              >
                <button className="py-3 px-10 rounded text-center border border-shamrock text-shamrock transition">
                  Ajouter des photos de Médecin
                </button>
              </div>
            )
          ) :  setInputDoctorList([])}
          {inputBeforeAfterList
            ? inputBeforeAfterList.map((x, i) => {
                return (
                  <div key={(x, i)}>
                    <label className="text-sm text-gray-500 uppercase">
                      Photo Avant/Aprés n°{i + 1}
                    </label>
                    <DashboardInput
                      type="file"
                      name="leftimage"
                      onChange={(e) => handleBeforeAfterUpload(e, i)}
                      disabled={false}
                      label="Avant"
                      required={false}
                    />
                    <DashboardInput
                      type="file"
                      name="rightimage"
                      onChange={(e) => handleBeforeAfterUpload(e, i)}
                      disabled={false}
                      label="Aprés"
                      required={false}
                    />

                    <div className="btn-box space-x-2 my-2 transition">
                      {inputBeforeAfterList.length - 1 === i &&
                        inputBeforeAfterList.length < 4 && (
                          <button
                            onClick={handlebeforeafterAddClick}
                            className="py-1 px-3 rounded text-white bg-shamrock border border-shamrock hover:bg-white hover:text-shamrock transition"
                          >
                            Ajouter
                          </button>
                        )}

                      <button
                        className="py-1 px-3 rounded text-white bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 transition"
                        onClick={() => handleBeforeAfterRemoveClick(i)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })
            : ""}
          {inputBeforeAfterList ? (
            inputBeforeAfterList.length === 0 && (
              <div
                onClick={handlebeforeafterAddClick}
                className="w-full flex justify-center rounded transition py-4 border border-dashed border-gray-500 bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
              >
                <button className="py-3 px-10 rounded text-center border border-shamrock text-shamrock transition">
                  Ajouter des photos
                </button>
              </div>
            )
          ) :    setInputBeforeAfterList([])}

          {inputList.map((x, i) => {
            return (
              <div className="box w-full" key={(x, i)}>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col w-full gap-2">
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
            defaultText="Mettre à jour"
            status={isLoading}
            disabled={isUploading}
          />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditSurgery;
