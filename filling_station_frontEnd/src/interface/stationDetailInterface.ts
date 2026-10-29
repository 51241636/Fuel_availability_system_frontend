export interface Fuel {
  fuelType: string;
  available: boolean;
  tankCapacity: number;
  currentStock:number;
  fuelPrice:number
}

export interface Fuel {
  fuelType: string;
  available: boolean;
  tankCapacity: number;
  currentStock: number;
  fuelPrice: number;
}

export interface UserStation {
  _id?: string;
  owner: string;
  stationName: string;
  stationContact: string;
  stationEmail: string;
  stationAddress: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  fuels: Fuel[];
  openTime: string;
  closeTime: string;
  available: boolean;
}