import { AiFillInfoCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

const DashboardModal = ({ content, cta, target }) => {
  return (
    <div className="flex flex-row rounded-xl border border-red-500 w-full px-4 py-2 items-center gap-4">
      <div className="text-red-500">
        <AiFillInfoCircle />
      </div>
      <div className="flex w-full flex-row justify-between">
        <p>{content}.</p>
        <Link href={target}>
          <a className="flex flex-row items-center gap-1 hover:underline">
            {cta} <BsArrowRight />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default DashboardModal;
