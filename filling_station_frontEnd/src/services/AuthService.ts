import { useState } from "react";
import api from "./Api"

//  const [response, setResponse] = useState("");
 export const loginUser=async(data:{username:string,password:string,role:string})=>{
   try{
    const response=await api.post("/loginUser",data);
    localStorage.setItem("accessToken",response.data.accessToken)
    console.log(response)
    return response;
    
   }catch(error:any){
      throw error;
   }

}

export const getMyDetails=async()=>{
  console.log("response user details : ","calling")
  const response=await api.get("/getMyDetails");
  console.log("response user details : ",response)
  return response;
}

