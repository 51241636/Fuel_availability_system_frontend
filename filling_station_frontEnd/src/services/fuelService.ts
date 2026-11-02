import type { FuelOption } from "../pages/addStationMap";
import api from "./Api";

export const UpdateFuelDetails=async (stationId: string,
  fuelDetail: FuelOption[],)=>{
    try{
        await api.patch(`/updateFuelDetails/${stationId}`,{fuels:fuelDetail})
    }catch(error:any){
        throw error.message
    }
}