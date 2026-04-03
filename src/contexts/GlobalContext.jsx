import { createContext, useContext } from "react";
import {fetchCurrentLeaguePatch} from "../services/ddragonApi.js";
import {useQuery} from "@tanstack/react-query";
import {fetchItemsData} from "../services/challengerggApi.js";

// 1. Create context
const GlobalContext = createContext(null);

// 2. Provider component
export function GlobalProvider({ children }) {
  const {data: currentPatch} = useQuery({
    queryKey: ['currentPatch'],
    queryFn: () => fetchCurrentLeaguePatch()
  });

  const {data: items} = useQuery({
    queryKey: ['items'],
    queryFn: () => fetchItemsData()
  });

  return (
    <GlobalContext.Provider value={{currentPatch, items}}>
      {children}
    </GlobalContext.Provider>
  );
}

// 3. Hook for easier access
export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
