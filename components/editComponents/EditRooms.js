import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import { useEffect, useState } from "react";

const EditRooms = ({ roomName, setRoomName, hotel }) => {
  const [openRooms, setOpenRooms] = useState(false);
  const [rooms, setRooms] = useState([]);

  const handleClick = (room) => {
    setRoomName(room);
    setOpenRooms(false);
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openRooms) {
        if (e.target.closest("#dropdown-rooms") === null) {
          setOpenRooms(false);
        }
      }
    };

    const getRooms = async () => {
      const rooms = [];
      await firebase
        .firestore()
        .collection("rooms")
        .where("hotel", "==", hotel.slug)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            rooms.push(doc.data());
          });
        })
        .catch((err) => {});
      setRooms(rooms);
    };
    getRooms();
  }, [openRooms, hotel]);

  return (
    <div>
      <span
        className={`border p-2 px-4 py-3 rounded align-middle mx-2 ${
          rooms.find((room) => room.name === roomName)
            ? "border-shamrock"
            : "border-red-600"
        }  cursor-pointer`}
        id="inputRoomName"
        onClick={() => setOpenRooms((openRooms) => !openRooms)}
        style={{
          width: "fit-content",
        }}
      >
        {roomName}
      </span>
      {openRooms && rooms.length !== 0 && (
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
              {rooms.map((room) => (
                <li
                  key={room.slug}
                  onClick={() => handleClick(room.name)}
                  className="p-3 py-2 w-100 hover:bg-gray-100"
                >
                  {room.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default EditRooms;
