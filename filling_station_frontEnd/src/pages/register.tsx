import "../pages/register.css";

import { useState } from "react";
import { registerAccountService } from "../services/registerService";
// Add a `registerUser` function to your AuthService (POST to your register endpoint)
// import { registerUser } from "../services/AuthService";

type Role = "customer" | "owner";

const ROLE_INFO: Record<
  Role,
  { title: string; sub: string; points: string[] }
> = {
  customer: {
    title: "Find fuel faster.",
    sub: "Create a free account and check live fuel stock before you drive.",
    points: [
      "See every filling station on the map",
      "Tap a station to view stock for all fuels",
      "Know what is available, low or out of stock",
    ],
  },
  owner: {
    title: "Put your station on the map.",
    sub: "Register your filling station and keep customers updated in seconds.",
    points: [
      "Add your station location on the map",
      "Update fuel stock whenever it changes",
      "Reach drivers searching for fuel nearby",
    ],
  },
};

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: pw ? labels[score] : "" };
}

function Register() {
  const [userRole, setRole] = useState<Role>("customer");
  const [firstName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const info = ROLE_INFO[userRole];
  const strength = getStrength(password);

  const validate = (): string => {
    if (!firstName.trim()) return "Enter your full name.";
    if (userName.trim().length < 4)
      return "Username must be at least 4 characters.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
    if (!/^[0-9+\s-]{9,15}$/.test(contact))
      return "Enter a valid phone number.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    if (!agree) return "Accept the terms to create your account.";
    return "";
  };



  const registerAccount = async () => {
    try {


      setError("");
      setSuccess("");
      const problem = validate();
      if (problem) {
        setError(problem);
        return;
      }

      const response = await registerAccountService(
        firstName,
        userName,
        email,
        address,
        contact,
        password,
        userRole,
      );
        console.log("response register : ",response)
      if (response.role == "owner") {
        const paymentUrl = await response.paymentUrl;
        const paymentData = await response.payment;

        if (paymentUrl && paymentData) {
          console.log("payment url : ", paymentUrl);
          console.log("payment Data : ", paymentData);
          startPayHerePayment(paymentUrl, paymentData);
        } else {
          setError("Payment details not received from server.");
        }
      } else {
        const url: string = "/login";

        window.location.replace(url);
      }

      // clearForm();
    } catch (err) {
      console.error("Registration failed:", err);
      setError("We could not create your account. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  interface PayHerePayment {
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;

    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;

    order_id: string;
    items: string;
    currency: string;
    amount: string;
    hash: string;
  }

  const startPayHerePayment = (
    paymentUrl: string,
    paymentData: PayHerePayment,
  ) => {
    const form = document.createElement("form");

    form.method = "POST";
    form.action = paymentUrl;

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = value;

      form.appendChild(input);
    });

    document.body.appendChild(form);

    form.submit();
  };

  return (
    <div className="reg-container">
      {/* LEFT SIDE: image + brand */}
      <div className="reg-img">
        <div className="reg-img-content">
          <div className="reg-brand">
            <div className="reg-logo"></div>
            <h1 className="reg-brand-name">PumpCheck</h1>
          </div>

          <div>
            <h1 className="reg-headline">{info.title}</h1>
            <p className="reg-lede">{info.sub}</p>

            <ul className="reg-points">
              {info.points.map((p) => (
                <li key={p}>
                  <span className="reg-tick" aria-hidden="true">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="reg-bottom">
            <div className="reg-live"></div>
            <h2 className="reg-bottom-text">
              Stock updates are live · Colombo
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: form */}
      <div className="reg-box">
        <div className="reg-form-wrap">
          <h1 className="reg-heading">Create your account</h1>
          <p className="reg-sub">Choose how you will use PumpCheck.</p>

          {/* Role cards */}
          <div
            className="reg-roles"
            role="radiogroup"
            aria-label="Account type"
          >
            <button
              type="button"
              role="radio"
              aria-checked={userRole === "customer"}
              className={`reg-role ${userRole === "customer" ? "is-active" : ""}`}
              onClick={() => setRole("customer")}
            >
              <span className="reg-role-title">Driver</span>
              <span className="reg-role-text">Check fuel on the map</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={userRole === "owner"}
              className={`reg-role ${userRole === "owner" ? "is-active" : ""}`}
              onClick={() => setRole("owner")}
            >
              <span className="reg-role-title">Station owner</span>
              <span className="reg-role-text">Register and manage stock</span>
            </button>
          </div>

          <form onSubmit={registerAccount} noValidate>
            {error && (
              <div className="reg-alert reg-alert--error" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="reg-alert reg-alert--ok" role="status">
                {success}
              </div>
            )}

            <div className="reg-row">
              <div className="reg-group">
                <label htmlFor="fullName">First name</label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your First name"
                  value={firstName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="reg-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-row">
              <div className="reg-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="reg-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="07X XXX XXXX"
                  value={contact}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-row">
              <div className="reg-group">
                <label htmlFor="email">Address</label>
                <input
                  id="address"
                  type="address"
                  autoComplete="address"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-row">
              <div className="reg-group">
                <label htmlFor="password">Password</label>
                <div className="reg-password">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="reg-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="reg-group">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            {password && (
              <div className="reg-strength" data-score={strength.score}>
                <div className="reg-strength-bars" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="reg-strength-label">{strength.label}</span>
              </div>
            )}

            <label className="reg-agree">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the <a href="#">Terms</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button
              type="button"
              className="reg-submit"
              disabled={loading}
              onClick={registerAccount}
            >
              {loading
                ? "Creating account..."
                : userRole === "owner"
                  ? "Register my station"
                  : "Create account"}
            </button>
          </form>

          <p className="reg-switch">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
