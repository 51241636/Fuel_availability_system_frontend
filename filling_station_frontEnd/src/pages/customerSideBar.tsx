import { NavLink } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { GrStatusGoodSmall } from "react-icons/gr";
import "./customerSideBar.css"
import {
  MdMap,
  MdSettings,
} from "react-icons/md";

import { useState } from "react";

export const CustomerSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Map view", path: "/customerMapView", icon: <MdMap /> },
    { name: "Settings", path: "/customerSetting", icon: <MdSettings /> },
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