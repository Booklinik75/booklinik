import { AiFillInfoCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

const DashboardModal = ({ content, cta, target, type }) => {
  // determine color of modal
  const getColor = () => {
    switch (type) {
      case "success":
        return "shamrock";
      case "error":
        return "red-500";
      default:
        return "blue-500";
    }
  };

  return (
    <div
      className={`flex flex-row rounded-xl border border-${getColor(
        type
      )} w-full px-4 py-2 items-center gap-4`}
    >
      <div className={`text-${getColor(type)}`}>
        <AiFillInfoCircle />
      </div>
      <div className="flex w-full flex-row justify-between">
        <p>{content}.</p>
        {cta && target && (
          <Link href={target}>
            <a className="flex flex-row items-center gap-1 hover:underline">
              {cta} <BsArrowRight />
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardModal;
