import { AiFillInfoCircle } from "react-icons/ai";
import Calendar from "react-calendar";
import { useState } from "react";
import { useEffect } from "react";

const DatesSelectStep = ({
  onCalendarStartDateChange,
  onCalendarEndDateChange,
  booking,
  addDays,
  setNextStep,
}) => {
  const [hideReturnCalendar, setHideReturnCalendar] = useState(true);

  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (
      booking.startDate &&
      booking.endDate &&
      booking.endDate !== booking.startDate
    ) {
      setNextStep(true);
    }
  }, [booking]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">
        Choisissez vos dates de voyage
        {booking.totalSelectedNights !== 0 ? (
          <span className="text-white p-2 ml-2 bg-shamrock rounded text-lg">
            {booking.totalSelectedNights} nuits
          </span>
        ) : (
          ""
        )}{" "}
      </h1>
      <p className="p-4 bg-green-50 border-green-400 text-shamrock border rounded w-full max-w-max">
        <span className="text-lg flex items-center gap-2">
          <AiFillInfoCircle /> Bon à savoir
        </span>
        Vous avez la possibilité de rester plus longtemps sur place afin de
        profiter de la ville que vous choisissez.
        <br />
        Pour cette opération, vous devrez sélectionner un minimum de{" "}
        <span className="font-bold underline">
          {parseInt(booking.minimumNights)} nuits
        </span>
        .
      </p>
      <div className="space-y-2">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
            <h2 className="text-xs uppercase text-gray-500">Date de départ</h2>
            <Calendar
              onChange={(e) => {
                onCalendarStartDateChange(e);
                setHideReturnCalendar(false);
              }}
              value={booking.startDate}
              locale="fr"
              minDate={new Date()}
              defaultValue={new Date()}
            />
          </div>
          <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
            <h2 className="text-xs uppercase text-gray-500">Date de retour</h2>
            <div className="relative">
              {hideReturnCalendar && (
                <div className="w-full h-full absolute bg-white bg-opacity-70 z-20 flex items-center justify-center">
                  <p className="bg-shamrock px-4 py-2.5 rounded shadow text-white">
                    Sélectionnez une date de départ
                  </p>
                </div>
              )}
              <Calendar
                onChange={(e) => {
                  let timeDiff = Math.abs(
                    e.getTime() - booking.startDate.getTime()
                  );
                  let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  onCalendarEndDateChange(e, numberOfNights);
                }}
                value={booking.endDate}
                locale="fr"
                minDate={addDays(
                  booking.startDate,
                  parseInt(booking.minimumNights)
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesSelectStep;
