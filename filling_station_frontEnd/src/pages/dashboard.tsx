
import React from "react";
import "./Dashboard.css";

import { GrStatusGoodSmall } from "react-icons/gr";
import { SideBar } from "./sidebar";
import { Navigate, useNavigate } from "react-router-dom";
const Dashboard = () => {
  const stats = [
    {
      label: "Station",
      value: "Not added",
      className: "muted",
    },
    {
      label: "Fuels listed",
      value: "0",
      suffix: "of 5",
      className: "",
    },
    {
      label: "Last stock update",
      value: "None yet",
      className: "muted",
    },
    {
      label: "Visible to drivers",
      value: "No",
      className: "warning",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Pin your station",
      description:
        "Search or drop a pin on the map at your exact location.",
    },
    {
      number: 2,
      title: "Choose your fuels",
      description:
        "Select petrol, diesel and kerosene types you sell.",
    },
    {
      number: 3,
      title: "Update your stock",
      description:
        "Drivers see availability the moment you save.",
    },
  ];
let value;
  stats.map((stat)=>{
    
    if(stat.suffix){
        value=(
            
        <article className="pump-stat-card" key={stat.label}>
             <p className="pump-stat-label">{stat.label}</p>
             
        </article>
    //         <p className="pump-stat-label">{stat.label}</p>
    //   <div className="pump-fuel-count">
    //     <h2>{stat.value}</h2>
    //     <span>{stat.suffix}</span>
    //   </div>
    )
    }else{
         value = (
      <h2 className={`pump-stat-value ${stat.className || ''}`}>
        {stat.value}
      </h2>
    );
    }
  })

   const navigate = useNavigate();
  
    const handleClick = () => {
      // 2. Trigger the navigation with the replace option on click
      navigate('/addNewStation', { replace: true });
    };

  return (
    <div className="pump-dashboard">
      <SideBar/>

      {/* Main content */}
      <main className="pump-main">
        {/* Header */}
        <header className="pump-nameBar">
          <div className="pump-welcome-Tag">
            <h1>Welcome, Nimal</h1>
            <p>
              Your station is not on the map yet. Add it to start
              sharing stock with drivers.
            </p>
          </div>

          <div className="pump-profile">
            <span className="pump-profile-name">Nimal Perera</span>
            <div className="pump-avatar">NP</div>
          </div>
        </header>

        {/* Dashboard cards */}
        <section className="pump-stats-grid">
           {/* add dashboard data using map */}
          {stats.map((stat) => (
            <article className="pump-stat-card" key={stat.label}>
              <p className="pump-stat-label">{stat.label}</p>
              {stat.suffix ? (
                 <div className="pump-fuel-count">
                  <h2>{stat.value}</h2>
                  <span>{stat.suffix}</span>
                </div>
              ):(
                <h2 className={`pump-stat-value ${stat.className}`}>
                  {stat.value}
                </h2>
              )} 
            </article>
          ))}
        </section>

        {/* Getting started */}
        <section className="pump-steps-card">
          <div className="pump-section-heading">
            <h2>Get listed in 3 steps</h2>
            <p>It takes about two minutes.</p>
          </div>

          <div className="pump-steps-grid">
            {steps.map((step) => (
              <div className="pump-step" key={step.number}>
                <div className="pump-step-number">
                  {step.number}
                </div>

                <div className="pump-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add filling station */}
        <section className="pump-add-station">
          <div className="pump-station-info">
            <h2>Add your filling station</h2>

            <p>
              Put your station on the map so drivers nearby can
              see which fuels you have in stock.
            </p>

            <button
              type="button"
              className="pump-primary-button"
              onClick={handleClick}
            >
              <span>+</span> Add your filling station
            </button>
          </div>

          <div className="pump-station-visual">
            <div className="pump-map-grid" />

            <div className="pump-location-marker">
              <div className="pump-marker-ring">
                <div className="pump-marker-dot" />
              </div>
            </div>

            <p className="pump-map-caption">
              Your station goes here
            </p>
          </div>
        </section>

        <footer className="pump-footer">
          PumpCheck © 2026. Helping drivers find available fuel.
        </footer>
      </main>
    </div>
  );
};


export default Dashboard;
