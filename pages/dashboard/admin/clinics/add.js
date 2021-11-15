import MDEditor from "@uiw/react-md-editor";
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
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

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
      auth,
    },
  };
};

const AddClinic = ({ citiesOptions, auth }) => {
  const router = useRouter();
  const [mdValue, setMdValue] = useState("");
  const [isLoading, setLoading] = useState("idle");

  const [form, setFormData] = useState({
    slug: "",
    name: "",
    excerpt: "",
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

  async function doAdd() {
    setLoading("loading");
    const root = "clinics";
    const fileName = `${form.slug}-${image.name}`;
    let docData = {};

    const imageUploadRes = await doFileUpload(root, fileName, image);

    docData = {
      city: form.city,
      slug: form.slug,
      name: form.name,
      excerpt: form.excerpt,
      photo: imageUploadRes.ref.fullPath,
      descriptionBody: mdValue,
    };

    setLoading("idle");

    firebase
      .firestore()
      .collection("clinics")
      .add(docData)
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/clinics/edit/${form.slug}`);
      });
  }

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter une clinique</h1>
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
          <ProfileSelect
            label="Ville"
            name="ville"
            options={citiesOptions}
            value={form.city}
            onChange={handleChange}
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
              label="Excerpt"
              required={true}
              rows={3}
              placeholder="Écrivez une courte description ..."
              className="w-full rounded border-2 outline-none border-gray-200 p-3 transition hover:border-bali focus:border-shamrock disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs uppercase text-gray-500 w-full">
              Description
            </label>
            <MDEditor value={mdValue} onChange={setMdValue} />
          </div>
          <DashboardButton defaultText="Ajouter" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddClinic;
