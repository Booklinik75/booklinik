import DashboardUi from "../../../../../components/DashboardUi";
import {
  checkAdmin,
  getCityData,
  getCountries,
} from "../../../../../utils/ServerHelpers";
import { doFileUpload } from "../../../../../utils/ClientHelpers";
import { useState, useEffect } from "react";
import slugify from "slugify";
import firebase from "../../../../../firebase/clientApp";
import DashboardInput from "../../../../../components/DashboardInput";
import DashboardButton from "../../../../../components/DashboardButton";
import { useRouter } from "next/router";
import ProfileSelect from "../../../../../components/ProfileSelect";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const { slug } = ctx.query;
  const country = await getCityData(slug);
  const countries = await getCountries();
  const countriesOptions = [];

  countries.map((country) => {
    countriesOptions.push({ value: country.slug, label: country.name });
  });

  return {
    props: {
      data: country.props.data,
      id: country.props.id,
      countriesOptions: countriesOptions,
      userProfile: auth.props.userProfile,
      token: auth.props.token,
    },
  };
};

const AddCity = ({ countriesOptions, data, id, token, userProfile }) => {
  const [form, setFormData] = useState({
    slug: data.slug,
    name: data.name,
    country: data.country,
  });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name === "name") {
      form.slug = slugify(e.target.value, { lower: true });
    }

    setFormData({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  function deleteSelf() {
    firebase
      .firestore()
      .collection("cities")
      .doc(id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/cities");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  async function doAdd() {
    setLoading("loading");
    const root = "cities";
    let docData = {};

    if (image !== "") {
      const fileName = `${form.slug}-${image.name}`;
      const imageUploadRes = await doFileUpload(root, fileName, image);

      docData = {
        slug: form.slug,
        name: form.name,
        photo: imageUploadRes.ref.fullPath,
        country: form.country,
      };
    } else {
      docData = {
        slug: form.slug,
        name: form.name,
        country: form.country,
      };
    }

    firebase
      .firestore()
      .collection("cities")
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
    <DashboardUi userProfile={userProfile} token={token}>
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
        </div>{" "}
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
          <ProfileSelect
            label="Pays"
            name="country"
            options={countriesOptions}
            value={form.country}
            onChange={handleChange}
          />
          <DashboardButton defaultText="Mettre à jour" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddCity;
