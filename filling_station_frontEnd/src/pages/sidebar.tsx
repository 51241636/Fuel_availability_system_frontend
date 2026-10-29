import { NavLink } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { GrStatusGoodSmall } from "react-icons/gr";
import "./sidebar.css"
import {
  MdDashboard,
  MdLocalGasStation,
  MdWaterDrop,
  MdMap,
  MdSettings,
} from "react-icons/md";

import { useState } from "react";

export const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
    { name: "My station", path: "/myStation", icon: <MdLocalGasStation /> },
    { name: "Fuel stock", path: "/fuel-stock", icon: <MdWaterDrop /> },
    { name: "Map view", path: "/map-view", icon: <MdMap /> },
    { name: "Settings", path: "/settings", icon: <MdSettings /> },
  ];

  return (
    <aside className={`pump-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="pump-brand">
        <div className="pump-brand-icon">
          <FaGasPump />
        </div>

        {!isCollapsed && <h2>PumpCheck</h2>}

        <button
          className="pump-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>
      </div>

      <nav className="pump-button">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `pump-nav-link ${isActive ? "active" : ""}`
            }
            title={item.name}
          >
            <span className="pump-nav-icon">{item.icon}</span>

            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="pump-sidebar-footer">
          <GrStatusGoodSmall className="pump-status-dot" />
          <span>Station owner portal</span>
        </div>
      )}
    </aside>
  );
};