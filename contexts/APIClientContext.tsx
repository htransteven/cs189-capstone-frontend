import { createContext, useContext } from "react";
import { createClient } from "../api-utils/client";

const apiClient = createClient();
const clientContext = createContext(apiClient);

export const useApi = () => {
  return useContext(clientContext);
};

export const ApiProvider = ({ children }) => {
  return (
    <clientContext.Provider value={apiClient}>
      {children}
    </clientContext.Provider>
  );
};
