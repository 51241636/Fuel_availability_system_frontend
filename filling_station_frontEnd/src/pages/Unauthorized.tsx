import "./Unauthorized.css";
import {useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <i className="fa-solid fa-lock"></i>
        </div>

        <div className="unauthorized-code">403</div>

        <h1>Access Denied</h1>

        <p className="unauthorized-description">
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you think this is a mistake.
        </p>

        <button onClick={() => navigate(-1)} className="unauthorized-button">
          Back to Previous Page
        </button>

        <p className="unauthorized-footer">Error Code: 403 · Forbidden</p>
      </div>
    </div>
  );
}

export default Unauthorized;
