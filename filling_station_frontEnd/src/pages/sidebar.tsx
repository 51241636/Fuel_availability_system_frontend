import { NavLink } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { GrStatusGoodSmall } from "react-icons/gr";

import {
  MdDashboard,
  MdLocalGasStation,
  MdWaterDrop,
  MdMap,
  MdSettings,
} from "react-icons/md";

import { useState, useEffect } from "react";
import "../pages/sidebar.css";

export const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobile && isMobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMobileOpen]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
    { name: "My station", path: "/myStation", icon: <MdLocalGasStation /> },
    { name: "Fuel stock", path: "/fuelStock", icon: <MdWaterDrop /> },
    { name: "Map view", path: "/mapView", icon: <MdMap /> },
    { name: "Settings", path: "/setting", icon: <MdSettings /> },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          className="pump-mobile-menu"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <FiMenu />
        </button>
      )}

      {/* Mobile Background Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="pump-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`pump-sidebar
          ${isCollapsed && !isMobile ? "collapsed" : ""}
          ${isMobile ? "mobile-sidebar" : ""}
          ${isMobileOpen ? "mobile-open" : ""}
        `}
      >
        {/* Brand */}
        <div className="pump-brand">
          <div className="pump-brand-icon">
            <FaGasPump />
          </div>

          <h2>PumpCheck</h2>

          {/* Mobile Close / Desktop Collapse */}
          {isMobile ? (
            <button
              className="pump-toggle-btn mobile-close-btn"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX />
            </button>
          ) : (
            <button
              className="pump-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="pump-button">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => {
                if (isMobile) {
                  setIsMobileOpen(false);
                }
              }}
              className={({ isActive }) =>
                `pump-nav-link ${isActive ? "active" : ""}`
              }
              title={item.name}
            >
              <span className="pump-nav-icon">{item.icon}</span>

              <span className="pump-nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="pump-sidebar-footer">
          <GrStatusGoodSmall className="pump-status-dot" />
          <span>Station owner portal</span>
        </div>
      </aside>
    </>
  );
};
