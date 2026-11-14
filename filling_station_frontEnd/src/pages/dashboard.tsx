import  { useEffect, useState } from "react";
import "../pages/dashboard.css";

import { SideBar } from "./sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthConext";

const stats = [
  { label: "Stations", value: "4 Stations", tone: "neutral" },
  { label: "Fuels listed", value: "5", suffix: "of 5", tone: "good" },
  { label: "Last stock update", value: "1 minute ago", tone: "live" },
  { label: "Visible to drivers", value: "Yes", tone: "warning" },
];

const steps = [
  {
    number: 1,
    title: "Pin your station",
    description: "Search or drop a pin on the map at your exact location.",
  },
  {
    number: 2,
    title: "Choose your fuels",
    description: "Select petrol, diesel and kerosene types you sell.",
  },
  {
    number: 3,
    title: "Update your stock",
    description: "Drivers see availability the moment you save.",
  },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  // All hooks must run before any early return
  const { user, loading, previewImage } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // triggers the one-time entrance animation after first paint
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (loading) {
    return (
      <div className="pump-loader" role="status" aria-live="polite">
        <span className="pump-loader-ring" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  const handleAddStation = () => navigate("/addNewStation", { replace: true });

  return (
    <div className={`pump-dashboard ${ready ? "is-ready" : ""}`}>
      <SideBar />

      <main className="pump-main">
        {/* Header */}
        <header
          className="pump-nameBar pump-reveal"
          style={{ ["--i" as any]: 0 }}
        >
          <div className="pump-welcome-Tag">
            <h1>
              {greeting()}, {user?.username}
            </h1>
            <p>
              Your station is not on the map yet. Add it to start sharing stock
              with drivers.
            </p>
          </div>

          <div className="pump-profile">
            <span className="pump-profile-name">{user?.username}</span>
            <div className="pump-avatar">
              {previewImage ? (
                <img src={previewImage} alt="Profile" />
              ) : (
                <span>{user?.username?.slice(0, 2).toUpperCase() || "US"}</span>
              )}
            </div>
          </div>
        </header>

        {/* Main action first: it is the most important thing on this page */}
        <section
          className="pump-add-station pump-reveal"
          style={{ ["--i" as any]: 1 }}
        >
          <div className="pump-station-info">
            <h2>Add your filling station</h2>
            <p>
              Put your station on the map so drivers nearby can see which fuels
              you have in stock.
            </p>

            <button
              type="button"
              className="pump-primary-button"
              onClick={handleAddStation}
            >
              <span className="pump-plus">+</span> Add your filling station
            </button>
            <small className="pump-hint">Takes about two minutes</small>
          </div>

          <div className="pump-station-visual" aria-hidden="true">
            <div className="pump-map-grid" />
            <div className="pump-map-road pump-road-a" />
            <div className="pump-map-road pump-road-b" />

            <div className="pump-location-marker">
              <div className="pump-marker-ring">
                <div className="pump-marker-dot" />
              </div>
            </div>

            <p className="pump-map-caption">Your station goes here</p>
          </div>
        </section>

        {/* Stats */}
        <section className="pump-stats-grid" aria-label="Station overview">
          {stats.map((stat, index) => (
            <article
              className={`pump-stat-card tone-${stat.tone} pump-reveal`}
              style={{ ["--i" as any]: 2 + index * 0.5 }}
              key={stat.label}
            >
              <p className="pump-stat-label">
                <span className="pump-stat-dot" />
                {stat.label}
              </p>

              {stat.suffix ? (
                <div className="pump-fuel-count">
                  <h2>{stat.value}</h2>
                  <span>{stat.suffix}</span>
                </div>
              ) : (
                <h2 className="pump-stat-value">{stat.value}</h2>
              )}
            </article>
          ))}
        </section>

        {/* Steps */}
        <section
          className="pump-steps-card pump-reveal"
          style={{ ["--i" as any]: 4.5 }}
        >
          <div className="pump-section-heading">
            <h2>Get listed in 3 steps</h2>
            <p>It takes about two minutes.</p>
          </div>

          <ol className="pump-steps-grid">
            {steps.map((step) => (
              <li
                className={`pump-step ${step.number === 1 ? "is-current" : ""}`}
                key={step.number}
              >
                <div className="pump-step-number">{step.number}</div>
                <div className="pump-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  {step.number === 1 && (
                    <span className="pump-step-badge">Start here</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pump-footer">
          PumpCheck © 2026. Helping drivers find available fuel.
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
