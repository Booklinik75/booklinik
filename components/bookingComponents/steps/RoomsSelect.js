import Image from "next/image";
import StarRating from "../../StarRating";
import { BiBed } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";

const RoomsSelectStep = ({ booking, rooms, handleRoomSelect }) => {
  console.log(booking, rooms);
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl mb-6">
        Un hôtel atypique, bon choix le{" "}
        <span className="text-shamrock">{booking.hotelName}</span> !
      </h1>
      <p className="text-xs text-gray-500 uppercase">Hôtel</p>
      <div className="grid grid-cols-9 gap-4 h-3/4">
        <div className="col-span-3 space-y-3">
          <div className="h-64 relative">
            <Image
              src={booking.hotelPhotoLink}
              layout="fill"
              objectFit="cover"
              alt={booking.hotelName}
              className="rounded transition brightness-75"
            />
            <div className="absolute bottom-0 left-0 m-4">
              <h2 className="text-lg block w-full top-28 text-white text-left">
                {booking.hotelName}
              </h2>
              <div className="flex items-center gap-4">
                <StarRating value={booking.hotelRating} color="white" />
                <p className="text-white text-xs">&bull;</p>
                <p className="text-white text-xs capitalize">{booking.city}</p>
              </div>
            </div>
          </div>
          <p className="text-xs block text-gray-500 uppercase pt-4">Chambre</p>
          <div className="flex flex-col w-full gap-2">
            {rooms.map((room) => {
              return room.hotel === booking.hotel ? (
                <>
                  <input
                    type="radio"
                    name="room"
                    id={room.slug}
                    value={room.slug}
                    formNoValidate={true}
                    onChange={(e) =>
                      handleRoomSelect(room.slug, room.extraPrice)
                    }
                    className="hidden"
                    key={room.slug}
                  />
                  <label
                    htmlFor={room.slug}
                    className={
                      "p-4 transition flex items-center justify-between hover:shadow hover:cursor-pointer border rounded hover:border-bali " +
                      (room.slug === booking.room
                        ? "border-shamrock text-shamrock"
                        : "")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <BiBed />
                      <p>{room.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.extraPrice !== 0 ? (
                        <p className="text-xs text-gray-600">
                          +{room.extraPrice}€
                        </p>
                      ) : (
                        ""
                      )}
                      {room.slug === booking.room ? (
                        <span className="text-shamrock">
                          <AiFillCheckCircle size={24} />
                        </span>
                      ) : (
                        <span>
                          <BsCircle size={24} />
                        </span>
                      )}
                    </div>
                  </label>
                </>
              ) : (
                ""
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsSelectStep;
