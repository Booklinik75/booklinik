import { AiFillInfoCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { getDate, isWithinInterval } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";

const DatesSelectStep = ({
  onCalendarStartDateChange,
  onCalendarEndDateChange,
  booking,
  addDays,
  setNextStep,
}) => {

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const [focusRange, setFocusRange] = useState([]);
  const [disabledDate, setDisabledDate] = useState(new Array());


  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if ( booking.startDate &&
      booking.endDate &&
      booking.endDate !== booking.startDate) {
      setNextStep(true);
    }
  }, [booking]);
  const PushData = (data) => {
    setDisabledDate([[], ...data]);
  };

  const RemoveDisabledDate = () => {
    setDisabledDate([]);
  };
  const onChange = (dates) => {
    const [start, end] = dates;

    let numberOfNights
    setStartDate(start);
    onCalendarStartDateChange(start);
    setEndDate(end);
    DisabledMinrange();


    function DisabledMinrange() {
      let celldisabled = [];

      var newday = new Date(start);


      if (start) {
        for (let i = 1; i < parseInt(booking.minimumNights); i++) {
          celldisabled.push(new Date(newday.setDate(newday.getDate() + 1)));
        }

        PushData(celldisabled);
        if (end) {

          let timeDiff = Math.abs(end.getTime() - start.getTime());
          numberOfNights= Math.ceil(timeDiff / (1000 * 3600 * 24));

          RemoveDisabledDate();
          onCalendarEndDateChange(end, numberOfNights);
          return numberOfNights
        }


      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">
        Choisissez vos dates de voyage
        {booking.totalSelectedNights !== 0 &&
        booking.totalSelectedNights >= parseInt(booking.minimumNights) ? (
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
            <style>
              {`.react-datepicker {
  font-size: 1em;
  font-family:helvetica;
}
.react-datepicker__header {
  padding-top: 0.8em;
}
.react-datepicker__month {
  margin: 0.4em 1em;
}
.react-datepicker__day-name, .react-datepicker__day {
  width: 2.9em;
  height:2.5em;
  line-height: 1.9em;
  margin: 0.166em;
}
.react-datepicker__day-names{
  margin-top: 5px;
}
.react-datepicker__current-month {
  font-size: 1.3em;
}
.react-datepicker__navigation {
  top: 1em;
  line-height: 1.7em;
  border: 0.45em solid transparent;
}
.react-datepicker__navigation--previous {
  left: 1em;
}
.react-datepicker__day--keyboard-selected{
  background-color: #33c383 !important;
}
.react-datepicker__day--in-range {
  background-color: #33c383 !important;
}

      }`}
            </style>
            <h2 className="text-xs uppercase text-gray-500">Dates</h2>
            <div className="h-92 relative">
            <DatePicker
              moveRangeOnFirstSelection={true}
              focusPlage={setFocusRange}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              excludeDates={disabledDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesSelectStep;
