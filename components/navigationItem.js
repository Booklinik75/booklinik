import Link from "next/link";

export default function NavigationItem({ title, target, extraStyle }) {
  return (
    <li className="nav-item">
      <Link href={target}>
        <a
          className={
            "px-3 py-2 flex items-center leading-snug hover:underline font-medium " +
            extraStyle
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
  target: "/",
  extraStyle: "",
};
