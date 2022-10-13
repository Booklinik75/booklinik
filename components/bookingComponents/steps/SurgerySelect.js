import { IoIosCloseCircle } from "react-icons/io";
import { useEffect } from "react";

const SurgerySelectStep = ({
  surgeryCategories,
  booking,
  handleChange,
  surgeries,
  setBooking,
  handleSurgerySelect,
  handleSurgeryCategorySelect,
  setStep,
  setNextStep,
  surgeryCategory: getSurgeryCategory,
}) => {
  useEffect(() => {
    // setNextStep to true when all inputs are filled
    if (
      getSurgeryCategory.surgeryCategory &&
      booking.surgeries &&
      booking.surgeries[0].surgery
    ) {
      setNextStep(true);
    }
  }, [booking]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl mb-6">
        Selectionnez votre opération et estimez le coût de votre voyage.
      </h1>
      <div className="space-y-2">
        <h2 className="text-xs uppercase text-gray-500">
          Catégories d&apos;opérations
        </h2>
        <div className="grid grid-cols-12 gap-4 mb-2">
          {surgeryCategories.map((surgeryCategory) => {
            return (
              <div
                key={surgeryCategory.slug}
                className="col-span-6 lg:col-span-2 h-full relative"
              >
                {getSurgeryCategory.surgeryCategory === surgeryCategory.slug ? (
                  <button
                    onClick={() =>
                      setBooking({
                        surgeryCategory: "",
                        surgery: "",
                        surgeryPrice: 0,
                      })
                    }
                    key={surgeryCategory.slug}
                    className="m-2 absolute top-0 right-0 transition opacity-20 hover:opacity-100"
                  >
                  </button>
                ) : (
                  ""
                )}
                <input
                  id={surgeryCategory.slug}
                  type="radio"
                  name="surgeryCategory"
                  value={surgeryCategory.slug}
                  onChange={(e) =>
                    {handleSurgeryCategorySelect(
                      surgeryCategory.slug,
                      surgeryCategory.name
                    );
                    window.scrollTo(0, document.body.scrollHeight);}
                  }
                  className="hidden"
                  required={true}
                />
                <label
                  htmlFor={surgeryCategory.slug}
                  className={`flex flex-col transition items-center justify-center border w-full h-full rounded hover:shadow p-6 hover:border-shamrock ${
                    getSurgeryCategory.surgeryCategory === surgeryCategory.slug
                      ? "border-shamrock"
                      : ""
                  } ${
                    getSurgeryCategory.surgeryCategory !== "" &&
                    getSurgeryCategory.surgeryCategory !== surgeryCategory.slug
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <p className="text-center">{surgeryCategory.name}</p>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xs uppercase text-gray-500">Opérations</h2>
        <div className="grid grid-cols-12 gap-4">
          {surgeries.map((surgery) => {
            return getSurgeryCategory.surgeryCategory !== "" &&
              surgery.category === getSurgeryCategory.surgeryCategory ? (
              <div
                className="flex flex-col items-center col-span-6 lg:col-span-3"
                key={surgery.slug}
              >
                <input
                  id={surgery.slug}
                  value={surgery.slug}
                  className="hidden"
                  onChange={(e) =>{
                    handleSurgerySelect(
                      surgery.slug,
                      surgery.startingPrice,
                      surgery.name,
                      surgery.minimumNights,
                      surgery.cities
                    );
                    window.scrollTo(0, 0);
                    setStep((s) => s + 1)}
                  }

                  name="surgery"
                  type="radio"
                  required={true}
                />
                <label
                  htmlFor={surgery.slug}
                  className={`flex transition text-center items-center justify-center border w-full h-full rounded hover:shadow py-2 px-4 hover:border-shamrock ${
                    (booking.surgeries && booking.surgeries[0].surgery) ===
                    surgery.slug
                      ? "border-shamrock"
                      : ""
                  } ${
                    (booking.surgeries && booking.surgeries[0].surgery) !==
                      "" &&
                    (booking.surgeries && booking.surgeries[0].surgery) !==
                      surgery.slug
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  {surgery.name}
                </label>
                <p className="text-xs text-gray-600 mt-2">
                  À partir de {surgery.startingPrice} €
                </p>
              </div>
            ) : (
              ""
            );
          })}
          {getSurgeryCategory.surgeryCategory === "" ? (
            <div className="col-span-12 rounded border border-blue-300 bg-blue-50 text-blue-900">
              <p className="p-4">
                👋 Veuillez sélectionner une catégorie ci-dessus

              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SurgerySelectStep;
