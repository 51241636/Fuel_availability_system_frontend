
import React from "react";
import { SideBar } from "./sidebar";
import "./myStations.css";
import { FaGasPump } from "react-icons/fa";

const MyStation = () => {
  // Sample data — replace with your backend data
  const station = {
    stationName: "Galle Road Filling Station",
    address: "Galle Road, Colombo 03, Sri Lanka",
    phone: "+94 11 234 5678",
    email: "station@example.com",
    latitude: 6.9020,
    longitude: 79.8530,
    openTime: "06:00 AM",
    closeTime: "10:00 PM",
    isOpen: true,
  };

  const fuels = [
    {
      name: "Petrol 92",
      stock: 2000,
      capacity: 5000,
      unit: "L",
    },
    {
      name: "Petrol 95",
      stock: 500,
      capacity: 3000,
      unit: "L",
    },
    {
      name: "Auto Diesel",
      stock: 1500,
      capacity: 4000,
      unit: "L",
    },
    {
      name: "Super Diesel",
      stock: 300,
      capacity: 2000,
      unit: "L",
    },
  ];

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${station.latitude},${station.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pump-dashboard">
      <SideBar />

      <main className="pump-main my-station-main">
        
<header className="my-station-header">
  <div className="my-station-header-content">
    <div className="my-station-header-icon">
      <span> <FaGasPump/></span>
    </div>

    <div className="my-station-header-text">
      <div className="my-station-breadcrumb">
        <span>Dashboard</span>
        <span className="my-station-breadcrumb-divider">/</span>
        <span>Station Management</span>
      </div>

      <h1>
        My Station
        <span className="my-station-title-dot">.</span>
      </h1>

      <p className="my-station-subtitle">
        Manage your station details, monitor fuel stock, and keep your
        station information up to date.
      </p>
    </div>
  </div>

  <button
    className="my-station-edit-btn"
    onClick={() => alert("Connect your edit form here.")}
  >
    <span className="my-station-edit-icon">✎</span>
    <span>Edit Station</span>
    <span className="my-station-edit-arrow">↗</span>
  </button>
</header>


        <section className="my-station-banner">
          <div className="my-station-icon"> <FaGasPump/></div>

          <div className="my-station-banner-info">
            <div className="my-station-title-row">
              <h2>{station.stationName}</h2>

              <span
                className={`my-station-status ${
                  station.isOpen ? "is-open" : "is-closed"
                }`}
              >
                <span className="my-station-status-dot" />
                {station.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <p>{station.address}</p>
            <span className="my-station-label">
              Your registered fuel station
            </span>
          </div>
        </section>

        <div className="my-station-grid">
          <section className="my-station-card my-station-fuel-card">
            <div className="my-station-card-heading">
              <div>
                <h2>Fuel Availability</h2>
                <p>Current fuel stock at your station</p>
              </div>

              <span className="my-station-card-icon">◉</span>
            </div>

            <div className="my-station-fuel-list">
              {fuels.map((fuel) => {
                const percentage =
                  fuel.capacity > 0
                    ? Math.min(
                        100,
                        Math.round((fuel.stock / fuel.capacity) * 100)
                      )
                    : 0;

                return (
                  <div className="my-station-fuel-item" key={fuel.name}>
                    <div className="my-station-fuel-top">
                      <span>{fuel.name}</span>
                      <strong>
                        {fuel.stock.toLocaleString()} {fuel.unit}
                      </strong>
                    </div>

                    <div className="my-station-progress">
                      <div
                        className="my-station-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="my-station-fuel-bottom">
                      <span>{percentage}% available</span>
                      <span>
                        Capacity: {fuel.capacity.toLocaleString()} {fuel.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="my-station-outline-btn"
              onClick={() => alert("Connect your fuel update form here.")}
            >
              Update Fuel Stock
            </button>
          </section>

          <section className="my-station-card">
            <div className="my-station-card-heading">
              <div>
                <h2>Station Details</h2>
                <p>Your registered contact information</p>
              </div>

              <span className="my-station-card-icon">▤</span>
            </div>

            <div className="my-station-detail-list">
              <div className="my-station-detail">
                <span className="my-station-detail-icon">⌖</span>
                <div>
                  <label>Station Address</label>
                  <p>{station.address}</p>
                </div>
              </div>

              <div className="my-station-detail">
                <span className="my-station-detail-icon">☎</span>
                <div>
                  <label>Contact Number</label>
                  <p>{station.phone}</p>
                </div>
              </div>

              <div className="my-station-detail">
                <span className="my-station-detail-icon">✉</span>
                <div>
                  <label>Email Address</label>
                  <p>{station.email}</p>
                </div>
              </div>
            </div>

            <button
              className="my-station-outline-btn"
              onClick={() => alert("Connect your station details form here.")}
            >
              Manage Details
            </button>
          </section>

          <section className="my-station-card">
            <div className="my-station-card-heading">
              <div>
                <h2>Location</h2>
                <p>Your station's map coordinates</p>
              </div>

              <span className="my-station-card-icon">⌖</span>
            </div>

            <div className="my-station-coordinates">
              <div>
                <label>Latitude</label>
                <strong>{station.latitude}</strong>
              </div>

              <div>
                <label>Longitude</label>
                <strong>{station.longitude}</strong>
              </div>
            </div>

            <button
              className="my-station-map-btn"
              onClick={openGoogleMaps}
            >
              Open in Google Maps ↗
            </button>
          </section>

          <section className="my-station-card">
            <div className="my-station-card-heading">
              <div>
                <h2>Opening Hours</h2>
                <p>Station operating schedule</p>
              </div>

              <span className="my-station-card-icon">◷</span>
            </div>

            <div className="my-station-hours">
              <div>
                <span>Monday – Sunday</span>
                <strong>
                  {station.openTime} – {station.closeTime}
                </strong>
              </div>

              <span className="my-station-hours-status">
                {station.isOpen ? "Currently Open" : "Currently Closed"}
              </span>
            </div>

            <button
              className="my-station-outline-btn"
              onClick={() => alert("Connect your opening hours form here.")}
            >
              Edit Opening Hours
            </button>
          </section>
        </div>

        <footer className="my-station-footer">
          <span>Station Management</span>
          <span>Keep your station information up to date.</span>
        </footer>
      </main>
    </div>
  );
};

export default MyStation;
