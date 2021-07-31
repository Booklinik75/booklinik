import { BiLoaderAlt } from "react-icons/bi";

const DashboardButton = ({ defaultText, status }) => {
  return (
    <button
      type="submit"
      className="transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock hover:bg-white disabled:opacity-50 max-w-max text-right col-span-full"
      disabled={status === "loading" ? true : false}
    >
      {status === "loading" ? (
        <div className="text-white animate-spin inline-block">
          <BiLoaderAlt />
        </div>
      ) : (
        defaultText
      )}
    </button>
  );
};

export default DashboardButton;
