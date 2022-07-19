import { AiFillInfoCircle } from "react-icons/ai";
import Calendar from "react-calendar";
import { isWithinInterval } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";

const DatesSelectStep = ({
  onCalendarStartDateChange,
  onCalendarEndDateChange,
  booking,
  addDays,
  setNextStep,
}) => {
  const initialvalue= new Date()
  const [hideReturnCalendar, setHideReturnCalendar] = useState(true);
  const [dateCalendar, setDateCalendar] = useState([booking.startDate,new Date()]);

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
        {booking.totalSelectedNights !== 0 && booking.totalSelectedNights>=parseInt(booking.minimumNights)? (
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
                
                setDateCalendar(e)
                console.log(e[1]+'-------------------XXXXXX--------------')   

                onCalendarStartDateChange(e[0]);
                setHideReturnCalendar(false);

                let timeDiff = Math.abs(
                  
                  e[1].getTime() -e[0].getTime()
                );
               
                let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24))-1;
                  onCalendarEndDateChange(e[1], numberOfNights);
                
                
              
              }}
              
              returnValue="range"
              value={dateCalendar}
              locale="fr"
              
              minDate={new Date()}
              //Fuction to disabled minimum night with react-calendar
              tileDisabled={({activeStartDate, date, view }) =>date.getMonth() === dateCalendar[0].getMonth()?   date.getDate() < dateCalendar[0].getDate()+parseInt(booking.minimumNights) && date.getDate()> dateCalendar[0].getDate(): date.getDate()<dateCalendar[0].getDate()+parseInt(booking.minimumNights)-31}
              
              selectRange="true"
             
            />
           
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default DatesSelectStep;
