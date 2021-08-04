import DashboardUi from "../../../../components/DashboardUi";
import { checkAdmin, getCities } from "../../../../utils/ServerHelpers";
import firebase from "../../../../firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "../../../../components/DashboardInput";
import { useState } from "react";
import DashboardButton from "../../../../components/DashboardButton";
import { doFileUpload } from "../../../../utils/ClientHelpers";
import slugify from "slugify";
import ProfileSelect from "../../../../components/ProfileSelect";

export const getServerSideProps = async (ctx) => {
  const userProfile = await checkAdmin(ctx);
  const { slug } = ctx.query;
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
      citiesOptions: citiesOptions,
    },
  };
};

const AddHotel = ({ citiesOptions }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState("idle");

  const [form, setFormData] = useState({
    slug: "",
    name: "",
    rating: 0,
    extraPrice: 0,
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

      // Trimming any whitespace
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  async function doUpdate() {
    setLoading("loading");
    const root = "hotels";
    const fileName = `${form.slug}-${image.name}`;
    let docData = {};

    const imageUploadRes = await doFileUpload(root, fileName, image);

    docData = {
      city: form.city,
      slug: form.slug,
      name: form.name,
      rating: form.rating,
      extraPrice: form.extraPrice,
      photo: imageUploadRes.ref.fullPath,
    };

    setLoading("idle");

    firebase
      .firestore()
      .collection("hotels")
      .add(docData)
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/hotels/edit/${form.slug}`);
      });
  }

  return (
    <DashboardUi isAdmin={true}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter un hotel</h1>
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
            required={true}
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
          <DashboardButton defaultText="Ajouter" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddHotel;
