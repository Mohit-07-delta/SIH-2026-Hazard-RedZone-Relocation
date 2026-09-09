import { useState, useEffect, type FC, type FormEvent } from "react";
import "./login.css";
import logoImg from "../assets/logo.jpeg";
import bgImg from "../assets/login-bg.jpg";

type RoleKey = "emergency" | "user" | "admin";

interface LandingPageProps {
  onNavigate?: (role: RoleKey) => void;
}

interface FeatureItem {
  icon: string;
  text: string;
}

const FEATURES: FeatureItem[] = [
  { icon: "\uD83D\uDE9A", text: "Transport \u2014 route guidance for evacuation vehicles" },
  { icon: "\uD83D\uDD14", text: "Quick alerts within your district radius" },
  { icon: "\uD83D\uDDFa\uFE0F", text: "Interactive hazard and safe shelter map" },
  { icon: "\uD83E\uDD16", text: "AI Assistant for 24/7 disaster guidance" },
];

export const LandingPage: FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeRole, setActiveRole] = useState<RoleKey>("user");

  // User form state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Admin form state
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminRemember, setAdminRemember] = useState(false);

  // Typewriter feature state
  const [featureIdx, setFeatureIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = FEATURES[featureIdx].text;
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 20);
      } else {
        setIsDeleting(false);
        setFeatureIdx((prev) => (prev + 1) % FEATURES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, featureIdx]);

  const handleSendOtp = () => {
    if (phone.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    if (!otp) setOtp("123456");
  };

  const handleUserLogin = (e: FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 10) {
      setErrorMsg("Please enter your 10-digit mobile number");
      return;
    }
    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP (Demo: 123456)");
      return;
    }
    setErrorMsg("");
    onNavigate?.("user");
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPassword.trim()) {
      setErrorMsg("Please enter Admin ID and Password");
      return;
    }
    setErrorMsg("");
    alert("Admin credentials verified! Loading Admin Portal...");
  };

  return (
    <div className="login-wrapper">
      <div className="login-page">
        {/* ================= LEFT SIDE ================= */}
        <div
          className="login-left"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        >
          <div className="left-overlay" />

          <div className="left-content">
            {/* LOGO */}
            <img
              src={logoImg}
              alt="SurakshaSetu Logo"
              className="login-logo"
            />

            <div className="small-title">DISASTER MANAGEMENT</div>

            <h1>
              SURAKSHA<span>SETU</span>
            </h1>

            <p>Know the Risk. Find a Safe Place. Plan the Shift.</p>

            {/* ANIMATED FEATURE */}
            <div className="user-feature">
              <span className="user-feature-icon">
                {FEATURES[featureIdx].icon}
              </span>
              <span>
                {displayedText}
                <span className="typing-cursor" />
              </span>
            </div>

            {/* FEATURES */}
            <div className="left-features" />
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="login-right">
          <div className="login-card">
            {/* BRAND */}
            <div className="card-brand">
              <img
                src={logoImg}
                alt="SurakshaSetu Logo"
                className="card-logo"
              />
              <h2>
                Suraksha<span>Setu</span>
              </h2>
              <p>Disaster Management Portal</p>
            </div>

            {/* ROLE TABS */}
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${activeRole === "emergency" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("emergency");
                  setErrorMsg("");
                }}
              >
                \u26A0 Emergency
              </button>

              <button
                type="button"
                className={`role-tab ${activeRole === "user" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("user");
                  setErrorMsg("");
                }}
              >
                \uD83D\uDC64 User
              </button>

              <button
                type="button"
                className={`role-tab ${activeRole === "admin" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("admin");
                  setErrorMsg("");
                }}
              >
                \u25C7 Admin
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {errorMsg && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fee2e2",
                  color: "#b91c1c",
                  fontSize: "12px",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* USER TAB CONTENT */}
            {activeRole === "user" && (
              <form onSubmit={handleUserLogin}>
                <div className="login-heading">
                  <h3>
                    <span className="user-icon">\uD83D\uDC64</span>
                    User
                  </h3>
                  <p>Login to access your account</p>
                </div>

                {/* PHONE */}
                <label className="field-label">Enter Phone Number</label>
                <div className="phone-row">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="Enter 10 digit mobile number"
                  />
                </div>

                {/* OTP */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <label className="field-label" style={{ margin: 0 }}>
                    Enter OTP
                  </label>
                  {otpSent && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      OTP Sent! (Demo: 123456)
                    </span>
                  )}
                </div>
                <div className="otp-row">
                  <button
                    type="button"
                    className="otp-btn"
                    onClick={handleSendOtp}
                  >
                    \u2708 {otpSent ? "Resend" : "Get OTP"}
                  </button>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="Enter 6 digit OTP"
                  />
                </div>

                {/* OPTIONS */}
                <div className="login-options">
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember Me</span>
                  </label>
                  <span className="signup-text">
                    Create New? <a href="#" onClick={(e) => { e.preventDefault(); alert("Registration is open for Wayanad residents. Enter phone & OTP to login."); }}>Sign up</a>
                  </span>
                </div>

                {/* QUICK AUTOFILL FOR DEMO */}
                <div style={{ textAlign: "right", marginTop: "-15px", marginBottom: "15px" }}>
                  <button
                    type="button"
                    className="autofill-btn"
                    onClick={() => {
                      setPhone("9876543210");
                      setOtp("123456");
                      setOtpSent(true);
                      setErrorMsg("");
                    }}
                  >
                    \u26A1 Auto-fill Demo
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <button type="submit" className="login-btn">
                  \u21AA &nbsp; Login
                </button>
              </form>
            )}

            {/* EMERGENCY TAB CONTENT */}
            {activeRole === "emergency" && (
              <div>
                <div className="login-heading">
                  <h3>
                    <span className="user-icon">\uD83D\uDEA8</span>
                    Emergency
                  </h3>
                  <p>Immediate hazard response & evacuation navigation</p>
                </div>

                <div className="emergency-info-card">
                  <div className="emergency-bullet">
                    <span style={{ fontSize: "16px" }}>\uD83D\uDCCD</span>
                    <span>Live GPS location mapping for nearest safe shelters</span>
                  </div>
                  <div className="emergency-bullet">
                    <span style={{ fontSize: "16px" }}>\u26A1</span>
                    <span>SOS distress broadcast to local responders and district control</span>
                  </div>
                  <div className="emergency-bullet">
                    <span style={{ fontSize: "16px" }}>\uD83D\uDCDE</span>
                    <span>Emergency helpline direct access: Police (112), Ambulance (108)</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="login-btn emergency-btn"
                  onClick={() => onNavigate?.("emergency")}
                >
                  \uD83D\uDEA8 &nbsp; Enter Emergency Portal
                </button>

                <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "15px" }}>
                  No login required for life-safety emergency mode
                </p>
              </div>
            )}

            {/* ADMIN TAB CONTENT */}
            {activeRole === "admin" && (
              <form onSubmit={handleAdminLogin}>
                <div className="login-heading">
                  <h3>
                    <span className="user-icon">\u25C7</span>
                    Admin
                  </h3>
                  <p>Authorized portal for district authorities & responders</p>
                </div>

                <div className="admin-field-row">
                  <label className="field-label">Enter Admin-Id</label>
                  <div className="phone-row">
                    <input
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="e.g. ADM-WAYANAD-01"
                    />
                  </div>
                </div>

                <div className="admin-field-row">
                  <label className="field-label">Enter Password</label>
                  <div className="admin-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter your admin password"
                    />
                    <button
                      type="button"
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "\uD83D\uDE48" : "\uD83D\uDC41\uFE0F"}
                    </button>
                  </div>
                </div>

                <div className="login-options">
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={adminRemember}
                      onChange={(e) => setAdminRemember(e.target.checked)}
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Contact district nodal officer for password reset."); }}>
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #0f172a)",
                  }}
                >
                  \u21AA &nbsp; Admin Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
