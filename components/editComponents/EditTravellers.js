import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const EditTravellers = ({ voyageurs, setVoyageurs }) => {
  const [openEditVoyageurs, setOpenEditVoyageurs] = useState(false);

  const addCount = (category) => {
    setVoyageurs({
      ...voyageurs,
      [category]: voyageurs[category] + 1,
    });
  };
  const minusCount = (category) => {
    setVoyageurs({
      ...voyageurs,
      [category]:
        category === "adults"
          ? voyageurs[category] === 1
            ? 1
            : voyageurs[category] - 1
          : voyageurs[category] === 0
          ? 0
          : voyageurs[category] - 1,
    });
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openEditVoyageurs) {
        if (e.target.closest("#edit-voyageurs") === null) {
          setOpenEditVoyageurs(false);
        }
      }
    };
  }, [openEditVoyageurs]);

  return (
    <div>
      <div className="relative" style={{ zIndex: "5" }}>
        <span
          onClick={() => setOpenEditVoyageurs(openEditVoyageurs => !openEditVoyageurs)}
          className="border p-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer"
          id="inputTravellers"
          style={{
            width: "fit-content",
          }}
        >
          {voyageurs.adults + voyageurs.babies + voyageurs.childs} voyageurs
        </span>
        {openEditVoyageurs && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: "-6px" }}
              animate={{ opacity: 1, y: "0px" }}
              exit={{ opacity: 0, y: "-6px" }}
            >
              <ul
                className="absolute left-2 w-40 shadow-md rounded-md border-shamrock border"
                style={{ top: "calc(100% + 1rem)" }}
              >
                <li className="flex items-center bg-white p-3 justify-between w-100">
                  <span>Adults</span>{" "}
                  <div className="flex items-center gap-3">
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => minusCount("adults")}
                    >
                      <FaMinus color="white" size="10" />
                    </span>
                    <span>{voyageurs.adults}</span>
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => addCount("adults")}
                    >
                      <FaPlus color="white" size="10" />
                    </span>
                  </div>
                </li>
                <li className="flex items-center bg-white p-3 justify-between w-100">
                  <span>Babies</span>{" "}
                  <div className="flex items-center gap-3">
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => minusCount("babies")}
                    >
                      <FaMinus color="white" size="10" />
                    </span>
                    <span>{voyageurs.babies}</span>
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => addCount("babies")}
                    >
                      <FaPlus color="white" size="10" />
                    </span>
                  </div>
                </li>
                <li className="flex items-center bg-white p-3 justify-between w-100">
                  <span>Childs</span>{" "}
                  <div className="flex items-center gap-3">
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => minusCount("childs")}
                    >
                      <FaMinus color="white" size="10" />
                    </span>
                    <span>{voyageurs.childs}</span>
                    <span
                      className="bg-shamrock p-1 rounded-full cursor-pointer"
                      onClick={() => addCount("childs")}
                    >
                      <FaPlus color="white" size="10" />
                    </span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default EditTravellers;
