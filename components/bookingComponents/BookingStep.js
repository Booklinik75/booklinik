import { AiOutlineCheck } from "react-icons/ai";

const BookingStep = ({ name, children, currentStep, stepId }) => {
  let state = "disabled";

  if (currentStep > stepId) {
    state = "filled";
  } else if (currentStep === stepId) {
    state = "current";
  } else {
    state = "disabled";
  }

  return (
    <div
      className={`border rounded  px-4 py-2 flex items-center justify-between text-gray-700 ${
        state === "current"
          ? "animate-pulse text-shamrock border-shamrock"
          : "border-gray-600"
      } ${state === "disabled" ? "opacity-30" : ""} `}
    >
      <div className="flex items-center gap-2">{children}</div>
      {state === "filled" ? (
        <div>
          <AiOutlineCheck />
        </div>
      ) : null}
    </div>
  );
};

export default BookingStep;
