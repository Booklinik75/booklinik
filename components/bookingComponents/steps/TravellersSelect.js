import { FaUserAlt } from "react-icons/fa";

const TravellersSelectStep = ({ booking, setBooking }) => {
  const handleIncrement = (e) => {
    if (e.target.attributes.do.value === "add") {
      setBooking({
        ...booking,
        [e.target.attributes.name.value]:
          booking[e.target.attributes.name.value] + 1,
      });
    } else if (
      e.target.attributes.do.value === "substract" &&
      booking[e.target.attributes.name.value] > 0
    ) {
      setBooking({
        ...booking,
        [e.target.attributes.name.value]:
          booking[e.target.attributes.name.value] - 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">Souhaitez-vous être accompagné•e ? ?</h1>
      <div className="w-52 flex justify-center flex-col">
        <div className="flex items-center p-4 justify-between border rounded-t border-gray-500">
          <div className="flex items-center gap-2 ">
            <FaUserAlt />{" "}
            {booking.extraTravellers +
              booking.extraChilds +
              booking.extraBabies +
              1}{" "}
            voyageurs
          </div>
          <div>
            <p className="text-xs text-gray-500">
              {booking.totalExtraTravellersPrice > 0
                ? `+${booking.totalExtraTravellersPrice}€`
                : ""}
            </p>
          </div>
        </div>
        <div className="border rounded-b border-gray-500 p-4 border-t-0 space-y-3">
          <div className="flex items-center justify-between">
            <p>Adultes</p>
            <div className="flex gap-2 items-center">
              <button
                className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                name="extraTravellers"
                do="substract"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                -
              </button>
              <p>{booking.extraTravellers}</p>
              <button
                className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                name="extraTravellers"
                do="add"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Enfants</p>
              <p className="text-xs text-gray-400">2 à 12 ans</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                name="extraChilds"
                do="substract"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                -
              </button>
              <p>{booking.extraChilds}</p>
              <button
                className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                name="extraChilds"
                do="add"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p>Bébés</p>
            <div className="flex gap-2 items-center">
              <button
                className="text-bali border border-gray-400 rounded px-3 pb-1 transition hover:bg-bali hover:text-white"
                name="extraBabies"
                do="substract"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                -
              </button>
              <p>{booking.extraBabies}</p>
              <button
                className="text-shamrock border border-shamrock transition rounded px-3 pb-1 hover:bg-shamrock hover:text-white"
                name="extraBabies"
                do="add"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement(e);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravellersSelectStep;
