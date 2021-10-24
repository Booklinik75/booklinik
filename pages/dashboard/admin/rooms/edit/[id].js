import { checkAdmin, getHotels } from "utils/ServerHelpers";
import { doFileUpload, getBackEndAsset } from "utils/ClientHelpers";
import firebase from "firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "components/DashboardInput";
import DashboardUi from "components/DashboardUi";
import { useState } from "react";
import DashboardButton from "components/DashboardButton";
import slugify from "slugify";
import ProfileSelect from "components/ProfileSelect";
import Image from "next/image";
import { toast } from "react-toastify";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const { id } = ctx.query;
  const hotels = await getHotels();

  const hotelsOptions = [];

  hotelsOptions.push({
    value: "default",
    label: "Sélectionner une option",
  });

  hotels.map((hotel) => {
    hotelsOptions.push({ value: hotel.slug, label: hotel.name });
  });

  const room = await firebase
    .firestore()
    .collection("rooms")
    .doc(id)
    .get()
    .then((doc) => {
      return { ...doc.data(), id: doc.id };
    });

  return {
    props: {
      hotelsOptions: hotelsOptions,
      auth,
      room,
    },
  };
};

const EditRoom = ({ hotelsOptions, auth, room }) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState("idle");

  const [form, setFormData] = useState({
    name: room.name,
    slug: room.slug,
    extraPrice: Number(room.extraPrice),
    hotel: room.hotel,
  });

  const [images, setImages] = useState([]);

  const uploadPictureSet = async (pictures) => {};

  const handleChange = (e) => {
    setFormData({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
    console.log(Array.from(e.target.files));
  };

  const doUpdate = (f) => {
    console.log(f);

    firebase
      .firestore()
      .collection("rooms")
      .doc(room.id)
      .update({ ...f })
      .then(() => {
        setLoading("done");
        toast.success("Mise à jour effectuée");
        setTimeout(() => {
          setLoading("idle");
        }, 1000);
        router.replace(router.asPath);
      })
      .catch(() => {
        toast.error("Une erreur est survenue");
      })
      .finally(() => {
        setLoading("idle");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading("loading");
    const pictureSetLinks = [];

    if (images.length > 0) {
      await Promise.all(
        images.map(async (file) => {
          // build storage object
          const fileRef = `rooms/`;
          const fileName = `${(Math.random() + 1).toString(36).substring(7)}_${
            file.name
          }`;

          // upload action
          const imageUploadRes = await doFileUpload(fileRef, fileName, file);

          // save links
          pictureSetLinks.push(
            await getBackEndAsset(imageUploadRes.ref.fullPath)
          );
        })
      ).then(() => {
        doUpdate({ ...form, photos: pictureSetLinks });
      });
    } else {
      doUpdate(form);
    }
  };

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter une chambre d&apos;hôtel</h1>
        <div className="flex gap-4">
          {room.photos?.map((photo, index) => (
            <div
              className="w-32 h-32 rounded overflow-hidden shadow-sm relative"
              key={index}
            >
              <Image src={photo} layout="fill" objectFit="cover" alt="" />
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DashboardInput
            type="text"
            name="slug"
            value={slugify(form.name)}
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
            name="extraPrice"
            min={0}
            value={form.extraPrice}
            onChange={handleChange}
            disabled={false}
            label="Prix de la chambre"
            required={true}
          />
          <ProfileSelect
            label="Hotel"
            name="hotel"
            options={hotelsOptions}
            value={form.hotel}
            onChange={handleChange}
          />
          <DashboardInput
            type="file"
            name="images"
            onChange={handleImages}
            disabled={false}
            label="Photos (plusieurs éléments autorisés)"
            required={false}
            multiple={true}
          />

          <DashboardButton defaultText="Modifier" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default EditRoom;
