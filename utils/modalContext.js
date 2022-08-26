import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModaleProvider = ({children}) => {
    const [openModal,setOpenModal]=useState(false);
    const UpdatesetOpenModal=() => {
        setOpenModal(true)
    };
    return(
        <ModalContext.Provider value={{openModal,UpdatesetOpenModal}}>
          
            {children}
        </ModalContext.Provider>   );
};

