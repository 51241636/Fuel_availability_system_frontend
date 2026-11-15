import { useState } from "react";
import type { FormEvent } from "react";
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../services/userService";

import "../pages/forgotPassword.css";

interface ForgotPasswordProps {
  onClose: () => void;
}

type ResetStep = "email" | "otp" | "password" | "success";

const ForgotPassword = ({ onClose }: ForgotPasswordProps) => {
  const [step, setStep] = useState<ResetStep>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1 - Send OTP
  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(email.trim());

      setSuccess(
        response.data.message || "OTP sent successfully. Check your email."
      );

      setStep("otp");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - Verify OTP
  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyResetOTP(email.trim(), otp);

      setSuccess(response.data.message || "OTP verified successfully.");

      setStep("password");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 - Reset Password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        email.trim(),
        otp,
        newPassword
      );

      setSuccess(
        response.data.message || "Password reset successfully."
      );

      setStep("success");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overlay">
      <div className="forgot-modal">
        <button
          type="button"
          className="forgot-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="forgot-glow" />

        {step !== "success" ? (
          <>
            <div className="forgot-icon-wrapper">
              <div className="forgot-icon">
                {step === "email" ? "✉" : step === "otp" ? "🔐" : "🔑"}
              </div>
            </div>

            <span className="forgot-tag">
              {step === "email"
                ? "PASSWORD RECOVERY"
                : step === "otp"
                  ? "EMAIL VERIFICATION"
                  : "CREATE NEW PASSWORD"}
            </span>

            <h2>
              {step === "email"
                ? "Forgot your password?"
                : step === "otp"
                  ? "Verify your email"
                  : "Set a new password"}
            </h2>

            <p className="forgot-description">
              {step === "email"
                ? "Enter your registered email address. We'll send you a verification code."
                : step === "otp"
                  ? `Enter the 6-digit verification code sent to ${email}.`
                  : "Create a new password for your PumpCheck account."}
            </p>

            {error && (
              <div className="forgot-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="forgot-success" role="status">
                {success}
              </div>
            )}

            {step === "email" && (
              <form onSubmit={handleSendOTP}>
                <div className="forgot-input-wrapper">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send verification code"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOTP}>
                <div className="forgot-input-wrapper">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  className="forgot-back"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setStep("email");
                  }}
                >
                  Change email address
                </button>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={handleResetPassword}>
                <div className="forgot-input-wrapper">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="forgot-input-wrapper">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >
                  {loading ? "Resetting password..." : "Reset password"}
                </button>
              </form>
            )}

            <button
              type="button"
              className="forgot-back"
              onClick={onClose}
            >
              Back to login
            </button>
          </>
        ) : (
          <div className="forgot-success-screen">
            <div className="forgot-success-icon">✓</div>

            <span className="forgot-tag">SUCCESS</span>

            <h2>Password Reset Successfully!</h2>

            <p className="forgot-description">
              Your password has been updated. You can now log in to
              PumpCheck using your new password.
            </p>

            <button
              type="button"
              className="forgot-submit"
              onClick={onClose}
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="forgot-footer">
          <span className="forgot-footer-dot" />
          PumpCheck Account Security
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;