import DashboardUi from "../../../../components/DashboardUi";
import { checkAdmin, getHotels } from "../../../../utils/ServerHelpers";
import firebase from "../../../../firebase/clientApp";
import { useRouter } from "next/router";
import DashboardInput from "../../../../components/DashboardInput";
import { useState, useEffect, useRef } from "react";
import DashboardButton from "../../../../components/DashboardButton";
import slugify from "slugify";
import ProfileSelect from "../../../../components/ProfileSelect";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  const { slug } = ctx.query;
  const hotels = await getHotels();

  const hotelsOptions = [];

  hotelsOptions.push({
    value: "default",
    label: "Sélectionner une option",
  });

  hotels.map((hotel) => {
    hotelsOptions.push({ value: hotel.slug, label: hotel.name });
  });

  return {
    props: {
      hotelsOptions: hotelsOptions,
      auth,
    },
  };
};

const AddRoom = ({ hotelsOptions, auth }) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState("idle");
  const [progress, setProgress] = useState(0);

  const [form, setFormData] = useState({
    name: "",
    slug: "",
    extraPrice: 0,
  });
  const [images, setImages] = useState([]);

  const [urls, setUrls] = useState([]);

  const handleChange = (e) => {
    if (e.target.name === "images") {
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    } else if (e.target.name === "name") {
      form.slug = slugify(e.target.value, { lower: true });
    } else if (e.target.type === "select-one") {
      form.hotel = e.target.value;
    }

    setFormData({
      ...form,

      // Trimming any whitespace
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
    const promises = [];
    let docData = {};

    images.map((image) => {
      const uploadTask = firebase
        .storage()
        .ref(`rooms/${image.name}`)
        .put(image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {},
        async () => {
          await firebase
            .storage()
            .ref("rooms")
            .child(image.name)
            .getDownloadURL()
            .then((urls) => {
              setUrls((prevState) => [...prevState, urls]);
            });
        }
      );
    });

    Promise.all(promises)
      .then(() => {})
      .catch((err) => {});
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (urls.length === images.length && images.length !== 0) {
        const doAdd = async (data) => {
          setLoading("loading");

          let docData = {
            name: form.name,
            slug: form.slug,
            extraPrice: form.extraPrice,
            photo: null,
            hotel: form.hotel,
            photos: urls,
          };

          firebase
            .firestore()
            .collection("rooms")
            .add(docData)
            .catch((error) => {})
            .finally(() => {
              setLoading("done");
              setTimeout(() => {
                setLoading("idle");
              }, 1000);
              router.push(`/dashboard/admin/rooms/edit/${form.slug}`);
            });
        };

        doAdd();
      } else if (urls.length > images.length) {
        router.reload(window.location.pathname);
      }
    }
  }, [
    form.extraPrice,
    form.hotel,
    form.name,
    form.slug,
    images.length,
    router,
    urls,
  ]);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl">Ajouter une chambre d&apos;hôtel</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
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
            onChange={handleChange}
            disabled={false}
            label="Photos (plusieurs éléments autorisés)"
            required={true}
            multiple={true}
          />
          <DashboardButton defaultText="Ajouter" status={isLoading} />
        </form>
      </div>
    </DashboardUi>
  );
};

export default AddRoom;
