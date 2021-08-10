import { AiFillInfoCircle } from "react-icons/ai";
import Calendar from "react-calendar";

const DatesSelectStep = ({
  onCalendarStartDateChange,
  onCalendarEndDateChange,
  booking,
  addDays,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">Choisissez vos dates de voyage</h1>
      <p className="p-4 bg-green-50 border-green-400 text-shamrock border rounded w-full max-w-max">
        <span className="text-lg flex items-center gap-2">
          <AiFillInfoCircle /> Bon à savoir
        </span>
        Vous avez la possibilité de rester plus longtemps sur place afin de
        profiter de la ville que vous choisissez.
      </p>
      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
            <h2 className="text-xs uppercase text-gray-500">Date de départ</h2>
            <Calendar
              onChange={onCalendarStartDateChange}
              value={booking.startDate}
              locale="fr"
              minDate={new Date()}
            />
          </div>
          <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
            <h2 className="text-xs uppercase text-gray-500">Date de retour</h2>
            <Calendar
              onChange={onCalendarEndDateChange}
              value={booking.endDate}
              locale="fr"
              minDate={addDays(booking.startDate, 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesSelectStep;
