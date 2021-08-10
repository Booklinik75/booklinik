import StarRating from "../../StarRating";
import Image from "next/image";

const OptionsSelectStep = ({ options, booking }) => {
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
          <p className="text-xs text-gray-500 uppercase pt-2">Chambre</p>
          <div className="h-64 relative">
            <Image
              src={booking.roomPhotoLink}
              layout="fill"
              objectFit="cover"
              alt={booking.roomName}
              className="rounded transition brightness-75"
            />
            <div className="absolute bottom-0 left-0 m-4">
              <h2 className="text-lg block w-full top-28 text-white text-left">
                {booking.roomName}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-white text-xs capitalize">
                  {booking.roomName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 grid grid-cols-2 space-y-3">
          <p className="text-xs text-gray-500 uppercase pt-2 grid-cols-2">
            Options
          </p>
          {console.log(options)}
          {options[booking.hotelId].map((option, index) => {
            return <div key={index}>{console.log(option)}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default OptionsSelectStep;
