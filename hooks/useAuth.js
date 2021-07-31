import { useContext } from "react";
import { AuthContext } from "../utils/UserContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
