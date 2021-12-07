import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EditOperations = ({
  operation,
  id,
  operationCategories,
  setOperations,
  operations,
}) => {
  const [openOperations, setOpenOperations] = useState(false);
  const handleChangeOperation = (getOp) => {
    const existOperation = operations.find((operation) => id === operation.id);
    if (existOperation) {
      setOperations((operations) =>
        operations.map((operation) =>
          operation.id === id
            ? {
                surgeryName: getOp.name,
                cities: getOp.cities,
                id: getOp.id,
              }
            : operation
        )
      );
    }
    setOpenOperations(false);
  };


  const isSelected = (op) => {
    return operations.find((oper) => oper.surgeryName === op.name);
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openOperations) {
        if (e.target.closest(`#dropdown-operation${id}`) === null) {
          setOpenOperations(false);
        }
      }
    };
  }, [id, openOperations]);

  return (
    <div className="relative" style={{ zIndex: "8" }} key={operation?.id}>
      <span
        id={`inputSurgery${id}`}
        onClick={() => setOpenOperations((openOperations) => !openOperations)}
        className="border p-2 py-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer "
        style={{
          width: "fit-content",
          minHeight: "30px",
        }}
      >
        {operation?.surgeryName}
      </span>
      {openOperations && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-6px" }}
          >
            <ul
              id={`dropdown-operation${id}`}
              className="absolute left-2 w-40 shadow-md overflow-y-scroll cursor-pointer rounded-md bg-white border-shamrock border"
              style={{
                top: "calc(100% + 1rem)",
                width: "fit-content",
                maxHeight: "10rem",
              }}
            >
              {operationCategories.map(
                (op) =>
                  !isSelected(op) && (
                    <li
                      key={op.id}
                      onClick={() => handleChangeOperation(op)}
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

export default EditOperations;
