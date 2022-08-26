import { createContext, useState } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleUseReferral = () => {
    setIsChecked(!isChecked);
  };

  return (
    <BookContext.Provider value={{ isChecked, handleUseReferral }}>
      {children}
      <h1>TEST</h1>
    </BookContext.Provider>
  );
};
