import api from "./Api";

 export const registerAccountService=async(
    firstName:string,
    userName:string,
    email: string,
    address:string,
    contact:string,
    password: string,
    userRole:string
)=>{
   try{

    const registerdData={
         firstName,
         userName,
         email,
         address,
         contact,
         password,
         userRole

        }
    const response=await api.post("/registerUser",registerdData);
    return response.data;
    
   }catch(error:any){
      throw error;
   }

}
