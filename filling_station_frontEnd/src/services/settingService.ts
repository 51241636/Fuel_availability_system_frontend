import type { ProfileDetails } from "../interface/profileDetail";
import api from "./Api";

export const clearRefreshToken=async()=>{
    try{
        const response=await api.post("/logout")
        return response.data.message;
    }catch(error){
        throw error;
    }
}

export const updateUserDetails=async(profileImage:File | null,profile:ProfileDetails)=>{
    try{
        const formData=new FormData();

        formData.append("id",profile._id);
        formData.append("name",profile.name);
        formData.append("email",profile.email);
        formData.append("address",profile.address);
        formData.append("contact",profile.contact)
        if (profileImage) {
            formData.append("image", profileImage);
        }

        const response=await api.put("/updateUser",formData)
        return response.data.message;

    }catch(error){
        throw error;
    }
}

export const ChangePassword=async(currentPassword:string,newPassword:string)=>{
    try{
        const response=await api.patch("/changeUserPasswrod",{currentPassword,newPassword});
        return response.data.message;
    }catch(error){
        throw error;
    }
}