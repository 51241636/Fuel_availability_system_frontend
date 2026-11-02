import api from "./Api";

export const clearRefreshToken=async()=>{
    try{
        const response=await api.post("/logout")
        return response.data.message;
    }catch(error){
        throw error;
    }
}