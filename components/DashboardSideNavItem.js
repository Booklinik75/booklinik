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
          className={
            `text-left leading-snug my-2  hover:opacity-50 disabled:opacity-50 ${
              router.pathname == target ? "opacity-50" : ""
            } disabled:cursor-not-allowed disabled:no-underline ${
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
