import { useEffect, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../pages/mapView.css";
import { getAllStations } from "../services/mapViewService";
import {
  FaPhone,
  FaGasPump,
  FaPaperPlane,
  FaCommentDots,
  FaTimes,
  FaClock,
  FaRoute,
} from "react-icons/fa";
import { CustomerSideBar } from "./customerSideBar";

interface Station {
  id: number;
  name: string;
  address: string;
  distance: string;
  position: [number, number];
  available: boolean;
  contact: string;
  fuels: {
    OcTane92: Fuel;
    OcTane95: Fuel;
    Diesel: Fuel;
    SuperDiesel: Fuel;
    Kerosene: Fuel;
  };
  openTime: string;
  closeTime: string;
}

interface LiveLocationProps {
  position: [number, number];
}

const LiveLocationMarker = ({ position }: LiveLocationProps) => {
  const map = useMap();

  useEffect(() => {
    map.panTo(position, {
      animate: true,
      duration: 0.5,
    });
  }, [position, map]);

  const userIcon = L.divIcon({
    className: "user-location-icon",
    html: `
      <div class="live-location-marker">
        <div class="live-location-pulse"></div>
        <div class="live-location-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <>
      <Circle
        center={position}
        radius={50}
        pathOptions={{
          color: "#f2f4f7",
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
          weight: 2,
        }}
      />

      <Marker position={position} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  );
};

export interface Fuel {
  fuelType: string;
  available: boolean;
  tankCapacity: number;
  currentStock: number;
  fuelPrice: number;
}

/* ---------- Chatbot types & helpers ---------- */
type FuelKey = keyof Station["fuels"];

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
  stations?: Station[];
  fuelKey?: FuelKey;
}

const FUEL_LABELS: Record<FuelKey, string> = {
  OcTane92: "Petrol 92",
  OcTane95: "Petrol 95",
  Diesel: "Auto Diesel",
  SuperDiesel: "Super Diesel",
  Kerosene: "Kerosene",
};

// Order matters: "super diesel" must be checked before "diesel"
const FUEL_KEYWORDS: [FuelKey, RegExp][] = [
  ["SuperDiesel", /super\s*diesel/i],
  ["OcTane92", /92/],
  ["OcTane95", /95/],
  ["Kerosene", /kerosene|kerosine/i],
  ["Diesel", /diesel/i],
];

const QUICK_REPLIES = [
  "Petrol 92 available?",
  "Diesel nearby",
  "Opening hours",
  "Call this station",
];

const fuelPercent = (fuel?: Fuel) => {
  if (!fuel || fuel.tankCapacity <= 0) return 0;

  return Math.min(
    100,
    Math.max(0, Math.round((fuel.currentStock / fuel.tankCapacity) * 100)),
  );
};

const fuelLevel = (pct: number) =>
  pct === 0 ? "out" : pct <= 30 ? "low" : "ok";

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

function CustomerMapView() {
  const [allStations, setStations] = useState<Station[]>([]);

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const [activeFilter] = useState("All fuels");
  const [loading, setLoading] = useState<boolean>(true);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  /* ---------- Chatbot state (hooks must stay above the early returns) ---------- */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: "bot",
      text: "Hi, I'm FuelBuddy. Ask me which stations have fuel, when they open, or how to get there.",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatNextId = useRef(2);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, chatTyping, chatOpen]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => chatInputRef.current?.focus(), 250);
  }, [chatOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setUserLocation(newLocation);

        console.log("Live location:", newLocation);
      },
      (error) => {
        console.error("Live location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const getFuelDetails = (fuels: Fuel[], fuelType: string): Fuel => {
    return (
      fuels?.find((fuel) => fuel.fuelType === fuelType) ?? {
        fuelType,
        available: false,
        currentStock: 0,
        tankCapacity: 0,
        fuelPrice: 0,
      }
    );
  };

  useEffect(() => {
    const getAllRegisteredStations = async () => {
      try {
        const response = await getAllStations();
        const stationData: Station[] = response.map((station: any) => {
          console.log("Current station:", station);
          console.log("Fuel details:", station?.fuels);

          return {
            id: station._id,
            name: station.stationName,
            address: station.stationAddress,
            position: [
              station.location.coordinates[1],
              station.location.coordinates[0],
            ],
            contact: station.stationContact,

            fuels: {
              OcTane92: getFuelDetails(station.fuels, "OcTane92"),
              OcTane95: getFuelDetails(station.fuels, "OcTane95"),
              Diesel: getFuelDetails(station.fuels, "Diesel"),
              SuperDiesel: getFuelDetails(station.fuels, "SuperDiesel"),
              Kerosene: getFuelDetails(station.fuels, "Kerosene"),
            },

            openTime: station.openTime,
            closeTime: station.closeTime,
          };
        });
        setStations(stationData);
        if (stationData.length > 0) {
          setSelectedStation(stationData[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAllRegisteredStations();
  }, []);

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

          <p>Please wait while we fetch the latest station information...</p>

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
            We couldn't find any fuel stations at the moment. Please check again
            later.
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

  const getFuelStatusClass = (fuel: Fuel) => {
    const percentage = fuelPercent(fuel);

    if (percentage === 0) return "out";
    if (percentage <= 30) return "low";

    return "available";
  };

  const getAvailableFuels = (station: Station) => {
    return Object.values(station.fuels).some((fuel) => fuel.currentStock > 0);
  };

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

  /* ---------- Chatbot logic ---------- */
  const buildChatReply = (raw: string): Omit<ChatMessage, "id" | "from"> => {
    const q = raw.toLowerCase();

    // 1. Fuel availability
    const match = FUEL_KEYWORDS.find(([, re]) => re.test(raw));
    if (match) {
      const [key] = match;
      const label = FUEL_LABELS[key];
      const found = allStations
        .filter((s) => s.fuels[key].available && s.fuels[key].currentStock > 0)
        .sort((a, b) => fuelPercent(b.fuels[key]) - fuelPercent(a.fuels[key]))
        .slice(0, 4);

      if (found.length === 0) {
        return {
          text: `No station currently has ${label} in stock. Check back soon.`,
        };
      }
      return {
        text: `${found.length} station${found.length > 1 ? "s have" : " has"} ${label} right now, fullest tanks first:`,
        stations: found,
        fuelKey: key,
      };
    }

    // 2. Opening hours
    if (/open|close|hour|time/.test(q)) {
      return {
        text: `${selectedStation.name} is open from ${selectedStation.openTime} to ${selectedStation.closeTime}.`,
      };
    }

    // 3. Contact
    if (/call|phone|contact|number/.test(q)) {
      return {
        text: `You can reach ${selectedStation.name} on ${selectedStation.contact}.`,
      };
    }

    // 4. Directions
    if (/direction|route|navigate|how.*get|way/.test(q)) {
      window.open(
        getDirectionUrl(selectedStation),
        "_blank",
        "noopener,noreferrer",
      );
      return {
        text: `Opening directions to ${selectedStation.name} in Google Maps.`,
      };
    }

    // 5. Price
    if (/price|cost|rate|how much/.test(q)) {
      const lines = (Object.keys(selectedStation.fuels) as FuelKey[])
        .filter((k) => selectedStation.fuels[k].fuelPrice > 0)
        .map(
          (k) => `${FUEL_LABELS[k]}: Rs. ${selectedStation.fuels[k].fuelPrice}`,
        );
      return {
        text: lines.length
          ? `Prices at ${selectedStation.name}:\n${lines.join("\n")}`
          : `${selectedStation.name} hasn't published prices yet.`,
      };
    }

    // 6. Greetings / thanks
    if (/^(hi|hello|hey|good)/.test(q)) {
      return { text: "Hello! Which fuel are you looking for?" };
    }
    if (/thank/.test(q)) {
      return { text: "You're welcome. Safe travels!" };
    }

    return {
      text: "I can help with fuel availability, prices, opening hours, phone numbers and directions. Try one of the suggestions below.",
    };
  };

  const sendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatTyping) return;

    setChatMessages((m) => [
      ...m,
      { id: chatNextId.current++, from: "user", text: trimmed },
    ]);
    setChatInput("");
    setChatTyping(true);

    setTimeout(() => {
      const reply = buildChatReply(trimmed);
      setChatMessages((m) => [
        ...m,
        { id: chatNextId.current++, from: "bot", ...reply },
      ]);
      setChatTyping(false);
    }, 700);
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
      <CustomerSideBar />
      <main className="pump-main my-station-main">
        <div className="map-view-page">
          {/* Header */}
          <div className="map-header">
            <div>
              <h2>Map view</h2>
              <p>
                See your stations on the map nearby as drivers see it, and
                manage availability. ask FuelBuddy
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="map-content">
            {/* Map section */}
            <div className="map-container">
              {/* Search and filters */}
              <div className="map-toolbar"></div>

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

                {userLocation && <LiveLocationMarker position={userLocation} />}

                {/* Fuel station markers */}
                {filteredStations.map((station) => (
                  <Marker
                    key={station.id}
                    position={station.position}
                    icon={
                      selectedStation?.id === station.id
                        ? selectedIcon
                        : createIcon(
                            getAvailableFuels(station) ? "#22c55e" : "#ef4444",
                          )
                    }
                    eventHandlers={{
                      click: () => setSelectedStation(station),
                    }}
                  >
                    {/* Custom fuel availability popup */}
                    <Popup
                      className="fuel-station-popup"
                      minWidth={280}
                      maxWidth={320}
                    >
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
                            open : {station.openTime} close :{" "}
                            {station.closeTime}
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
                                  className={`popup-fuel-status ${getFuelStatusClass(
                                    fuel.value,
                                  )}`}
                                >
                                  {getFuelStatus(fuel.value.currentStock)}
                                </span>
                              </div>

                              <div className="popup-progress-row">
                                <div className="popup-progress-bg">
                                  <div
                                    className={`popup-progress-fill ${getFuelStatusClass(fuel.value)}`}
                                    style={{
                                      width: `${fuelPercent(fuel.value)}%`,
                                    }}
                                  ></div>
                                </div>

                                <span className="popup-fuel-percentage">
                                  {fuelPercent(fuel.value)}%
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
                      selectedStation?.id === station.id ? "selected" : ""
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
                          {
                            name: "Super Diesel",
                            fuel: station.fuels.SuperDiesel,
                          },
                          { name: "Kerosene", fuel: station.fuels.Kerosene },
                        ]
                          .filter(
                            ({ fuel }) =>
                              fuel.available && fuel.currentStock > 0,
                          )
                          .map(({ name, fuel }) => {
                            const percentage =
                              (fuel.currentStock / fuel.tankCapacity) * 100;

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
                          className={`fuel-progress ${getFuelStatusClass(fuel.value)}`}
                          style={{
                            width: `${fuelPercent(fuel.value)}%`,
                          }}
                        ></div>
                      </div>

                      <span>{fuelPercent(fuel.value)}%</span>
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

          {/* ================= CHATBOT ================= */}
          <button
            type="button"
            className={`chat-fab ${chatOpen ? "is-open" : ""}`}
            onClick={() => setChatOpen((o) => !o)}
            aria-label={chatOpen ? "Close chat" : "Open chat"}
            aria-expanded={chatOpen}
          >
            <span className="chat-fab-icon chat-fab-chat">
              <FaCommentDots />
            </span>
            <span className="chat-fab-icon chat-fab-close">
              <FaTimes />
            </span>
            {!chatOpen && <span className="chat-fab-ping" aria-hidden="true" />}
          </button>

          <section
            className={`chat-window ${chatOpen ? "is-open" : ""}`}
            role="dialog"
            aria-label="FuelBuddy chat"
            aria-hidden={!chatOpen}
          >
            <header className="chat-header">
              <div className="chat-avatar">
                <FaGasPump />
              </div>
              <div className="chat-title">
                <h3>FuelBuddy</h3>
                <p>
                  <span className="chat-online" /> Live station data
                </p>
              </div>
              <button
                type="button"
                className="chat-close"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </header>

            <div className="chat-body">
              {chatMessages.map((m) => (
                <div key={m.id} className={`chat-row ${m.from}`}>
                  {m.from === "bot" && (
                    <div className="chat-mini-avatar">
                      <FaGasPump />
                    </div>
                  )}
                  <div className="chat-col">
                    <div className={`chat-bubble ${m.from}`}>{m.text}</div>

                    {m.stations && m.fuelKey && (
                      <div className="chat-results">
                        {m.stations.map((s) => {
                          const pct = fuelPercent(s.fuels[m.fuelKey!]);
                          const level = fuelLevel(pct);
                          return (
                            <button
                              type="button"
                              key={s.id}
                              className="chat-station"
                              onClick={() => setSelectedStation(s)}
                            >
                              <div className="chat-station-top">
                                <strong>{s.name}</strong>
                                <span className={`chat-pill ${level}`}>
                                  {level === "low" ? "Low" : "Available"}
                                </span>
                              </div>
                              <div className="chat-station-address">
                                {s.address}
                              </div>
                              <div className="chat-meter">
                                <div
                                  className={`chat-meter-fill ${level}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="chat-station-meta">
                                <span>
                                  <FaClock /> {s.openTime} – {s.closeTime}
                                </span>
                                <span>{pct}% full</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatTyping && (
                <div className="chat-row bot">
                  <div className="chat-mini-avatar">
                    <FaGasPump />
                  </div>
                  <div
                    className="chat-bubble bot chat-typing"
                    aria-label="FuelBuddy is typing"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-chips">
              {QUICK_REPLIES.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => sendChat(q)}
                  disabled={chatTyping}
                >
                  {q === "Call this station" && <FaPhone />}
                  {q === "Opening hours" && <FaClock />}
                  {q === "Diesel nearby" && <FaRoute />}
                  {q === "Petrol 92 available?" && <FaGasPump />}
                  {q}
                </button>
              ))}
            </div>

            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                sendChat(chatInput);
              }}
            >
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about fuel, prices, hours..."
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatTyping}
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CustomerMapView;
