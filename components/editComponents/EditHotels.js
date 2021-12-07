import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import { useEffect, useState } from "react";

const EditHotels = ({ hotel, setHotel, city }) => {
  const [openHotels, setOpenHotels] = useState(false);
  const [hotels, setHotels] = useState([]);

  const handleClick = (hotel) => {
    setHotel({
      name: hotel.name,
      slug: hotel.slug,
    });
    setOpenHotels(false);
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
            hotels.push(doc.data());
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
        {hotel.name}
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
                  key={htl.slug}
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
