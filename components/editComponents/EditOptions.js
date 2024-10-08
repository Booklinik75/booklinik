import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const EditOptions = ({ option, id, setOptions, options }) => {
  const [openOptions, setOpenOptions] = useState(false);
  const handleChangeOptions = (getOp) => {
    const existOptions = options.find((opt) => getOp.name === opt.name);
    if (existOptions) {
      setOptions((options) => {
        let newOptions = options.map((opt) =>
          opt.name === option.name
            ? {
                ...opt,
                isChecked: false,
              }
            : opt.name === getOp.name
            ? {
                ...opt,
                isChecked: true,
                name: getOp.name,
                price: getOp.price,
              }
            : opt
        );
        const existChange = newOptions.find((opt) => option.name === opt.name);
        const index = newOptions.findIndex((opt) => option.name === opt.name);
        newOptions.splice(index, 1);
        newOptions.push(existChange);
        return newOptions.filter((opt) => opt.name !== "Choisir une option");
      });
    }

    setOpenOptions(false);
  };

  const handleRemove = () => {
    const existOptions = options.find((opt) => option.name === opt.name);
    if (existOptions) {
      if (existOptions.name === "Choisir une option") {
        setOptions((options) => {
          const index = options.findIndex((opt) => option.name === opt.name);
          if (index > -1) {
            options.splice(index, 1);
          }
          return options;
        });
      } else {
        setOptions((options) =>
          options.map((opt) =>
            opt.name === option.name ? { ...opt, isChecked: false } : opt
          )
        );
      }
    }
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openOptions) {
        if (e.target.closest(`#dropdown-option${id}`) === null) {
          setOpenOptions(false);
        }
      }
    };
  }, [id, openOptions]);

  return (
    <div>
      <div className="flex items-center">
        <span
          id={`inputOption${id}`}
          onClick={() => setOpenOptions((openOptions) => !openOptions)}
          className="border p-2 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer "
          style={{
            width: "fit-content",
            minHeight: "30px",
          }}
        >
          {option?.name}
        </span>
        <span
          className="bg-red-600 p-1 mr-2 rounded-full inline-block cursor-pointer"
          onClick={handleRemove}
        >
          <FaTimes color="white" size="10" />
        </span>
      </div>
      {openOptions && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-6px" }}
          >
            <ul
              id={`dropdown-option${id}`}
              className="absolute left-2 w-40 shadow-md overflow-y-scroll cursor-pointer rounded-md bg-white border-shamrock border dropdown-options"
              style={{
                top: "calc(100% + 1rem)",
                width: "fit-content",
                maxHeight: "10rem",
              }}
            >
              {options.map(
                (op) =>
                  !op.isChecked &&
                  op.name !== "Choisir une option" && (
                    <li
                      key={op.name}
                      onClick={() => handleChangeOptions(op)}
                      className="p-3 py-2 w-100 hover:bg-gray-100"
                    >
                      {op.name}
                    </li>
                  )
              )}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default EditOptions;
