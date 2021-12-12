import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import { useEffect, useState } from "react";

const EditRooms = ({
  rooms,
  room: bookingRoom,
  setRoom,
  hotel,
  operations,
  options,
  setTotalPrice,
  voyageurs,
  totalSelectedNights,
}) => {
  const [openRooms, setOpenRooms] = useState(false);

  const handleClick = (room) => {
    setRoom({
      roomName: room.name,
      room: room.slug,
      roomPrice: Number(room.extraPrice),
      roomPhotoLink: room.photos ? room.photos[0] : null,
    });

    setTotalPrice(
      options
        .map((option) => option.isChecked && Number(option.price))
        .reduce((a, b) => a + b) +
        operations.reduce((prev, curr) => prev + curr.surgeryPrice, 0) +
        room.roomPrice * totalSelectedNights +
        hotel.hotelPrice * totalSelectedNights +
        (voyageurs.childs + (voyageurs.adults - 1) + voyageurs.babies) * 450
    );

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
  }, [openRooms]);

  return (
    <div>
      <span
        className={`border p-2 px-4 py-3 rounded align-middle mx-2 ${
          rooms.find((room) => room.name === bookingRoom.roomName)
            ? "border-shamrock"
            : "border-red-600"
        }  cursor-pointer`}
        id="inputRoomName"
        onClick={() => setOpenRooms((openRooms) => !openRooms)}
        style={{
          width: "fit-content",
        }}
      >
        {bookingRoom.roomName}
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
                  onClick={() => handleClick(room)}
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
