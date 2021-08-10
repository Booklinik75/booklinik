import Image from "next/image";
import StarRating from "../../StarRating";
import { BiBed } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";

const RoomsSelectStep = ({ booking, rooms, handleRoomSelect }) => {
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl mb-6">
        Un hôtel atypique, bon choix le{" "}
        <span className="text-shamrock">{booking.hotelName}</span> !
      </h1>
      <div className="grid grid-cols-9 gap-12 h-3/4 max-h-full">
        <div className="col-span-3 space-y-3">
          <p className="text-xs text-gray-500 uppercase pt-2">Hôtel</p>
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
                <div key={room.slug}>
                  <input
                    type="radio"
                    name="room"
                    id={room.slug}
                    value={room.slug}
                    formNoValidate={true}
                    onChange={(e) =>
                      handleRoomSelect(
                        room.slug,
                        room.extraPrice,
                        room.photos[0]
                      )
                    }
                    className="hidden"
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
                </div>
              ) : (
                ""
              );
            })}
          </div>
        </div>
        <div className="col-span-6 space-y-6 max-h-192 overflow-y-scroll">
          {rooms.map((room) => {
            return room.hotel === booking.hotel ? (
              <div className="space-y-2">
                <h2 className="text-xl flex items-center gap-2">
                  {room.name}{" "}
                  {room.slug === booking.room ? (
                    <span className="text-shamrock">
                      <AiFillCheckCircle />
                    </span>
                  ) : (
                    ""
                  )}
                </h2>
                <div className="grid grid-rows-2 grid-cols-4 h-64 gap-4">
                  <div className="row-span-2 col-span-2 relative">
                    <Image
                      src={room.photos[0]}
                      layout="fill"
                      objectFit="cover"
                      alt={room.name}
                      className="rounded transition bg-gray-300"
                    />
                  </div>
                  {room.photos.slice(1).map((roomPhoto, index) => {
                    return (
                      <div
                        key={index}
                        className="row-span-1 col-span-1 relative"
                      >
                        <Image
                          src={roomPhoto}
                          layout="fill"
                          objectFit="cover"
                          alt={room.name}
                          className="rounded transition bg-gray-300"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomsSelectStep;
