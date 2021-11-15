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
import {
  doFileUpload,
  getBackEndAsset,
} from "../../../../../utils/ClientHelpers";
import slugify from "slugify";
import Image from "next/image";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return userProfile;
  }

  const { slug } = ctx.query;
  const operation = await getOperationData(slug);

  return {
    props: {
      data: operation.data,
      id: operation.id,
      auth,
    },
  };

  return operation;
};

const EditOperationCategory = ({ auth, data, id }) => {
  const router = useRouter();
  const [form, setFormData] = useState({ slug: data.slug, name: data.name });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("");

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

  const handleIconChange = (e) => {
    if (e.target.files[0]) {
      setIcon(e.target.files[0]);
    }
  };

  async function doUpdate() {
    setLoading("loading");
    const root = "operations";
    let docData = { slug: form.slug, name: form.name };

    if (image !== "") {
      const fileName = `${form.slug}-${image.name}`;
      const imageUploadRes = await doFileUpload(root, fileName, image);

      docData = {
        ...docData,
        photo: imageUploadRes.ref.fullPath,
      };
    }

    if (icon !== "") {
      const iconName = `icon__${form.slug}-${icon.name}`;
      const iconUploadRef = await doFileUpload(root, iconName, icon);
      const iconURL = await getBackEndAsset(iconUploadRef.ref.fullPath);

      docData = {
        ...docData,
        icon: iconURL,
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
            <h1 className="text-4xl flex gap-2 items-center">
              Édition :
              {data.icon && (
                <span>
                  <Image
                    height={20}
                    width={20}
                    src={data.icon}
                    alt={data.name}
                  />
                </span>
              )}
              <span className="text-shamrock">{` ${data.name}`}</span>
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
            <DashboardInput
              type="file"
              name="icon"
              onChange={handleIconChange}
              disabled={false}
              label="Icône"
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
