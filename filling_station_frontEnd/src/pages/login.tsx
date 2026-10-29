import "./Login.css";

import { useState } from "react";
import type { FormEvent } from "react";
import { loginUser } from "../services/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthConext";

type Role = "driver" | "owner" ;

const ROLE_COPY: Record<Role,{ heading: string; sub: string; button: string; helper: string; link: string }> = {
  driver: {
    heading: "Find fuel near you",
    sub: "Sign in to see which stations have stock right now.",
    button: "Sign in and open map",
    helper: "New here?",
    link: "Create a customer account",
  },
  owner: {
    heading: "Manage your station",
    sub: "Sign in to update your fuel stock and your map listing.",
    button: "Sign in to dashboard",
    helper: "Own a filling station?",
    link: "Register your station",
  },
};

const FUELS = [
  { name: "Petrol 92", level: 78, state: "ok", label: "Available" },
  { name: "Petrol 95", level: 34, state: "low", label: "Running low" },
  { name: "Auto Diesel", level: 91, state: "ok", label: "Available" },
  { name: "Super Diesel", level: 0, state: "out", label: "Out of stock" },
  { name: "Kerosene", level: 62, state: "ok", label: "Available" },
] as const;

function Login() { 
  const [role, setRole] = useState<Role>("driver");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const navigate = useNavigate();
  const {user,loading}=useAuth();

  if(loading){
    return(
      <p> checkAuthentication</p>
    )
  }

  if(user?.userRole === "owner"){
    return <Navigate to="/dashboard" replace />;
    
  }

  const copy = ROLE_COPY[role];

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter your username and password to continue.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({ username, password, role });
      console.log(response.data.userData.userRole)
      if(response.data.userData.userRole === "owner"){
        return <Navigate to="/dashboard" replace />;
      }
      // console.log("Login successful:", response);
    } catch (error:any) {
      console.error("Login failed:", error.response.message);
      setError("Username or password is incorrect. Check them and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fs-login">
      {/* LEFT SIDE: live-map preview */}
      <section className="fs-map" aria-label="Preview of the station map">
        <svg
          className="fs-map-svg"
          viewBox="0 0 800 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path className="fs-water" d="M-20 640 C 150 560, 260 700, 420 640 S 700 560, 840 620 L 840 920 L -20 920 Z" />
          <g className="fs-block">
            <rect x="60" y="80" width="150" height="110" rx="10" />
            <rect x="250" y="60" width="120" height="150" rx="10" />
            <rect x="430" y="90" width="170" height="100" rx="10" />
            <rect x="640" y="70" width="120" height="140" rx="10" />
            <rect x="80" y="260" width="130" height="130" rx="10" />
            <rect x="470" y="270" width="140" height="120" rx="10" />
            <rect x="660" y="280" width="100" height="150" rx="10" />
            <rect x="60" y="470" width="150" height="90" rx="10" />
            <rect x="270" y="480" width="150" height="80" rx="10" />
            <rect x="500" y="460" width="130" height="100" rx="10" />
          </g>
          <g className="fs-road-main">
            <path d="M-20 235 L 840 235" />
            <path d="M230 -20 L 230 920" />
            <path d="M-20 440 C 200 420, 400 470, 840 410" />
            <path d="M640 -20 C 620 250, 650 450, 600 920" />
          </g>
          <g className="fs-road-minor">
            <path d="M-20 130 L 840 130" />
            <path d="M410 -20 L 410 700" />
            <path d="M-20 585 L 840 585" />
            <path d="M-20 340 L 840 340" />
          </g>
        </svg>

        <div className="fs-map-shade" />

        {/* Pins */}
        <span className="fs-pin fs-pin--ok" style={{ left: "17%", top: "34%" }} />
        <span className="fs-pin fs-pin--low" style={{ left: "72%", top: "22%" }} />
        <span className="fs-pin fs-pin--ok" style={{ left: "80%", top: "54%" }} />
        <span className="fs-pin fs-pin--out" style={{ left: "14%", top: "62%" }} />
        <span className="fs-pin fs-pin--ok" style={{ left: "46%", top: "70%" }} />

        <div className="fs-map-content">
          <header className="fs-brand">
            <div className="fs-logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
                <path d="M3 21h12" />
                <path d="M7 8h4" />
                <path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3" />
              </svg>
            </div>
            <span className="fs-brand-name">PumpCheck</span>
          </header>

          <div className="fs-hero">
            <h1 className="fs-headline">
              Know what's at the pump before you drive there.
            </h1>
            <p className="fs-lede">
              Tap any station on the map to see petrol, diesel and kerosene
              stock, updated by the station itself.
            </p>
          </div>

          {/* The memorable moment: a station card as it appears on the map */}
          <article className="fs-card" aria-label="Example station stock card">
            <div className="fs-card-head">
              <div>
                <h2 className="fs-card-title">Galle Road Filling Station</h2>
                <p className="fs-card-meta">Colombo 03 · updated 6 min ago</p>
              </div>
              <span className="fs-badge">Open</span>
            </div>

            <ul className="fs-stock">
              {FUELS.map((f) => (
                <li key={f.name} className="fs-stock-row">
                  <span className="fs-stock-name">{f.name}</span>
                  <span className="fs-bar" aria-hidden="true">
                    <span
                      className={`fs-bar-fill fs-bar-fill--${f.state}`}
                      style={{ width: `${f.level}%` }}
                    />
                  </span>
                  <span className={`fs-stock-state fs-stock-state--${f.state}`}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* RIGHT SIDE: sign in */}
      <section className="fs-panel">
        <div className="fs-form-wrap">
          <div
            className="fs-tabs"
            role="tablist"
            aria-label="Account type"
            data-role={role}
          >
            <span className="fs-tab-thumb" aria-hidden="true" />
            <button
              type="button"
              role="tab"
              aria-selected={role === "driver"}
              className="fs-tab"
              onClick={() => setRole("driver")}
            >
              Driver
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "owner"}
              className="fs-tab"
              onClick={() => setRole("owner")}
            >
              Station owner
            </button>
            
          </div>

          <h2 className="fs-form-heading">{copy.heading}</h2>
          <p className="fs-form-sub">{copy.sub}</p>

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div className="fs-error" role="alert">
                {error}
              </div>
            )}

            <div className="fs-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="fs-field">
              <label htmlFor="password">Password</label>
              <div className="fs-password">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="fs-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="fs-options">
              <label className="fs-remember">
                <input type="checkbox" />
                Keep me signed in
              </label>
              <a href="#" className="fs-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="fs-submit" disabled={userLoading}>
              {userLoading ? "Signing in..." : copy.button}
            </button>
          </form>

          <p className="fs-switch">
            {copy.helper}{" "}
            <a href="#" className="fs-link">
              {copy.link}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;