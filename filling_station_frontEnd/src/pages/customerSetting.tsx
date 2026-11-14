import React, { useEffect, useState } from "react";
import "./setting.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaSignOutAlt,
  FaSave,
  FaKey,
  FaShieldAlt,
} from "react-icons/fa";
import { getMyDetails } from "../services/AuthService";
import {
  ChangePassword,
  updateUserDetails,
} from "../services/settingService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthConext";
import type { ProfileDetails } from "../interface/profileDetail";
import {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
} from "../services/alertService";
import { CustomerSideBar } from "./customerSideBar";
// import type { Url } from "url";

const CustomerSetting = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await getMyDetails();
        setProfile(response.data.myDetails);
        setPreviewImage(response.data.image);
      } catch (error) {
        console.error("Failed to load station details:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchStation();
  }, []);

  // Replace these sample values with your logged-in user's details.
  const [profile, setProfile] = useState<ProfileDetails>({
    _id: "",
    userName: "",
    email: "",
    address: "",
    contact: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      await showWarningAlert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }
    setPreviewImage(URL.createObjectURL(file));
    setProfileImage(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const message = await updateUserDetails(profileImage, profile);
      await showSuccessAlert(
        "Your profile details have been updated successfully!",
      );
      setProfileImage(null);
    } catch (error) {
      console.error("Profile update failed:", error);

      await showErrorAlert("Unable to update your profile. Please try again.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      await showWarningAlert("New password and confirm password do not match.");
      return;
    }

    if (password.newPassword.length < 8) {
      await showWarningAlert("Password must contain at least 8 characters.");
      return;
    }

    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      await showSuccessAlert("You have been logged out successfully.");
      // navigate("/login", { replace: true });
      const url: string = "/login";

      window.location.replace(url);
    } catch (error) {
      console.error("Logout failed:", error);
      await showErrorAlert("Unable to log out. Please try again.");
    }
  };

  const changePassword = async () => {
    try {
      const response = await ChangePassword(
        password.currentPassword,
        password.newPassword,
      );
      await showSuccessAlert("Your password has been changed successfully!");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      await showErrorAlert(
        "Unable to change your password. Please check your current password.",
      );
    }
  };

  return (
    <div className="pump-dashboard">
      <CustomerSideBar />

      <main className="pump-main setting-main">
        {/* Page Header */}
        <header className="setting-header">
          <div className="setting-header-content">
            <div className="setting-header-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h1>
                Settings<span className="setting-title-dot">.</span>
              </h1>

              <p>
                Manage your account information and keep your account secure.
              </p>
            </div>
          </div>
        </header>

        <div className="setting-layout">
          {/* Left Column */}
          <div className="setting-left-column">
            {/* Profile Details */}
            <section className="setting-card">
              <div className="setting-card-heading">
                <div>
                  <span className="setting-kicker">PERSONAL INFORMATION</span>
                  <h2>Profile Details</h2>
                  <p>Update your personal and station contact information.</p>
                </div>

                <span className="setting-card-icon">
                  <FaUser />
                </span>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="setting-profile-image-section">
                  <div className="setting-avatar">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" />
                    ) : (
                      <span>
                        {profile.userName
                          .split(" ")
                          .map((userName) => userName[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}

                    <label
                      htmlFor="profileImage"
                      className="setting-avatar-edit"
                      title="Change profile image"
                    >
                      <FaCamera />
                    </label>

                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </div>

                  <div>
                    <h3>{profile.userName || "Your Name"}</h3>
                    <p>{profile.email}</p>
                    <span>Account profile</span>
                  </div>
                </div>

                <div className="setting-form-grid">
                  <div className="setting-field">
                    <label>Full name</label>
                    <div className="setting-input-wrapper">
                      <FaUser />
                      <input
                        type="name"
                        name="name"
                        value={profile.userName}
                        onChange={handleProfileChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="setting-field">
                    <label>Email address</label>
                    <div className="setting-input-wrapper">
                      <FaEnvelope />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="setting-field">
                    <label>Contact number</label>
                    <div className="setting-input-wrapper">
                      <FaPhone />
                      <input
                        type="contact"
                        name="contact"
                        value={profile.contact}
                        onChange={handleProfileChange}
                        placeholder="Enter contact number"
                        required
                      />
                    </div>
                  </div>

                  <div className="setting-field setting-full-width">
                    <label>Address</label>
                    <div className="setting-input-wrapper">
                      <FaMapMarkerAlt />
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                <div className="setting-form-actions">
                  <button
                    type="reset"
                    className="setting-cancel-btn"
                    onClick={() => window.location.reload()}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="setting-save-btn">
                    <FaSave />
                    Update details
                  </button>
                </div>
              </form>
            </section>

            {/* Change Password */}
            <section className="setting-card">
              <div className="setting-card-heading">
                <div>
                  <span className="setting-kicker">ACCOUNT SECURITY</span>
                  <h2>Change Password</h2>
                  <p>Use a strong password to protect your account.</p>
                </div>

                <span className="setting-card-icon">
                  <FaKey />
                </span>
              </div>

              <form onSubmit={handleUpdatePassword}>
                <div className="setting-field">
                  <label>Current password</label>
                  <div className="setting-input-wrapper password-input">
                    <FaLock />
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={password.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("current")}
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="setting-password-grid">
                  <div className="setting-field">
                    <label>New password</label>
                    <div className="setting-input-wrapper password-input">
                      <FaLock />
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("new")}
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="setting-field">
                    <label>Confirm new password</label>
                    <div className="setting-input-wrapper password-input">
                      <FaLock />
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={password.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="setting-password-hint">
                  <FaShieldAlt />
                  Password must contain at least 8 characters.
                </p>

                <div className="setting-form-actions">
                  <button type="submit" className="setting-save-btn">
                    <FaLock />
                    Update password
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column */}
          <aside className="setting-right-column">
            {/* Account Overview */}
            <section className="setting-account-card">
              <div className="setting-account-avatar">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" />
                ) : (
                  profile.userName
                    .split(" ")
                    .map((userName) => userName[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <h2>{profile.userName}</h2>
              <p>{profile.email}</p>

              <span className="setting-account-status">
                <span /> Active account
              </span>

              <div className="setting-account-divider" />

              <div className="setting-account-info">
                <div>
                  <span>Username</span>
                  <strong>{profile.userName}</strong>
                </div>

                <div>
                  <span>City</span>
                  <strong>{profile.address || "—"}</strong>
                </div>

                <div>
                  <span>District</span>
                  <strong>{profile.address || "—"}</strong>
                </div>
              </div>
            </section>

            {/* Security Info */}
            <section className="setting-security-card">
              <div className="setting-security-icon">
                <FaShieldAlt />
              </div>

              <h3>Keep your account secure</h3>
              <p>
                Never share your password or account credentials with anyone.
                Update your password regularly.
              </p>
            </section>

            {/* Logout */}
            <section className="setting-logout-card">
              <div>
                <h3>Sign out</h3>
                <p>You will need to log in again to manage your station.</p>
              </div>

              <button onClick={handleLogout}>
                <FaSignOutAlt />
                Log out
              </button>
            </section>
          </aside>
        </div>

        <footer className="setting-footer">
          <span>
            Account Settings <span>•</span> Fuel station dashboard
          </span>
          <span>Keep your account information up to date.</span>
        </footer>
      </main>
    </div>
  );
};

export default CustomerSetting;
