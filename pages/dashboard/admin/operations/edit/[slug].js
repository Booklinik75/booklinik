import DashboardUi from "../../../../../components/DashboardUi";
import {
  checkAdmin,
  getOperationData,
} from "../../../../../utils/ServerHelpers";
import firebase from "../../../../../firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "../../../../../components/DashboardInput";
import { useState } from "react";
import DashboardButton from "../../../../../components/DashboardButton";
import { doFileUpload } from "../../../../../utils/ClientHelpers";
import slugify from "slugify";

export const getServerSideProps = async (ctx) => {
  const userProfile = await checkAdmin(ctx);
  const { slug } = ctx.query;
  const operation = await getOperationData(slug);
  return operation;
};

const EditOperationCategory = ({ data, id }) => {
  const router = useRouter();
  const [form, setFormData] = useState({ slug: data.slug, name: data.name });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");

  function deleteSelf() {
    firebase
      .firestore()
      .collection("operationCategories")
      .doc(id)
      .delete()
      .then(() => {
        router.push("/dashboard/admin/operations");
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

  async function doUpdate() {
    setLoading("loading");
    const root = "operations";
    let docData = {};

    if (image !== "") {
      const fileName = `${form.slug}-${image.name}`;
      const imageUploadRes = await doFileUpload(root, fileName, image);

      docData = {
        slug: form.slug,
        name: form.name,
        photo: imageUploadRes.ref.fullPath,
      };
    } else {
      docData = {
        slug: form.slug,
        name: form.name,
      };
    }

    firebase
      .firestore()
      .collection("operationCategories")
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
    <DashboardUi isAdmin={true}>
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
        <div>
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
            <DashboardButton defaultText="Mettre à jour" status={isLoading} />
          </form>
        </div>
      </div>
    </DashboardUi>
  );
};

export default EditOperationCategory;
