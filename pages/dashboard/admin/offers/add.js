import DashboardUi from "components/DashboardUi";
import { checkAdmin } from "utils/ServerHelpers";
import Select from "react-select";
import { getOperationCategories } from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useState } from "react";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAdmin(ctx);
  if (auth.redirect) return auth;

  async function getSurgeries() {
    const snapshot = await firebase.firestore().collection("surgeries").get();
    return snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }

  const categories = await getOperationCategories();
  const surgeries = await getSurgeries();

  // build options for select
  const categoryOptions = [];
  categories.forEach((category) => {
    categoryOptions.push({
      value: category.id,
      label: category.name,
      slug: category.slug,
    });
  });

  // create grouped surgery options into an array where the surgery category attribute corresponds to a category slug
  const groupedOptions = [];
  categoryOptions.forEach((category) => {
    const surgeryOptions = [];
    surgeries.forEach((surgery) => {
      if (surgery.category === category.slug) {
        surgeryOptions.push({
          value: surgery.id,
          label: surgery.name,
          slug: surgery.slug,
        });
      }
    });

    groupedOptions.push({
      label: category.label,
      options: surgeryOptions,
    });
  });

  // get hotels and hotel rooms
  async function getHotels() {
    const snapshot = await firebase.firestore().collection("hotels").get();
    return snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }

  async function getHotelRooms() {
    const snapshot = await firebase.firestore().collection("rooms").get();
    return snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }
  const hotels = await getHotels();
  const hotelRooms = await getHotelRooms();

  // build options for select
  const hotelOptions = [];
  hotels.forEach((hotel) => {
    hotelOptions.push({
      value: hotel.id,
      label: hotel.name,
      slug: hotel.slug,
    });
  });

  // create grouped hotel rooms options into an array where the hotel attribute corresponds to a hotel slug
  const groupedHotelRooms = [];
  hotelOptions.forEach((hotel) => {
    const hotelRoomOptions = [];
    hotelRooms.forEach((hotelRoom) => {
      if (hotelRoom.hotel === hotel.slug) {
        hotelRoomOptions.push({
          value: hotelRoom.id,
          label: hotelRoom.name,
          slug: hotelRoom.slug,
        });
      }
    });

    groupedHotelRooms.push({
      label: hotel.label,
      options: hotelRoomOptions,
    });
  });

  // get clinics
  async function getClinics() {
    const snapshot = await firebase.firestore().collection("clinics").get();
    return snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }

  const clinics = await getClinics();

  // build options for clinics select
  const clinicOptions = [];
  clinics.forEach((clinic) => {
    clinicOptions.push({
      value: clinic.id,
      label: clinic.name,
      slug: clinic.slug,
    });
  });

  return {
    props: { auth, groupedOptions, groupedHotelRooms, clinicOptions },
  };
};

const AddOffer = ({
  auth,
  groupedOptions,
  groupedHotelRooms,
  clinicOptions,
}) => {
  const router = useRouter();
  // has the image been uploaded?
  const [imageUploadComplete, setImageUploadComplete] = useState(false);

  // is the form being submitted?
  const [isSubmitting, setIsSubmitting] = useState(false);

  // uploaded image url
  const [imageUrl, setImageUrl] = useState("");

  const [offer, setOffer] = useState({
    name: "",
    description: "",
    price: "",
    surgery: "",
    hotelRoom: "",
    startDate: "",
    endDate: "",
    dates: [],
  });

  const handleChange = (e) => {
    setOffer({
      ...offer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption, name) => {
    setOffer({
      ...offer,
      [name]: selectedOption.value,
    });
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`offers/${file.name}`).put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      (error) => {
        // trigger sentry event
        toast.error("Une erreur est survenue");
      },
      () => {
        // complete function
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImageUrl(downloadURL);
          setImageUploadComplete(true);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // create data object for offer
    const offerData = {
      ...offer,
      imageUrl,
      createdAt: new Date(),
      createdBy: auth.props.token.uid,
    };

    // create offer in firestore
    try {
      await firebase
        .firestore()
        .collection("offers")
        .add(offerData)
        .then(() => {
          toast.success("Offre ajoutée avec succès");
        })
        .catch((error) => {
          toast.error("Une erreur est survenue");
        })
        .finally(() => {
          router.push("/dashboard/admin/offers");
        });
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la mise en ligne de l'image"
      );
    }
  };

  console.log(offer);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Créer une offre</h1>
        </div>
        <div className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nom de l&apos;offre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nom de l'offre"
                required
                value={offer.name}
                onChange={handleChange}
                name="name"
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                placeholder="Description"
                required
                name="description"
                onChange={handleChange}
                value={offer.description}
              />
              <p className="text-gray-500 text-xs italic">
                La description de l&apos;offre est affichée sur la page
                d&apos;accueil de l&apos;offre.
              </p>
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="clinic"
              >
                Clinique
              </label>
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="clinic"
                options={clinicOptions}
                placeholder="Clinique"
                required
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "clinic")
                }
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category"
              >
                Chirurgie
              </label>
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                options={groupedOptions}
                placeholder="Choisir une catégorie"
                isSearchable
                name="surgery"
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "surgery")
                }
              />
              <p className="text-gray-500 text-xs italic">
                La catégorie de l&apos;offre est utilisée pour afficher les
                offres dans leur catégorie. Les catégories sont généralement
                définies dans les paramètres du site.
              </p>
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="previewPicture"
              >
                Image de prévisualisation
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="previewPicture"
                type="file"
                placeholder="Image de prévisualisation"
                required
                value={offer.previewPicture}
                onChange={handleFileUpload}
                name="previewPicture"
              />
              <p className="text-gray-500 text-xs italic">
                L&apos;image de prévisualisation est utilisée pour afficher
                l&apos;offre sur la page d&apos;accueil.
              </p>
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="surgery"
              >
                Chambre d&apos;hôtel
              </label>
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                options={groupedHotelRooms}
                placeholder="Choisir une chambre d'hôtel"
                isSearchable
                name="hotelRoom"
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "hotelRoom")
                }
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Prix
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="Prix"
                required
                value={offer.price}
                name="price"
                onChange={handleChange}
              />
              <p className="text-gray-500 text-xs italic">
                Le prix de l&apos;offre est affiché sur la page d&apos;accueil
                de l&apos;offre.
              </p>
            </div>
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="offerExpiration"
              >
                Date d&apos;expiration
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="offerExpiration"
                type="date"
                placeholder="Date d'expiration"
                required
                value={offer.offerExpiration}
                name="offerExpiration"
                onChange={handleChange}
              />
              <p className="text-gray-500 text-xs italic">
                La date d&apos;expiration de l&apos;offre est affichée sur la
                page d&apos;accueil de l&apos;offre.
              </p>
            </div>

            {/* Input where you define a start and end date, and add it to the state when pressing a button */}
            <div className="p-2 bg-blue-50 rounded border border-blue-700">
              <p className="block text-blue-700 text-sm font-bold mb-2">
                Dates disponibles
              </p>
              {offer.dates.length > 0 && (
                <div className="space-y-2">
                  <p>Options choisies</p>
                  <div className="grid grid-cols-3 gap-4">
                    {offer.dates.map((date, index) => (
                      <div
                        key={index}
                        className="col-span-1 p-2 bg-blue-100 rounded border border-blue-700 flex justify-between"
                      >
                        Option {index + 1} : {date.startDate} - {date.endDate}
                        <button
                          className="text-blue-700"
                          onClick={() => {
                            // Remove the date from the state
                            setOffer({
                              ...offer,
                              dates: offer.dates.filter((_, i) => i !== index),
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 p-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startDate"
                >
                  Date de début
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="startDate"
                  type="date"
                  placeholder="Date de début"
                  required
                  value={offer.startDate}
                  name="startDate"
                  onChange={handleChange}
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endDate"
                >
                  Date de fin
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="endDate"
                  type="date"
                  placeholder="Date de fin"
                  required
                  value={offer.endDate}
                  name="endDate"
                  onChange={handleChange}
                />
                <p className="text-gray-500 text-xs italic">
                  La date de début et de fin sont utilisées pour déterminer si
                  l&apos;offre est disponible ou non.
                </p>

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setOffer({
                      ...offer,
                      dates: [
                        ...offer.dates,
                        {
                          startDate: offer.startDate,
                          endDate: offer.endDate,
                        },
                      ],
                    });
                  }}
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* submit button */}
            <div className="flex ">
              <button
                className="transition bg-shamrock hover:white text-white border border-shamrock hover:text-shamrock hover:bg-white 
                font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:bg-shamrock/50 disabled:hover:bg-shamrock/50
                disabled:cursor-not-allowed disabled:hover:text-white"
                type="submit"
                disabled={isSubmitting || !imageUploadComplete}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardUi>
  );
};

export default AddOffer;
