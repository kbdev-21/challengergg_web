import { createContext, useContext, useState } from "react";
import {fetchCurrentLeaguePatch} from "../services/ddragonApi.js";
import {useQuery} from "@tanstack/react-query";

// 1. Create context
const GlobalContext = createContext(null);

// 2. Provider component
export function GlobalProvider({ children }) {
  const {data: currentPatch} = useQuery({
    queryKey: ['currentPatch'],
    queryFn: () => fetchCurrentLeaguePatch()
  });

  return (
    <GlobalContext.Provider value={{currentPatch}}>
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
