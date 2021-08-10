import BookingUi from "../BookingUi";
import { BsArrowRight, BsArrowLeft, BsCheck } from "react-icons/bs";
import { Children, useState } from "react";

const FormStepper = ({ children, booking }) => {
  const stepsArray = Children.toArray(children);
  const [step, setStep] = useState(0);

  return (
    <BookingUi bookingData={booking} step={step}>
      <div className="col-span-12 p-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // doBooking();
          }}
          className="space-y-6"
        >
          {stepsArray[step]}

          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
              >
                <BsArrowLeft /> Précédent
              </button>
            ) : (
              ""
            )}
            {step === stepsArray.length - 1 ? (
              <button
                type="submit"
                className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Soumettre <BsCheck />
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Suivant <BsArrowRight />
              </button>
            )}
          </div>
        </form>
      </div>
    </BookingUi>
  );
};

export default FormStepper;
