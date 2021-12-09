import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EditOperations = ({ operation, operationCategories, setOperation }) => {
  const [openOperations, setOpenOperations] = useState(false);
  const handleChangeOperation = (getOp) => {
    setOperation({
      surgeryName: getOp.name,
      surgeryPrice: getOp.startingPrice,
      surgery: getOp.slug,
      surgeryMinDays: getOp.minimumNights,
      surgeryCategory: getOp.category,
    });
    setOpenOperations(false);
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openOperations) {
        if (e.target.closest("#dropdown-operation") === null) {
          setOpenOperations(false);
        }
      }
    };
  }, [openOperations]);

  return (
    <div className="relative z-20">
      <span
        id="inputSurgery"
        onClick={() => setOpenOperations((openOperations) => !openOperations)}
        className="border p-2 py-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer "
        style={{
          width: "fit-content",
          minHeight: "30px",
        }}
      >
        {operation.surgeryName}
      </span>
      {openOperations && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-6px" }}
          >
            <ul
              id="dropdown-operation"
              className="absolute left-2 w-40 shadow-md overflow-y-scroll cursor-pointer rounded-md bg-white border-shamrock border"
              style={{
                top: "calc(100% + 1rem)",
                width: "fit-content",
                maxHeight: "10rem",
              }}
            >
              {operationCategories.map((op) => (
                <li
                  key={op.id}
                  onClick={() => handleChangeOperation(op)}
                  className="p-3 py-2 w-100 hover:bg-gray-100"
                >
                  {op.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default EditOperations;
