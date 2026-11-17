import { NavLink } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { GrStatusGoodSmall } from "react-icons/gr";

import { MdMap, MdSettings } from "react-icons/md";

import { useState, useEffect } from "react";
import "../pages/sidebar.css";

export const CustomerSideBar = () => {
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
    { name: "Map view", path: "/customerMapView", icon: <MdMap /> },
    { name: "Settings", path: "/customerSetting", icon: <MdSettings /> },
  ];

  return (
    <>
      {/* hamburger icon */}
      {isMobile && (
        <button
          className="pump-mobile-menu"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <FiMenu />
        </button>
      )}

      
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
        <div className="pump-brand">
          <div className="pump-brand-icon">
            <FaGasPump />
          </div>

          <h2>PumpCheck</h2>
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
