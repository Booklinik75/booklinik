import BookingUi from "../BookingUi";
import { BsArrowRight, BsArrowLeft, BsCheck } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";
import { Children, useState } from "react";
import { useRouter } from "next/router";
import firebase from "../../../firebase/clientApp";
import { useContext,useEffect } from "react";
import { BookContext } from "../../../utils/bookContext";
import ModalNoSignUp from "Components/ModalNoSignUp";

const FormStepper = ({
  children,
  booking,
  user,
  nextStep,
  step,
  setStep, 
  setNextStep,
  userProfile,
}) => {
  const [showModal, setShowModal] = useState(false);
  const stepsArray = Children.toArray(children);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { isChecked } = useContext(BookContext);

  const mail = require("@sendgrid/mail");
  mail.setApiKey(process.env.SENDGRID_API_KEY);

  const totalPrice =
    Number(booking.surgeries[0].surgeryPrice) +
    Number(booking.totalExtraTravellersPrice) +
    Number(booking.roomPrice) * Number(booking.totalSelectedNights) +
    booking.options
      ?.map((option) => option.isChecked && Number(option.price))
      .reduce((a, b) => a + b);

  const doBooking = () => {
    // if user have't login and do book
    if (user === null) {
      router.push("/signup?i=anonBooking");
      localStorage.setItem("bookBooklinik", JSON.stringify(booking));
      return;
    }
   
    setIsSaving(true);

    firebase
      .firestore()
      .collection("bookings")
      .add({
        user: user.uid,
        status: "awaitingDocuments",
        total: isChecked ? totalPrice - userProfile.referalBalance : totalPrice,
        ...booking,
      })
      .then(() => {
        firebase.firestore().collection("users").doc(userProfile.id).update({
          referalBalance: 0,
        });
        fetch("/api/mail", {
          method: "post",
          body: JSON.stringify({
            recipient: user.email,
            templateId: "d-b504c563b53846fbadb0a53151a82d57",
          }),
        });
      })
  .then(() => {
    fetch("/api/mail", {
      method: "post",
      body: JSON.stringify({
        recipient: "salahelbouhali93@gmail.com",
        templateId: "d-351874c7be9348778ef89f40ddfe8729",
        dynamicTemplateData: {
          booking: {
            date: booking.created,
            offerName: booking.offerName,
            surgeryName: booking.surgeries[0].surgeryName,
            surgeryCategoryName: booking.surgeries[0].surgeryCategoryName,
            link: `https://booklinik.com/dashboard/sales/bookings/${booking.id}`,
            startDate: booking.startDate,
            endDate: booking.endDate,
            hotelName: booking.hotelName,
            total: totalPrice,
            totalSelectedNights: booking.totalSelectedNights,
            room: booking.room,
            city: booking.city,
          },
        },
      }),
    });
  })
  .then(() =>{
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event: "form_success",value: "toplamTutar"});
  })
  .then(() => {
    router.push("/dashboard");

  });
};


const handleOnClose= (e) => {
    
  setShowModal(false);

};



  return (
    
    <BookingUi bookingData={booking} step={step} userProfile={userProfile}>
      <div className="col-span-12 relative">
        {isSaving && (
          <div className="w-full h-full absolute z-30 bg-opacity-20 bg-black flex flex-col gap-4 items-center justify-center">
            <span className="animate-spin">
              <VscLoading size={48} />
            </span>
            Sauvegarde en cours ...
          </div>
        )}
        <div className="p-12 pt-32 lg:p-10 lg:pt-32">
        {step > 0 ? (
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    setStep((s) => s - 1);
                  }}
                  className="flex items-center gap-1 mb-2 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                >
                  <BsArrowLeft /> Précédent
                </button>
              ) : (
                ""
              )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            {stepsArray[step]}

            <div className="flex flex-col gap-3 xl:flex-row items-center xl:gap-3">
              
              {step === stepsArray.length - 1 ? (
                <>
                <button
                  type="submit"
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault();
                    doBooking();
                  }}
                >
                Soumettre et s&apos;inscrire<BsCheck />
                </button>
                 <button
                 type="submit"
                 className="flex items-center gap-1 border border-gray-500 bg-white text-gray-500 transition hover:bg-gray-500 hover:text-white px-5 py-2 rounded"
                 onClick={(e) => {
                   e.preventDefault();
                  setShowModal(true)
                 }}
               >
                Continuer sans inscription <BsCheck />
               </button>
               </>
              ) : (
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    // if nextStep is true
                    if (nextStep) {
                      setNextStep(false);
                      setStep((s) => s + 1)
                    }
                  }}
                  className="flex items-center gap-1 border border-shamrock bg-shamrock text-white transition hover:bg-white hover:text-shamrock px-5 py-2 rounded disabled:hover:bg-shamrock disabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!nextStep}
                  
                >
               
                  {step === stepsArray.length - 2 ? "Finaliser" : "Continuer"}
                  <BsArrowRight />
                </button>
              )}
            </div>
          </form>
          <ModalNoSignUp onClose={handleOnClose} visible={showModal} booking={booking} />
        </div>
      </div>
    </BookingUi>
  );
};

export default FormStepper;
