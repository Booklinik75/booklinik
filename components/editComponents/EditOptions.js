import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import { useEffect, useState } from "react";

const EditOptions = ({ option, id, setOptions, options, optionLists }) => {
  const [openOptions, setOpenOptions] = useState(false);
  const handleChangeOptions = (getOp) => {
    const existOptions = options.find((opt) => option.name === opt.name);
    if (existOptions) {
      setOptions((options) =>
        options.map((opt) =>
          opt.name === option.name
            ? { ...opt, name: getOp.name, price: getOp.price }
            : opt
        )
      );
    }
    setOpenOptions(false);
  };

  const isSelected = (op) => {
    return options.find((oper) => oper.name === op.name);
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
    <div className="relative" style={{ zIndex: "3" }}>
      <span
        id={`inputOption${id}`}
        onClick={() => setOpenOptions((openOptions) => !openOptions)}
        className="border p-2 py-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer "
        style={{
          width: "fit-content",
          minHeight: "30px",
        }}
      >
        {option?.name}
      </span>
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
              {optionLists.map(
                (op) =>
                  !isSelected(op) && (
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
