import { useState, type FC, type ReactNode } from "react";
import RotatingFeatureLine, { type RotatingFeatureItem } from "./RotatingFeatureLine";

/* ──────────────────────────────────────────────
   Inline SVG Icons (no external dependency)
   ────────────────────────────────────────────── */

const AlertIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const UserIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* tiny icons used in the "Unique Options" feature grid */

const BellIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TruckIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const MapIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const BotIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const EyeIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="7" r="3" />
  </svg>
);

const EyeOffIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ──────────────────────────────────────────────
   Role Tab Data
   ────────────────────────────────────────────── */

type RoleKey = "emergency" | "user" | "admin";

interface RoleTabData {
  key: RoleKey;
  label: string;
  icon: ReactNode;
  points: string[];
  ctaLabel: string;
  /** Active tab pill colors */
  pillBg: string;
  pillText: string;
  /** CTA button colors */
  ctaBg: string;
  /** Bullet dot accent */
  dotColor: string;
}

const ROLES: RoleTabData[] = [
  {
    key: "emergency",
    label: "Emergency",
    icon: <AlertIcon className="w-4 h-4" />,
    points: [
      "Direct contact to nearest helplines",
      "Nearest safe place with navigation",
      "Threat options in high-danger condition",
      "SOS alert button — notifies nearest department instantly",
    ],
    ctaLabel: "Emergency Access",
    pillBg: "bg-red-600",
    pillText: "text-white",
    ctaBg: "bg-red-600 hover:bg-red-700",
    dotColor: "bg-red-500",
  },
  {
    key: "user",
    label: "User",
    icon: <UserIcon className="w-4 h-4" />,
    points: [
      "Login via ID",
      "Check updates near your district",
      "Check weather conditions",
      "Chatbot for guidance & hazard awareness",
      "Report anything dangerous from your side",
    ],
    ctaLabel: "User Login",
    pillBg: "bg-blue-600",
    pillText: "text-white",
    ctaBg: "bg-blue-600 hover:bg-blue-700",
    dotColor: "bg-blue-500",
  },
  {
    key: "admin",
    label: "Admin",
    icon: <ShieldIcon className="w-4 h-4" />,
    points: [
      "View population count per district",
      "View safe locations with capacity",
      "Track transport vehicles for migration",
      "Update portal regularly",
      "Emergency dashboard — monitor solved vs pending cases",
    ],
    ctaLabel: "Admin Login",
    pillBg: "bg-slate-700",
    pillText: "text-white",
    ctaBg: "bg-slate-700 hover:bg-slate-800",
    dotColor: "bg-slate-500",
  },
];

const FEATURE_ITEMS: RotatingFeatureItem[] = [
  {
    icon: <BellIcon className="w-4 h-4 text-blue-300" />,
    text: "Quick alerts within your district radius — stay informed the moment danger is detected nearby.",
  },
  {
    icon: <TruckIcon className="w-4 h-4 text-blue-300" />,
    text: "Transport option with full navigation to safe places — route guidance for evacuation vehicles.",
  },
  {
    icon: <MapIcon className="w-4 h-4 text-blue-300" />,
    text: "Interactive map with red/green markers for dangerous vs safe zones — see risk at a glance.",
  },
  {
    icon: <BotIcon className="w-4 h-4 text-blue-300" />,
    text: "AI chatbot that interacts with and guides users — real-time hazard awareness & relocation help.",
  },
];

/* ══════════════════════════════════════════════
   Landing Page
   ══════════════════════════════════════════════ */

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";

interface LandingPageProps {
  onNavigate?: (role: RoleKey) => void;
}

const LandingPage: FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeRole, setActiveRole] = useState<RoleKey>("user");
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User Phone + OTP state
  const [userPhone, setUserPhone] = useState("");
  const [userOtp, setUserOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [userRememberMe, setUserRememberMe] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = () => {
    if (userPhone.trim().length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpError("");
    setOtpSent(true);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").slice(0, 4).split("");
      const newOtp = [...userOtp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setUserOtp(newOtp);
      const nextInput = document.getElementById(`user-otp-${Math.min(digits.length - 1, 3)}`);
      nextInput?.focus();
      return;
    }
    const digit = val.replace(/\D/g, "");
    const newOtp = [...userOtp];
    newOtp[index] = digit;
    setUserOtp(newOtp);

    if (digit && index < 3) {
      const nextInput = document.getElementById(`user-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !userOtp[index] && index > 0) {
      const prevInput = document.getElementById(`user-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPhone.trim().length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }
    const fullOtp = userOtp.join("");
    if (fullOtp.length < 4) {
      setOtpError("Please enter the 4-digit OTP (Demo: 1234)");
      return;
    }
    setOtpError("");
    console.log("user login", { phone: userPhone, otp: fullOtp, rememberMe: userRememberMe });
    onNavigate?.("user");
  };

  const active = ROLES.find((r) => r.key === activeRole)!;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* ── Navbar ────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          <span className="text-lg font-bold tracking-tight text-blue-900">
            SurakshaSetu
          </span>
          <span className="hidden sm:block text-xs text-slate-500">
            Hazard Red Zone &amp; Relocation Planning — SIH 2024
          </span>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          Split-Screen Hero
         ══════════════════════════════════════════ */}
      <section className="relative flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
        {/* ── LEFT: Image side ────────────────── */}
        <div className="relative lg:w-[60%] w-full min-h-[40vh] lg:min-h-full">
          {/* Background image */}
          <img
            src={HERO_IMAGE}
            alt="Mountainous terrain resembling Wayanad, Kerala"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-950/70 to-blue-950/40"
          />

          {/* Text content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-16 py-12 lg:py-20">
            {/* Eyebrow */}
            <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-blue-300 mb-4">
              Disaster Management
            </span>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              SURAKSHASETU
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-lg sm:text-xl lg:text-2xl font-medium text-blue-100/90">
              Know the Risk. Find a Safe Place. Plan the Shift.
            </p>

            {/* Supporting paragraph */}
            <p className="mt-3 max-w-lg text-[13px] sm:text-sm text-slate-300/80 leading-relaxed">
              A unified platform for identifying hazard red zones, mapping safe
              relocation sites, and coordinating disaster-response logistics —
              built for Wayanad, Kerala and scalable nationwide.
            </p>

            {/* Feature highlights (single rotating typewriter slot) */}
            <RotatingFeatureLine items={FEATURE_ITEMS} />
          </div>
        </div>

        {/* ── RIGHT: Tabbed card side ─────────── */}
        <div className="relative lg:w-[40%] w-full flex items-center justify-center bg-slate-100 px-4 sm:px-8 py-10 lg:py-0">
          {/* Card */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/60 p-7 sm:p-9">
            {/* Wordmark */}
            <h2 className="text-xl font-bold text-blue-950 tracking-tight text-center mb-6">
              SurakshaSetu
            </h2>

            {/* ── Tab pills ──────────────────── */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-7">
              {ROLES.map((role) => {
                const isActive = activeRole === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => setActiveRole(role.key)}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5
                      py-2.5 rounded-lg text-sm font-medium
                      cursor-pointer transition-all duration-200
                      ${
                        isActive
                          ? `${role.pillBg} ${role.pillText} shadow-sm`
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    {role.icon}
                    <span className="hidden sm:inline">{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Active role content ─────────── */}
            {activeRole === "admin" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("admin login");
                }}
                className="space-y-4 mb-2"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Enter Admin-Id
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="— — — — — — — —"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 placeholder:tracking-widest outline-none border border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="— — — — — — — —"
                      className="w-full px-4 py-3 pr-11 rounded-lg bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 placeholder:tracking-widest outline-none border border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="adminRememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer accent-slate-900"
                  />
                  <label
                    htmlFor="adminRememberMe"
                    className="text-xs font-medium text-slate-600 select-none cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
                >
                  Login
                </button>
              </form>
            ) : activeRole === "user" ? (
              <form onSubmit={handleUserLogin} className="space-y-4 mb-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Enter Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm select-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={userPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setUserPhone(val);
                        if (otpError) setOtpError("");
                        if (val.length === 10 && !otpSent) {
                          setOtpSent(true);
                        }
                      }}
                      placeholder="Enter 10-digit number"
                      className="flex-1 px-4 py-3 rounded-lg bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className={`px-3 py-3 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        otpSent
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {otpSent ? "Resend" : "Get OTP"}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-500">
                      Enter 4-Digit OTP
                    </label>
                    {otpSent && (
                      <span className="text-[11px] text-green-600 font-medium">
                        OTP Sent (Demo: 1234)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    {userOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`user-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        placeholder="—"
                        className="w-12 h-12 text-center text-lg font-bold rounded-lg bg-slate-100 text-slate-800 placeholder:text-slate-400 outline-none border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>

                {otpError && (
                  <p className="text-xs text-red-500 font-medium">{otpError}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="userRememberMe"
                      checked={userRememberMe}
                      onChange={(e) => setUserRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <label
                      htmlFor="userRememberMe"
                      className="text-xs font-medium text-slate-600 select-none cursor-pointer"
                    >
                      Remember Me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserPhone(userPhone || "9876543210");
                      setUserOtp(["1", "2", "3", "4"]);
                      setOtpSent(true);
                      if (otpError) setOtpError("");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Auto-fill Demo
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#0f52ba] hover:bg-[#0d47a1] text-white font-bold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
                >
                  Login
                </button>
              </form>
            ) : (
              <>
                <div className="min-h-[210px]">
                  <ul className="space-y-3 mb-8">
                    {active.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-sm text-slate-600">
                        <span
                          className={`mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full ${active.dotColor}`}
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onNavigate ? onNavigate(activeRole) : console.log(`navigate to ${activeRole}`)}
                  className={`
                    w-full py-3 rounded-xl text-white font-semibold text-sm
                    cursor-pointer transition-colors duration-200 shadow-sm
                    ${active.ctaBg}
                  `}
                >
                  {active.ctaLabel}
                </button>
              </>
            )}

            {/* Footer line */}
            <p className="mt-5 text-center text-[11px] text-slate-400">
              Demo District:{" "}
              <span className="font-medium text-slate-500">
                Wayanad, Kerala
              </span>{" "}
              — Landslide Hazard
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} SurakshaSetu — SIH 2024 (Problem ID 26191)</span>
          <span>
            Demo District:{" "}
            <strong className="text-slate-700">Wayanad, Kerala</strong> —
            Landslide Hazard
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
