import Image from "next/image";
import Logo from "../public/booklinik-logo.svg";
import Link from "next/link";
import { HiMenuAlt1 } from "react-icons/hi";

const DashboardNavigation = ({ setIsSideNavOpen }) => {
  return (
    <div className="relative flex flex-row w-full justify-between z-50 px-10 py-6 bg-white border-b border-gray-500">
      <div>
        <Link href="/">
          <a>
            <Image src={Logo} alt="Logo" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default DashboardNavigation;
