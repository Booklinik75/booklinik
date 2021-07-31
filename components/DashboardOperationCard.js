import Image from "next/image";
import { VscLoading } from "react-icons/vsc";
import { FaHourglassHalf } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillInfoCircle } from "react-icons/ai";
import Link from "next/link";

function currentState(currentState) {
  if (currentState === "awaitingDocuments") {
    return (
      <div className="flex flex-row items-center gap-1">
        <div className="text-red-500">
          <AiFillInfoCircle />
        </div>
        <p>Des documents sont manquants</p>
        <Link href="#">
          <a>
            <div className="text-green-500 flex flex-row ml-4 items-center gap-1">
              <IoMdAddCircle></IoMdAddCircle>
              <p className="hover:underline">Ajouter</p>
            </div>
          </a>
        </Link>
      </div>
    );
  }
  if (currentState === "awaitingEstimate") {
    return (
      <div className="flex flex-row items-center gap-1">
        <div className="text-bali">
          <FaHourglassHalf />
        </div>
        <p>Examen en cours</p>
      </div>
    );
  }
  return <div className="ml-3">Loading</div>;
}

const DashboardOperationCard = ({ state }) => {
  return (
    <div className="flex">
      <Image
        src="https://via.placeholder.com/1000?text=en+attente+d&lsquo;image"
        width={97}
        height={80}
        className="rounded"
        alt="TBD"
      />
      <div className="p-3">
        <p className="text-leading">
          Greffe de cheveux à Istanbul - Clinique DHI
        </p>
        <p className="text-xs text-bali">Witt Istanbul Suites • 2350€</p>
        <div>{currentState(state)}</div>
      </div>
    </div>
  );
};

export default DashboardOperationCard;
