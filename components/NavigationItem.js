import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

export default function NavigationItem({ title, target, extraStyle }) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <li className="nav-item">
      <Link href={target}>
        <a
          className={
            "px-3 py-2 flex items-center leading-snug hover:underline font-medium " +
            extraStyle +
            (router.pathname == target ? " underline" : "") +
            (target == "/login" && loading == true ? "hidden" : "")
          }
        >
          {title}
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
