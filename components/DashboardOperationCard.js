import Image from "next/image";
import { VscLoading } from "react-icons/vsc";
import { FaHourglassHalf } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillInfoCircle } from "react-icons/ai";
import Link from "next/link";

function currentState(currentState, id) {
  if (currentState === "awaitingDocuments") {
    return (
      <div className="flex flex-row items-center gap-1">
        <div className="text-red-500">
          <AiFillInfoCircle />
        </div>
        <p>Des documents sont manquants</p>
        <Link href={`dashboard/operations/${id}`}>
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
  if (currentState === "examining") {
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

const DashboardOperationCard = ({ booking, noActions }) => {
  return (
    <div className="flex">
      <Image
        src={booking.hotelPhotoLink}
        width={97}
        height={80}
        className="rounded"
        alt="TBD"
      />
      <div className="p-3">
        <p className="text-leading">
          {booking.surgeryCategoryName} -{" "}
          <span className="capitalize">{booking.city}</span>
        </p>
        <p className="text-xs text-bali">
          {booking.hotelName} •{" "}
          {booking.hotelPrice *
            booking.totalSelectedNights *
            (1 +
              booking.extraBabies +
              booking.extraChilds +
              booking.extraTravellers) +
            booking.surgeryPrice}{" "}
          €
        </p>
        {!noActions && <div>{currentState(booking.status, booking.id)}</div>}
      </div>
    </div>
  );
};

export default DashboardOperationCard;
