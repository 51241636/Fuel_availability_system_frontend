import { useState } from "react";
import "./forgotPassword.css";

interface ForgotPasswordProps {
  onClose: () => void;
  onSubmit?: (email: string) => void;
}

const ForgotPassword = ({ onClose, onSubmit }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overlay" onClick={onClose}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="forgot-close"
          onClick={onClose}
          type="button"
          aria-label="Close popup"
        >
          &times;
        </button>

        <div className="forgot-glow"></div>

        {!success ? (
          <>
            <div className="forgot-icon-wrapper">
              <div className="forgot-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="6" width="18" height="14" rx="3" />
                  <path d="m3 8 9 6 9-6" />
                  <path d="M8 6V4.5A2.5 2.5 0 0 1 10.5 2h3A2.5 2.5 0 0 1 16 4.5V6" />
                </svg>
              </div>
            </div>

            <span className="forgot-tag">ACCOUNT RECOVERY</span>

            <h2>Forgot Password?</h2>

            <p className="forgot-description">
              Don't worry! It happens. Enter your registered email address and
              we'll help you reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="forgot-email">Email Address</label>

              <div className="forgot-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {error && <p className="forgot-error">{error}</p>}

              <button
                className="forgot-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="forgot-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <button className="forgot-back" type="button" onClick={onClose}>
              <span>←</span> Back to Login
            </button>
          </>
        ) : (
          <div className="forgot-success">
            <div className="forgot-success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
            </div>

            <span className="forgot-tag">EMAIL SUBMITTED</span>

            <h2>Check Your Email!</h2>

            <p>
              If an account exists for <strong>{email}</strong>, you will
              receive password reset instructions.
            </p>

            <button className="forgot-submit" onClick={onClose} type="button">
              Back to Login
              <span>→</span>
            </button>
          </div>
        )}

        <div className="forgot-footer">
          <span className="forgot-footer-dot"></span>
          Secure Account Recovery
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
