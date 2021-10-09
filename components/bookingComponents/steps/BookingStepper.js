import BookingUi from "../BookingUi";
import { BsArrowRight, BsArrowLeft, BsCheck } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";
import { Children, useState } from "react";
import { useRouter } from "next/router";
import firebase from "../../../firebase/clientApp";

const FormStepper = ({ children, booking, user }) => {
  const stepsArray = Children.toArray(children);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const doBooking = () => {
    setIsSaving(true);

    firebase
      .firestore()
      .collection("bookings")
      .add({ user: user.uid, status: "examining", ...booking })
      .then(() => {
        router.push(`/dashboard`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <BookingUi bookingData={booking} step={step}>
      <div className="col-span-12 relative">
        {isSaving && (
          <div className="w-full h-full absolute z-50 bg-opacity-20 bg-black flex flex-col gap-4 items-center justify-center">
            <span className="animate-spin">
              <VscLoading size={48} />
            </span>
            Sauvegarde en cours ...
          </div>
        )}
        <div className="p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
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
                  onClick={(e) => {
                    e.preventDefault();
                    doBooking();
                  }}
                >
                  Soumettre <BsCheck />
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {step === stepsArray.length - 2 ? "Finaliser" : "Continuer"}
                  <BsArrowRight />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </BookingUi>
  );
};

export default FormStepper;
