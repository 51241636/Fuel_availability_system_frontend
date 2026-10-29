import { GrStatusGoodSmall } from "react-icons/gr"
import { FaGasPump } from "react-icons/fa";

export const SideBar = ()=>{

    return (
         <aside className="pump-sidebar">
                <div className="pump-brand">
                  <div className="pump-brand-icon">
                        <FaGasPump/>
                  </div>
                  <h2>PumpCheck</h2>
                </div>
        
                <nav className="pump-button">
                  <a href="#" className="pump-nav-link active">
                    Dashboard
                  </a>
                  <a href="#" className="pump-nav-link">
                    My station
                  </a>
                  <a href="#" className="pump-nav-link">
                    Fuel stock
                  </a>
                  <a href="#" className="pump-nav-link">
                    Map view
                  </a>
                  <a href="#" className="pump-nav-link">
                    Settings
                  </a>
                </nav>
        
                <div className="pump-sidebar-footer">
                  <span/>
                  <GrStatusGoodSmall className="pump-status-dot" />
                  Station owner portal
                </div>
              </aside>
    )
}