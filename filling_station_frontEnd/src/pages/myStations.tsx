import React, { useEffect, useState } from "react";
import { SideBar } from "./sidebar";
import "./myStations.css";
import { FaGasPump } from "react-icons/fa";
import { getUserStationDetail } from "../services/stationService";
import type { UserStation } from "../interface/stationDetailInterface";
import { UseStationDetailsContext } from "../context/StationContext";
import { useNavigate } from "react-router-dom";

const MyStation = () => {
    const navigate=useNavigate()
  const [userStation, setStation] = useState<UserStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<UserStation | null>(null);
  const [loading, setLoading] = useState(true);
  const {setUserSelectedStation,setIsEditMode}=UseStationDetailsContext();

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await getUserStationDetail();
        setStation(response.data.station);
      } catch (error) {
        console.error("Failed to load station details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, []);

  const station = {
    stationName: selectedStation?.stationName,
    address: selectedStation?.stationAddress,
    phone: selectedStation?.stationContact,
    email: selectedStation?.stationEmail,
    latitude: selectedStation?.location.coordinates[1],
    longitude: selectedStation?.location.coordinates[0],
    openTime: selectedStation?.openTime,
    closeTime: selectedStation?.closeTime,
    isOpen: true,
  };

  const openGoogleMaps = () => {
    if (station.latitude == null || station.longitude == null) {
      alert("Location coordinates are not available");
      return;
    }

    const url = `https://www.google.com/maps?q=${station.latitude},${station.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const editAddedStation=()=>{
    if (!selectedStation) {
        alert("Please select a station first");
        return;
    }
    setUserSelectedStation(selectedStation);
    setIsEditMode(true);
    navigate("/addNewStation")

  }

  return (
    <div className="pump-dashboard">
      <SideBar />

      <main className="pump-main my-station-main">
        <header className="my-station-header">
          <div className="my-station-header-content">
            <div className="my-station-header-icon">
              <span><FaGasPump /></span>
            </div>

            <div className="my-station-header-text">
              <div className="my-station-breadcrumb">
                <span>Dashboard</span>
                <span className="my-station-breadcrumb-divider">/</span>
                <span>Station Management</span>
              </div>

              <h1>
                My Station<span className="my-station-title-dot">.</span>
              </h1>

              <p className="my-station-subtitle">
                Manage your station details, monitor fuel stock, and keep your
                station information up to date.
              </p>
            </div>
          </div>
        </header>

        <section className="station-selector">
          <div className="station-selector-heading">
            <div>
              <span className="station-section-kicker">WORKSPACE</span>
              <h2>My Stations</h2>
            </div>
            <span className="station-count">{userStation.length} station{userStation.length === 1 ? "" : "s"}</span>
          </div>

          {loading ? (
            <p className="station-selector-message">Loading your stations...</p>
          ) : userStation.length === 0 ? (
            <p className="station-selector-message">No stations registered yet.</p>
          ) : (
            <div className="station-selector-list">
              {userStation.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedStation(item)}
                  className={`station-selector-button ${
                    selectedStation?._id === item._id ? "active" : ""
                  }`}
                >
                  <span className="station-selector-button-icon"><FaGasPump /></span>
                  <span className="station-selector-button-text">
                    <strong>{item.stationName}</strong>
                    <small>{item.stationAddress}</small>
                  </span>
                  <span className="station-selector-chevron">↗</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="my-station-banner">
          <div className="station-banner-glow" />
          <div className="my-station-icon"><FaGasPump /></div>

          <div className="my-station-banner-info">
            <div className="my-station-title-row">
              <h2>{station.stationName || "Select a station"}</h2>
              <span className={`my-station-status ${station.isOpen ? "is-open" : "is-closed"}`}>
                <span className="my-station-status-dot" />
                {station.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <p>{station.address || "Choose a station above to view its details."}</p>
            <span className="my-station-label">Your registered fuel station</span>
          </div>

          <div className="station-banner-actions">
            <span className="station-live-label"><span /> Station overview</span>
            <button className="my-station-edit-btn" onClick={editAddedStation  }>
              <span className="my-station-edit-icon">✎</span>
              <span>Edit station</span>
            </button>
          </div>
        </section>

        <div className="my-station-grid">
          <section className="my-station-card my-station-fuel-card">
            <div className="my-station-card-heading">
              <div>
                <span className="station-section-kicker">LIVE INVENTORY</span>
                <h2>Fuel Availability</h2>
                <p>Current fuel stock at your station</p>
              </div>
              <span className="my-station-card-icon">◉</span>
            </div>

            <div className="my-station-fuel-list">
              {selectedStation?.fuels.map((stationFuel) => {
                const percentage =
                  stationFuel.tankCapacity > 0
                    ? Math.min(100, Math.round((stationFuel.currentStock / stationFuel.tankCapacity) * 100))
                    : 0;

                return (
                  <div className="my-station-fuel-item" key={stationFuel.fuelType}>
                    <div className="my-station-fuel-top">
                      <span>{stationFuel.fuelType}</span>
                      <strong>{stationFuel.currentStock.toLocaleString()} L</strong>
                    </div>

                    <div className="my-station-progress">
                      <div className="my-station-progress-fill" style={{ width: `${percentage}%` }} />
                    </div>

                    <div className="my-station-fuel-bottom">
                      <span>{percentage}% of capacity</span>
                      <span>Capacity: {stationFuel.tankCapacity.toLocaleString()} L</span>
                    </div>
                    <div className="station-fuel-meta">
                      <span>Rs. {stationFuel.fuelPrice} / L</span>
                      <span className={stationFuel.available ? "fuel-available" : "fuel-unavailable"}>
                        {stationFuel.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {!loading && selectedStation && selectedStation.fuels.length === 0 && (
                <p className="station-empty-state">No fuel records available for this station.</p>
              )}
              {!loading && !selectedStation && userStation.length > 0 && (
                <p className="station-empty-state">Select a station to see current fuel stock.</p>
              )}
            </div>

            <button className="my-station-outline-btn" onClick={() => alert("Connect your fuel update form here.")}>
              Update Fuel Stock <span>↗</span>
            </button>
          </section>

          <section className="my-station-card my-station-location-card">
            <div className="my-station-card-heading">
              <div>
                <span className="station-section-kicker">FIND YOUR STATION</span>
                <h2>Location</h2>
                <p>Station coordinates and map access</p>
              </div>
              <span className="my-station-card-icon">⌖</span>
            </div>

            <div className="station-map-preview">
              <div className="station-map-grid" />
              <span className="station-map-pin"><FaGasPump /></span>
              <span className="station-map-coordinate">
                {station.latitude != null && station.longitude != null
                  ? `${station.latitude.toFixed(4)}, ${station.longitude.toFixed(4)}`
                  : "Coordinates not available"}
              </span>
            </div>

            <div className="my-station-coordinates">
              <div>
                <label>Latitude</label>
                <strong>{station.latitude ?? "—"}</strong>
              </div>
              <div>
                <label>Longitude</label>
                <strong>{station.longitude ?? "—"}</strong>
              </div>
            </div>

            <button className="my-station-map-btn" onClick={openGoogleMaps}>
              Open in Google Maps <span>↗</span>
            </button>
          </section>

          <section className="my-station-card my-station-details-card">
            <div className="my-station-card-heading">
              <div>
                <span className="station-section-kicker">STATION PROFILE</span>
                <h2>Station Details</h2>
                <p>Your registered contact information</p>
              </div>
              <span className="my-station-card-icon">▤</span>
            </div>

            <div className="my-station-detail-list">
              <div className="my-station-detail">
                <span className="my-station-detail-icon">⌖</span>
                <div><label>Station Address</label><p>{station.address || "—"}</p></div>
              </div>
              <div className="my-station-detail">
                <span className="my-station-detail-icon">☎</span>
                <div><label>Contact Number</label><p>{station.phone || "—"}</p></div>
              </div>
              <div className="my-station-detail">
                <span className="my-station-detail-icon">✉</span>
                <div><label>Email Address</label><p>{station.email || "—"}</p></div>
              </div>
            </div>

            <button className="my-station-outline-btn" onClick={() => alert("Connect your station details form here.")}>
              Manage Details <span>↗</span>
            </button>
          </section>

          <section className="my-station-card my-station-hours-card">
            <div className="my-station-card-heading">
              <div>
                <span className="station-section-kicker">OPERATING SCHEDULE</span>
                <h2>Opening Hours</h2>
                <p>Station operating schedule</p>
              </div>
              <span className="my-station-card-icon">◷</span>
            </div>

            <div className="my-station-hours">
              <div>
                <span>Monday – Sunday</span>
                <strong>{station.openTime || "—"} – {station.closeTime || "—"}</strong>
              </div>
              <span className="my-station-hours-status">
                {station.isOpen ? "Currently Open" : "Currently Closed"}
              </span>
            </div>

            <button className="my-station-outline-btn" onClick={() => alert("Connect your opening hours form here.")}>
              Edit Opening Hours <span>↗</span>
            </button>
          </section>
        </div>

        <footer className="my-station-footer">
          <span>Station Management <span className="footer-dot">•</span> Fuel station dashboard</span>
          <span>Keep your station information up to date.</span>
        </footer>
      </main>
    </div>
  );
};

export default MyStation;
