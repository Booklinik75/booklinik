import StepDashSVG from "../public/assets/step-dash.svg";
import Image from "next/image";

const StepDash = () => {
  return (
    <div className="text-center">
      <Image src={StepDashSVG} alt="" />
    </div>
  );
};

export default StepDash;
