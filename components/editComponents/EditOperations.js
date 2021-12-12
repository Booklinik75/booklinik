import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const EditOperations = ({
  operation,
  operationCategories,
  setOperations,
  operations,
  hotel,
  room,
  options,
  setTotalPrice,
  voyageurs,
  totalSelectedNights,
}) => {
  const [openOperations, setOpenOperations] = useState(false);
  const handleChangeOperation = (getOp) => {
    const existOptions = operations.find(
      (opt) => operation.surgery === opt.surgery
    );
    if (existOptions) {
      setOperations((operations) =>
        operations.map((opt) =>
          opt.surgery === operation.surgery
            ? {
                surgeryName: getOp.name,
                surgeryPrice: getOp.startingPrice,
                surgery: getOp.slug,
                surgeryMinDays: 0,
                surgeryCategory: getOp.category,
                cities: getOp.cities,
              }
            : opt
        )
      );

    }

    setTotalPrice(
      options
        .map((option) => option.isChecked && Number(option.price))
        .reduce((a, b) => a + b) +
        operations.reduce((prev, curr) => prev + curr.surgeryPrice, 0) +
        room.roomPrice * totalSelectedNights +
        hotel.hotelPrice * totalSelectedNights +
        (voyageurs.childs + (voyageurs.adults - 1) + voyageurs.babies) * 450
    );

    setOpenOperations(false);
  };

  console.log(operationCategories);

  const isSelected = (op) => {
    return operations.find((oper) => oper.surgery === op.slug);
  };

  const handleRemove = () => {
    setOperations((operations) =>
      operations.filter((opt) => opt.surgery !== operation.surgery)
    );
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
      <div className="flex items-center">
        <span
          id="inputSurgery"
          onClick={() => setOpenOperations((openOperations) => !openOperations)}
          className="border p-2 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer "
          style={{
            width: "fit-content",
            minHeight: "30px",
          }}
        >
          {operation.surgeryName}
        </span>
        {operations.length > 1 && (
          <span
            className="bg-red-600 p-1 mr-2 rounded-full inline-block cursor-pointer"
            onClick={handleRemove}
          >
            <FaTimes color="white" size="10" />
          </span>
        )}
      </div>
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
