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

const AddOperation = ({ userProfile, token }) => {
  const [form, setFormData] = useState({ slug: "", name: "" });
  const [isLoading, setLoading] = useState("idle");
  const [image, setImage] = useState("");
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

  async function doAdd() {
    setLoading("loading");
    const root = "operations";
    const fileName = `${form.slug}-${image.name}`;

    const imageUploadRes = await doFileUpload(root, fileName, image);

    let docData = {
      slug: form.slug,
      name: form.name,
      photo: imageUploadRes.ref.fullPath,
    };

    firebase
      .firestore()
      .collection("operationCategories")
      .add(docData)
      .then((docRef) => {})
      .catch((error) => {})
      .finally(() => {
        setLoading("done");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.push(`/dashboard/admin/operations/edit/${form.slug}`);
      });
  }

  return (
    <DashboardUi isAdmin={true}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter une catégorie d&apos;opération</h1>
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
          <DashboardButton defaultText="Ajouter" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddOperation;
