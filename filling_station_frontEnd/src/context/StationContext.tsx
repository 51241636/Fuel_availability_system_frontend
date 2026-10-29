import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserStation } from "../interface/stationDetailInterface";


export interface StationContextType {
  selectedStation: UserStation | null;
  setUserSelectedStation: (station: UserStation | null) => void;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
}


export const stationContext=createContext<StationContextType | undefined>(undefined)

export function StationProvider({children}:{children:ReactNode}){
    const[selectedStation,setUserSelectedStation]=useState<UserStation | null>(null);
    const [isEditMode,setIsEditMode]=useState(false);

    return(
        <stationContext.Provider value={{selectedStation,setUserSelectedStation,isEditMode,setIsEditMode}}>
            {children}
        </stationContext.Provider>
    )
}

export function UseStationDetailsContext(){
    const selectedStation=useContext(stationContext);
     if (!selectedStation) {
    throw new Error(
      "useStationContext must be used within StationProvider"
    );
  }

  return selectedStation;
}