import type { LatLng } from "leaflet";
import type { FuelOption, StationFormDetail } from "../pages/addStationMap";
import api from "./Api";
export const loadStation = async (
  stationDetails: StationFormDetail,
  position: LatLng | null,
  selectedItems: FuelOption[],
  openingTime: string,
  closingTime: string,
) => {
  try {
    const stationData = {
      ...stationDetails,
      location: position
        ? {
            type: "Point",
            coordinates: [position.lng, position.lat],
          }
        : null,
      fuels: selectedItems,
      openTime: openingTime,
      closeTime: closingTime,
    };

    const response = await api.post("/saveFuelStation", stationData);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getUserStationDetail = async () => {
  try {
    const response = await api.get("/getUserFilligStation");
    return response;
  } catch (error: any) {
    throw error.message;
  }
};

export const updateStationService = async (
  stationDetails: StationFormDetail,
  position: LatLng | null,
  selectedItems: FuelOption[],
  openingTime: string,
  closingTime: string,
) => {
  try {
    const updtedstationData = {
      ...stationDetails,
      location: position
        ? {
            type: "Point",
            coordinates: [position.lng, position.lat],
          }
        : null,
      fuels: selectedItems,
      openTime: openingTime,
      closeTime: closingTime,
    };
    console.log("station id : ", stationDetails.stationId);

    const response = await api.post("/updateStationDetail", updtedstationData);
    return response;
  } catch (error: any) {
    throw error.message;
  }
};
