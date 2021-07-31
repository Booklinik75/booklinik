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
            "text-left leading-snug hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline" +
            extraStyle +
            (router.pathname == target ? " underline" : "")
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
