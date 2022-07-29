import { AiFillInfoCircle } from "react-icons/ai";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import { getDate, isWithinInterval } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";

const DatesSelectStep = ({
  onCalendarStartDateChange,
  onCalendarEndDateChange,
  booking,
  addDays,
  setNextStep,
}) => {
  const disabledDays = new Array(
    new Date(new Date().setDate(new Date().getDate() + 1)),
    new Date(new Date().setDate(new Date().getDate() + 2))
  );
  const initialvalue = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [hideReturnCalendar, setHideReturnCalendar] = useState(true);
  const [disabledDate, setDisabledDate] = useState(
    new Array(
      new Date().setDate(new Date().getDate() + 1),
      new Date().setDate(new Date().getDate() + 1),
      new Date().setDate(new Date().getDate() + 3)
    )
  );
  const [dateCalendar, setDateCalendar] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (startDate && endDate && endDate !== startDate) {
      setNextStep(true);
    }
  }, [booking]);
  const PushData = (data) => {
    setDisabledDate([...disabledDate, ...data]);
    console.log(data + "=======in function=========/ ");
  };
  const RemoveDisabledDate = () => {
    setDisabledDate([]);
  };
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    DisabledMinrange(start);
    console.log(dates + "=======in onchange=========/ ");
    function DisabledMinrange(data) {
      let celldisabled = [];
      var newday = new Date(start);

      if (start) {
        for (let i = 1; i < 4; i++) {
          celldisabled.push(new Date(newday.setDate(newday.getDate() + 1)));
          console.log(i + "increment ==========date======");
        }

        end ? RemoveDisabledDate() : PushData(celldisabled);

        console.log(celldisabled + "cell disabled ==========date======");
        console.log(new Date(start) + "date ==========newDate5start======");
      } else if (end) {
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
          {console.log(startDate + "--------startDate---------")}
          {console.log(endDate + "--------endDate---------")}
          <div className="w-full lg:w-1/2 xl:w-1/3 space-y-3">
            <h2 className="text-xs uppercase text-gray-500">
              {console.log(disabledDate) + "============State disablcmded"}Date
              de départ
            </h2>
            <DatePicker
              selected={startDate}
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
  );
};

export default DatesSelectStep;
