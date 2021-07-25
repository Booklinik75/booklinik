import Link from "next/link";
import { useRouter } from "next/router";

export default function NavigationItem({ title, target, extraStyle }) {
  const router = useRouter();
  return (
    <li className="nav-item">
      <Link href={target}>
        <a
          className={
            "px-3 py-2 flex items-center leading-snug hover:underline font-medium " +
            extraStyle +
            (router.pathname == target ? " underline" : "")
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
