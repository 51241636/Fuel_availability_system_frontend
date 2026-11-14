import api from "./Api";

export const getAllStations = async () => {
  try {
    const response = await api.get("/getAllStations");
    return response.data.allStations;
  } catch (error) {
    throw error;
  }
};
