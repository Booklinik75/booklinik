import { BiLoaderAlt } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";

const DashboardButton = ({
  defaultText,
  status,
  onClick,
  className,
  disabled,
}) => {
  let contents = "...";

  if (status === "loading") {
    contents = (
      <div className="text-white animate-spin inline-block">
        <BiLoaderAlt />
      </div>
    );
  } else if (status === "done") {
    contents = (
      <div className="text-white inline-block animate-pulse">
        <AiOutlineCheck />
      </div>
    );
  } else {
    contents = defaultText;
  }

  return (
    <button
      type="submit"
      className={`transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:col-span-full ${
        !disabled && "hover:text-shamrock hover:bg-white"
      } ${className}`}
      disabled={status === "loading" || disabled ? true : false}
      onClick={onClick}
    >
      {contents}
    </button>
  );
};

export default DashboardButton;
