import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EditCity = ({ operations, city, setCity, cities }) => {
  const [openCities, setOpenCities] = useState(false);
  const isCitiesExists = (cty) => {
    const newCityDatas = [];
    operations.map((operation) => {
      if (operation?.cities?.includes(cty.name.toLowerCase())) {
        newCityDatas.push(cty.name);
      }
    });

    let uniqueCities = newCityDatas.filter((cityData, index) => {
      return newCityDatas.indexOf(cityData) === index;
    });

    return uniqueCities.map((cty) => (
      <li
        key={cty}
        onClick={() => handleClick(cty)}
        className="p-3 py-2 w-100 hover:bg-gray-100"
      >
        {cty}
      </li>
    ));
  };

  const handleClick = (cty) => {
    setCity(cty.toLowerCase());
    setOpenCities(false);
  };

  useEffect(() => {
    document.onclick = (e) => {
      if (openCities) {
        if (e.target.closest("#dropdown-cities") === null) {
          setOpenCities(false);
        }
      }
    };
  }, [openCities]);

  return (
    <div>
      <span
        className="border p-2 py-3 px-4 rounded align-middle mx-2 border-shamrock cursor-pointer"
        id={`inputCity-${city}`}
        onClick={() => setOpenCities((openCities) => !openCities)}
        style={{
          width: "fit-content",
        }}
      >
        {city}
      </span>
      {openCities && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-6px" }}
          >
            <ul
              id="dropdown-cities"
              className="absolute left-2 w-40 shadow-md overflow-y-scroll cursor-pointer rounded-md bg-white border-shamrock border dropdown-cities"
              style={{
                top: "calc(100% + 1rem)",
                width: "fit-content",
                maxHeight: "10rem",
              }}
            >
              {cities?.map((city) => isCitiesExists(city))}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default EditCity;
