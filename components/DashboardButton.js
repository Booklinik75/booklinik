import { BiLoaderAlt } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";

const DashboardButton = ({ defaultText, status }) => {
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
      className="transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock hover:bg-white disabled:opacity-50 text-right col-span-full"
      disabled={status === "loading" ? true : false}
    >
      {contents}
    </button>
  );
};

export default DashboardButton;
