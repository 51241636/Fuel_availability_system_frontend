import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Circle,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./mapview.css";
import { SideBar } from "./sidebar";
import { getAllStations } from "../services/mapViewService";
import { FaPhone } from "react-icons/fa";

interface Station {
  id: number;
  name: string;
  address: string;
  distance: string;
  position: [number, number];
  available: boolean;
  contact:string
  fuels: {
    OcTane92: Fuel;
    OcTane95: Fuel;
    Diesel: Fuel;
    SuperDiesel: Fuel;
    Kerosene: Fuel;
  };
   openTime: string;
    closeTime:string
}

export interface Fuel {
  fuelType: string;
  available: boolean;
  tankCapacity: number;
  currentStock:number;
  fuelPrice:number
}


const createIcon = (color: string) =>
  L.divIcon({
    className: "custom-station-icon",
    html: `<div class="station-marker" style="--marker-color:${color}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const selectedIcon = L.divIcon({
  className: "custom-station-icon",
  html: `<div class="selected-marker"><div></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function MapView() {
  
  const [allStations, setStations] = useState<Station[]>([]);

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const [activeFilter, setActiveFilter] = useState("All fuels");
  const [loading, setLoading] = useState<boolean>(true);

  const getFuelDetails = (fuels: Fuel[], fuelType: string): Fuel => {
    return fuels?.find(
        (fuel) => fuel.fuelType === fuelType
    ) ?? {
        fuelType,
        available: false,
        currentStock: 0,
        tankCapacity: 0,
        fuelPrice: 0,
    };
};

  useEffect(()=>{
    const getAllRegisteredStations=async()=>{
        try{
            const response=await getAllStations();
           const stationData: Station[] = response.map((station: any) => {

    console.log("Current station:", station);
    console.log("Fuel details:", station?.fuels);

    return {
        id: station._id,
        name: station.stationName,
        address: station.stationAddress,
        position: [
            station.location.coordinates[1],
            station.location.coordinates[0]
        ],
        contact:station.stationContact,

       fuels: {
                        OcTane92: getFuelDetails(station.fuels, "OcTane92"),
                        OcTane95: getFuelDetails(station.fuels, "OcTane95"),
                        Diesel: getFuelDetails(station.fuels, "Diesel"),
                        SuperDiesel: getFuelDetails(station.fuels, "SuperDiesel"),
                        Kerosene: getFuelDetails(station.fuels, "Kerosene"),
                    },

        openTime: station.openTime,
        closeTime:station.closeTime
    };
});
        setStations(stationData)
        if (stationData.length > 0) {
    setSelectedStation(stationData[0]);
}
        }catch(error){
            console.error(error);
        }finally{
             setLoading(false);
        }
    }
        getAllRegisteredStations()
  },[])

   if (loading) {
  return (
    <div className="station-loading">
      <div className="loading-content">

        <div className="fuel-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring-inner"></div>
          <i className="fa-solid fa-gas-pump"></i>
        </div>

        <h2>Finding Fuel Stations</h2>

        <p>
          Please wait while we fetch the latest station information...
        </p>

        <div className="loading-progress">
          <span></span>
        </div>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </div>
  );
}

if (!selectedStation) {
  return (
    <div className="no-station-container">
      <div className="no-station-card">
        <div className="no-station-icon">
          <i className="fa-solid fa-gas-pump"></i>
          <span className="no-station-cross">!</span>
        </div>

        <h2>No Stations Available</h2>

        <p>
          We couldn't find any fuel stations at the moment.
          Please check again later.
        </p>

        <div className="no-station-status">
          <span></span>
          No station data found
        </div>
      </div>
    </div>
  );
}






  // Fuel availability status
  const getFuelStatus = (value: number) => {
    if (value === 0) return "Out of stock";
    if (value <= 30) return "Low stock";
    return "Available";
  };

  const getFuelStatusClass = (value: Fuel) => {
    if ((value.currentStock/value.tankCapacity)*100 === 0) return "out";
    if ((value.currentStock/value.tankCapacity)*100 <= 30) return "low";
    return "available";
  };

  const getAvailableFuels = (station: Station) => {
    return Object.values(station.fuels).some(
      (fuel) => fuel.currentStock > 0
    );
  };

  // Filter stations
  // Filter stations
const filteredStations = allStations.filter((station) => {
  if (activeFilter === "All fuels") return true;

  const fuelMap: Record<string, keyof Station["fuels"]> = {
    OcTane92: "OcTane92",
    OcTane95: "OcTane95",
    Diesel: "Diesel",
    SuperDiesel: "SuperDiesel",
    Kerosene: "Kerosene",
  };

  const selectedFuel = fuelMap[activeFilter];

  if (!selectedFuel) return false;

  const fuel = station.fuels[selectedFuel];

  return fuel.available && fuel.currentStock > 0;
});


const handleCall = (phoneNumber: string) => {
  window.location.href = `tel:${phoneNumber}`;
};

  // Google Maps direction URL
  const getDirectionUrl = (station: Station) => {
    const [latitude, longitude] = station.position;

    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  };

  // Fuel details
 const fuelDetails = selectedStation.fuels
    ? [
        {
            name: "Petrol 92",
            value: selectedStation.fuels.OcTane92,
        },
        {
            name: "Petrol 95",
            value: selectedStation.fuels.OcTane95,
        },
        {
            name: "Auto Diesel",
            value: selectedStation.fuels.Diesel,
        },
        {
            name: "Super Diesel",
            value: selectedStation.fuels.SuperDiesel,
        },
        {
            name: "Kerosene",
            value: selectedStation.fuels.Kerosene,
        },
    ]
    : [];
  return (
    <div className="pump-dashboard">
        <SideBar/>
        <main className="pump-main my-station-main">
            <div className="map-view-page">

      {/* Header */}
      <div className="map-header">
        <div>
          <h2>Map view</h2>
          <p>
            See your stations on the map nearby as drivers see it,
            and manage availability.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="map-content">

        {/* Map section */}
        <div className="map-container">

          {/* Search and filters */}
          <div className="map-toolbar">

            <div className="map-search">
              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="Search area or station..."
              />
            </div>

            {/* <div className="map-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={
                    activeFilter === filter ? "active" : ""
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div> */}

          </div>

          {/* Sri Lanka map */}
          <MapContainer
            center={[7.8731, 80.7718]}
            zoom={8}
            minZoom={6}
            maxZoom={18}
            zoomControl={false}
            className="leaflet-map"
            scrollWheelZoom={true}
            maxBounds={[
              [5.5, 79.0],
              [10.2, 82.2],
            ]}
            maxBoundsViscosity={0.8}
          >

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ZoomControl position="bottomright" />

            {/* User location radius */}
            <Circle
              center={[6.9147, 79.8480]}
              radius={500}
              pathOptions={{
                color: "#16a34a",
                fillColor: "#16a34a",
                fillOpacity: 0.08,
              }}
            />

            {/* User location */}
            <Marker
              position={[6.9147, 79.8480]}
              icon={L.divIcon({
                className: "user-location-icon",
                html: `<div class="user-location-dot"></div>`,
                iconSize: [18, 18],
              })}
            >
              <Popup>Your location</Popup>
            </Marker>

            {/* Fuel station markers */}
            {filteredStations.map((station) => (
              <Marker
                key={station.id}
                position={station.position}
                icon={
    selectedStation?.id === station.id
        ? selectedIcon
        : createIcon(
            getAvailableFuels(station) ? "#22c55e" : "#ef4444"
        )
}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >

                {/* Custom fuel availability popup */}
                <Popup className="fuel-station-popup" minWidth={280} maxWidth={320}>

                  <div className="popup-station">

                    {/* Popup header */}
                    <div className="popup-header">

                      <div className="popup-station-icon">
                        <i className="fa-solid fa-gas-pump"></i>
                      </div>

                      <div className="popup-heading">
                        <h3>{station.name}</h3>

                        <p>
                          <i className="fa-solid fa-location-dot"></i>
                          {station.address}
                        </p>
                      </div>

                      <span className="popup-status">
                        open : {station.openTime} close : {station.closeTime}
                      </span>

                      

                     

                    </div>

                    {/* Fuel availability */}
                    <div className="popup-fuel-heading">
                      <h4>Fuel availability</h4>

                      <span>Current stock</span>
                    </div>

                    <div className="popup-fuel-list">

                      {[
                        {
                          name: "Petrol 92",
                          value: station.fuels.OcTane92,
                        },
                        {
                          name: "Petrol 95",
                          value: station.fuels.OcTane95,
                        },
                        {
                          name: "Auto Diesel",
                          value: station.fuels.Diesel,
                        },
                        {
                          name: "Super Diesel",
                          value: station.fuels.SuperDiesel,
                        },
                        {
                          name: "Kerosene",
                          value: station.fuels.Kerosene,
                        },
                      ].map((fuel) => (
                        
                        <div className="popup-fuel-item" key={fuel.name}>

                          <div className="popup-fuel-info">

                            <span className="popup-fuel-name">
                              {fuel.name}
                            </span>

                            <span
                              className={`popup-fuel-status ${
                                getFuelStatusClass(fuel.value)
                              }`}
                            >
                              {getFuelStatus(fuel.value.currentStock)}
                            </span>

                          </div>

                          <div className="popup-progress-row">

                            <div className="popup-progress-bg">
                              <div
                                className={`popup-progress-fill ${
                                  getFuelStatusClass(fuel.value)
                                }`}
                                style={{
                                  width: `${(fuel.value.currentStock / fuel.value.tankCapacity)*100}%`,
                                }}
                              ></div>
                            </div>

                            <span className="popup-fuel-percentage">
                              {(fuel.value.currentStock / fuel.value.tankCapacity)*100}%
                            </span>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* Updated time */}
                    <div className="popup-updated">
                      <i className="fa-regular fa-clock"></i>
                      Live stock information
                    </div>

                    {/* Google Maps direction */}
                    <a
                      href={getDirectionUrl(station)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="popup-direction-button"
                    >
                      <i className="fa-solid fa-diamond-turn-right"></i>
                      Get Directions
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>

                  </div>

                </Popup>

              </Marker>
            ))}

          </MapContainer>

          {/* Map legend */}
          <div className="map-legend">

            <span>
              <i className="legend-dot available"></i>
              Available
            </span>

            <span>
              <i className="legend-dot low"></i>
              Low
            </span>

            <span>
              <i className="legend-dot out"></i>
              Out
            </span>

            <span>
              <i className="legend-dot your-station"></i>
              Your station
            </span>

          </div>

        </div>

        {/* Nearby stations */}
        <div className="nearby-panel">

          <div className="nearby-header">

            <div>
              <h3> Available stations</h3>
              
            </div>

            <button
                    className="call-button"
                    onClick={() => handleCall(selectedStation.contact)}
                    >
                    <FaPhone className="call-icon" />
                    <span>{selectedStation.contact}</span>
                </button>

          </div>

          {/* Station list */}
          <div className="station-list">

            {filteredStations.map((station) => (

              <div
                key={station.id}
                className={`nearby-station-card ${
                  selectedStation?.id === station.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedStation(station)}
              >

                <div className="station-card-header">

                  <h4>{station.name}</h4>

                  {station.id === 1 && (
                    <span className="you-badge">You</span>
                  )}

                </div>

                <div className="station-card-footer">

                  <div className="fuel-tags">

                    {[
                        { name: "Petrol 92", fuel: station.fuels.OcTane92 },
                        { name: "Petrol 95", fuel: station.fuels.OcTane95 },
                        { name: "Diesel", fuel: station.fuels.Diesel },
                        { name: "Super Diesel", fuel: station.fuels.SuperDiesel },
                        { name: "Kerosene", fuel: station.fuels.Kerosene },
                    ]
                        .filter(({ fuel }) => fuel.available && fuel.currentStock > 0)
                        .map(({ name, fuel }) => {

                        const percentage = (fuel.currentStock/fuel.tankCapacity)*100;

                        return (
                            <span
                            key={name}
                            className={`fuel-tag ${
                                percentage <= 30 ? "orange" : "green"
                            }`}
                            >
                            {name} {percentage <= 30 ? "low" : "available"}
                            </span>
                        );
                        })}

                    </div>
                  <span className="station-distance">
                    {station.distance}
                  </span>

                </div>

              </div>

            ))}

            {filteredStations.length === 0 && (
              <p className="empty-stations">
                No stations found for this fuel type.
              </p>
            )}

          </div>

          {/* Selected station details */}
          <div className="selected-station-details">

            <div className="selected-title">

              <div>
                <h4>{selectedStation?.name}</h4>
                <p>{selectedStation?.address}</p>
               
                </div>

              <span className="open-status">
                {selectedStation?.openTime} to {selectedStation?.closeTime}
              </span>

            </div>

            <div className="fuel-stock-list">

              {fuelDetails.map((fuel) => (

                <div className="fuel-stock-row" key={fuel.name}>

                  <span>{fuel.name}</span>

                  <div className="fuel-stock-progress">

                    <div
                      className={`fuel-progress ${
                        getFuelStatusClass(fuel.value)
                      }`}
                      style={{
                        width: `${(fuel.value.currentStock/fuel.value.tankCapacity)*100}%`,
                      }}
                    ></div>

                  </div>

                  <span>{(fuel.value.currentStock/fuel.value.tankCapacity)*100}%</span>

                </div>

              ))}

            </div>

            <a
              href={getDirectionUrl(selectedStation)}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-direction-button"
            >
              <i className="fa-solid fa-route"></i>
              Get Directions
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>

            <p className="last-updated">
              <i className="fa-regular fa-clock"></i>
              Live stock information
            </p>

          </div>

        </div>

      </div>

    </div>
        </main>
    </div>
  );
}

export default MapView;