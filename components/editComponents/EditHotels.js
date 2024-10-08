import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import { useEffect, useState } from "react";
import { getBackEndAsset } from "utils/ClientHelpers";

const EditHotels = ({ hotel, setHotel, city, setOptions }) => {
  const [openHotels, setOpenHotels] = useState(false);
  const [hotels, setHotels] = useState([]);

  const getOptions = async () => {
    await firebase
      .firestore()
      .collection("options")
      .doc(hotel.hotelId)
      .get()
      .then((snapshot) => {
        setOptions((opts) => {
          return snapshot.data()[0].map((data) => {
            const isExist = opts.find((opt) => opt.name === data.name);
            if (isExist) {
              return data.name === isExist?.name
                ? isExist
                : { ...data, isChecked: false };
            }
            return { ...data, isChecked: false };
          });
        });
      })
      .catch((err) => {});
  };

  const handleClick = async (hotel) => {
    setHotel({
      hotelName: hotel.name,
      hotel: hotel.slug,
      hotelPrice: Number(hotel.extraPrice),
      hotelId: hotel.id,
      hotelPhotoLink: await getBackEndAsset(hotel.photo),
      hotelRating: hotel.rating,
    });
    setOpenHotels(false);

    getOptions();
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openHotels) {
        if (e.target.closest("#dropdown-hotels") === null) {
          setOpenHotels(false);
        }
      }
    };
    const getHotels = async () => {
      const hotels = [];
      await firebase
        .firestore()
        .collection("hotels")
        .where("city", "==", city)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            hotels.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch((err) => {});
      setHotels(hotels);
    };
    getHotels();
  }, [openHotels, city]);

  return (
    <div>
      <span
        className="border p-2 py-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer"
        id="inputHotelName"
        onClick={() => setOpenHotels((openHotels) => !openHotels)}
        style={{
          width: "fit-content",
        }}
      >
        {hotel.hotelName}
      </span>
      {openHotels && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-6px" }}
          >
            <ul
              id="dropdown-hotels"
              className="absolute left-2 w-40 shadow-md overflow-y-scroll cursor-pointer rounded-md bg-white border-shamrock border dropdown-hotels"
              style={{
                top: "calc(100% + 1rem)",
                width: "fit-content",
                maxHeight: "10rem",
              }}
            >
              {hotels.map((htl) => (
                <li
                  key={htl.hotel}
                  onClick={() => handleClick(htl)}
                  className="p-3 py-2 w-100 hover:bg-gray-100"
                >
                  {htl.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default EditHotels;
