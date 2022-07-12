import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardSideNavItem({
  title,
  target,
  extraStyle,
  disabled,
}) {
  const router = useRouter();

  return (
    <div>
      <Link passHref={true} href={target}>
        <button
          // i just added when we are on the correct page it will make the text to 50%opacity and also if it's dashboard give the class that
          className={
            `text-left leading-snug my-2 group-hover:text-shamrock hover:text-shamrock disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline ${
              router.pathname == target ? "text-shamrock" : ""
            } ${
              title === "Dashboard" &&
              "text-sm text-gray-700 uppercase font-bold tracking-wide mr-2 cursor-pointer"
            }` + extraStyle
          }
          disabled={disabled ? true : false}
        >
          {title}
        </button>
      </Link>
    </div>
  );
}

DashboardSideNavItem.defaultProps = {
  title: "Undefined",
  target: "/404",
  extraStyle: "",
};
