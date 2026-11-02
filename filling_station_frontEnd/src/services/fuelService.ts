import type { FuelOption } from "../pages/addStationMap";
import api from "./Api";

export const UpdateFuelDetails=async (stationId: string,
  fuelDetail: FuelOption[],)=>{
    try{
        const response=await api.patch(`/updateFuelDetails/${stationId}`,{fuels:fuelDetail})
        return response
    }catch(error:any){
        throw error.message
    }
}