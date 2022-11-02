import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaPhone } from "react-icons/fa";
import firebase from "../firebase/clientApp";
import { IoIosArrowForward } from "react-icons/io";

export default function NavigationItem({
  title,
  target,
  extraStyle,
  navBottom,
  phone,
  propos,
  ...props
}) {
  const router = useRouter();
  const [loading] = useAuthState(firebase.auth());

  return (
    <li
      className={`nav-item w-full p-5 py-3 lg:normal-case uppercase font-medium text-sm lg:text-base  lg:border-0 lg:p-0 lg:w-[fit-content] ${
        !navBottom && "border-b-2 border-gray-100"
      }`}
      {...props}
    >
      <Link href={target}>
        <a
          className={
            "px-3 py-2 flex items-center justify-between no-underline leading-snug lg:hover:underline font-medium " +
            extraStyle +
            (router.pathname == target ? " underline" : "") +
            (target == "/login" && loading == true ? "hidden" : "")
          }
        >
          {phone && <FaPhone className="stroke-1 lg:hidden text-white" />}
          {title}
          {propos && (
            <IoIosArrowForward size="18" className="lg:hidden text-shamrock" />
          )}
        </a>
      </Link>
    </li>
  );
}

NavigationItem.defaultProps = {
  title: "Undefined",
  target: "/404",
  extraStyle: "",
};
