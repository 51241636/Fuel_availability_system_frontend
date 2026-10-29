import type { LatLng } from "leaflet";
import type { FuelOption, StationFormDetail } from "../pages/addStationMap";
import api from "./Api";

//  export const loadStation=async(data:{username:string,password:string,role:string})=>{
//    try{
//     const response=await api.post("/loginUser",data);
//     localStorage.setItem("accessToken",response.data.accessToken)
//     console.log(response)
//     return response;
    
//    }catch(error:any){
//       throw error;
//    }

// }
export const loadStation = async (
  stationDetails: StationFormDetail,
  position: LatLng | null,
  selectedItems: FuelOption[],
  openingTime: string,
  closingTime: string
) => {
    try{
        const stationData={
            ...stationDetails,
            location:position?{
                type:"Point",
                coordinates:[position.lng,position.lat]}:null,
            fuels:selectedItems,
            openTime:openingTime,
            closeTime:closingTime
            }
            
        
        const response=await api.post("/saveFuelStation",stationData);     
        return response
    }catch(error:any){
        throw error;
    }
//   console.log(stationDetails);
//   console.log(position);
//   console.log(selectedItems);
//   console.log(openingTime);
//   console.log(closingTime);
};


export const getUserStationDetail = async()=>{
    try{
        const response=await api.get("/getUserFilligStation"); 
        return response
    }catch(error:any){
        throw error.message;
    }
}