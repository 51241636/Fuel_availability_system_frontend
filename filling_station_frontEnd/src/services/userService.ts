import api from "./Api";

export const getLoggedUserDetail = () => {
  return api.get("/getMyDetail");
};

export const forgotPassword = (email: string) => {
  return api.post("/forgotPassword", { email });
};

export const verifyResetOTP = (email: string, otp: string) => {
  return api.post("/verifyResetOTP", { email, otp });
};

export const resetPassword = (
  email: string,
  otp: string,
  newPassword: string
) => {
  return api.post("/resetPassword", {
    email,
    otp,
    newPassword,
  });
};