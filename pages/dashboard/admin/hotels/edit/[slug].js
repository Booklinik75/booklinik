import DashboardUi from "../../../../../components/DashboardUi";
import {
  checkAdmin,
  getCities,
  getHotelData,
} from "../../../../../utils/ServerHelpers";
import firebase from "../../../../../firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "../../../../../components/DashboardInput";
import { useState } from "react";
import DashboardButton from "../../../../../components/DashboardButton";
import { doFileUpload } from "../../../../../utils/ClientHelpers";
import slugify from "slugify";
import ProfileSelect from "../../../../../components/ProfileSelect";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const { slug } = ctx.query;
  const hotel = await getHotelData(slug);
  const cities = await getCities();

  const citiesOptions = [];

  citiesOptions.push({
    value: "default",
    label: "Sélectionner une option",
  });

  cities.map((city) => {
    citiesOptions.push({ value: city.slug, label: city.name });
  });

  return {
    props: {
      data: hotel.props.data,
      id: hotel.props.id,
      citiesOptions: citiesOptions,
      auth,
    },
  };
};

const EditHotel = ({ data, id, citiesOptions, auth }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState("idle");

  const [form, setFormData] = useState({
    slug: data.slug,
    name: data.name,
    rating: data.rating,
    extraPrice: data.extraPrice,
  });
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "name") {
      form.slug = slugify(e.target.value, { lower: true });
    }
    if (e.target.type === "select-one") {
      form.city = e.target.value;
    }

    setFormData({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  function deleteSelf() {
    firebase
      .firestore()
      .collection("hotels")
      .doc(id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/hotels");
      });
  }

  async function doUpdate() {
    setLoading("loading");
    const root = "hotels";
    const fileName = `${form.slug}-${image.name}`;
    let docData = {};

    const imageUploadRes = await doFileUpload(root, fileName, image);

    if (image !== "") {
      docData = {
        city: form.city,
        slug: form.slug,
        name: form.name,
        rating: form.rating,
        extraPrice: form.extraPrice,
        photo: imageUploadRes.ref.fullPath,
      };
    } else {
      docData = {
        city: form.city,
        slug: form.slug,
        name: form.name,
        rating: form.rating,
        extraPrice: form.extraPrice,
      };
    }

    firebase
      .firestore()
      .collection("hotels")
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
        <div className="flex justify-between items-center gap-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {data.slug}
              </p>
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {id}
              </p>
              <p className="bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max">
                {data.city}
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
            doUpdate();
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
          <DashboardInput
            type="number"
            name="rating"
            min={0}
            max={5}
            value={form.rating}
            onChange={handleChange}
            disabled={false}
            label="Étoiles"
            required={true}
          />
          <DashboardInput
            type="number"
            name="extraPrice"
            min={0}
            value={form.extraPrice}
            onChange={handleChange}
            disabled={false}
            label="Prix de base"
            required={true}
          />
          <ProfileSelect
            label="Ville"
            name="ville"
            options={citiesOptions}
            value={form.city}
            onChange={handleChange}
          />
          <DashboardButton defaultText="Mettre à jour" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditHotel;
