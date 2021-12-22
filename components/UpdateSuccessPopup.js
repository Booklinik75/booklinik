import { motion, AnimatePresence } from "framer-motion";

const UpdateSuccessPopup = ({ close }) => {
  const handleClose = () => {
    close()
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed inset-0 m-auto w-96 bg-white h-96 flex items-center flex-col p-4 justify-center rounded-lg"
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 62 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="31"
              cy="31"
              r="28"
              fill="white"
              stroke="#E7EAF4"
              strokeWidth="5"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.7289 21.97L26.7289 34.971L21.9719 30.214C21.0959 29.337 19.6749 29.337 18.7989 30.214C17.9219 31.09 17.9219 32.511 18.7989 33.387L25.1429 39.731C25.5809 40.169 26.1559 40.389 26.7299 40.389C27.3039 40.389 27.8779 40.17 28.3159 39.731L42.9029 25.144C43.7789 24.267 43.7789 22.847 42.9029 21.97C42.0259 21.094 40.6059 21.094 39.7289 21.97Z"
              fill="#33C383"
            />
          </svg>
          <span className="text-xl my-5">
            Félicitations, la mise à jour a réussi!
          </span>
          <button
            className="min-w-max transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock group hover:bg-white"
            onClick={handleClose}
          >
            Okay
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UpdateSuccessPopup;
