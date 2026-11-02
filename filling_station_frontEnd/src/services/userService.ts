import api from "./Api"

export const getLoggedUserDetail=()=>{
    api.get("/getMyDetail")
}