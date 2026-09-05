import { useState, type FC } from "react";

/* ──────────────────────────────────────────────
   Inline SVG Icons
   ────────────────────────────────────────────── */

const icon = (paths: string, cls?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cls ?? "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: paths }}
  />
);

/* shorthand icon builders */
const DashboardIcon = (c?: string) =>
  icon('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>', c);
const MapPinIcon = (c?: string) =>
  icon('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>', c);
const BellIcon = (c?: string) =>
  icon('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', c);
const ShieldIcon = (c?: string) =>
  icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', c);
const PhoneIcon = (c?: string) =>
  icon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/>', c);
const BookIcon = (c?: string) =>
  icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>', c);
const FileTextIcon = (c?: string) =>
  icon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>', c);
const InfoIcon = (c?: string) =>
  icon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>', c);
const ChevronRightIcon = (c?: string) =>
  icon('<polyline points="9 18 15 12 9 6"/>', c);
const ArrowLeftIcon = (c?: string) =>
  icon('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>', c);
const BuildingIcon = (c?: string) =>
  icon('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/>', c);
const UsersIcon = (c?: string) =>
  icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', c);
const AlertTriangleIcon = (c?: string) =>
  icon('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', c);
const RadioIcon = (c?: string) =>
  icon('<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/>', c);

/* ──────────────────────────────────────────────
   Sidebar Nav Items
   ────────────────────────────────────────────── */

interface NavItem {
  label: string;
  icon: (c?: string) => JSX.Element;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Live Map", icon: MapPinIcon },
  { label: "Alerts", icon: BellIcon, badge: 2 },
  { label: "Shelters", icon: ShieldIcon },
  { label: "Helpline", icon: PhoneIcon },
  { label: "Resources", icon: BookIcon },
  { label: "Guidelines", icon: FileTextIcon },
  { label: "About Us", icon: InfoIcon },
];

/* ──────────────────────────────────────────────
   Quick Action Card
   ────────────────────────────────────────────── */

interface QuickActionProps {
  iconBg: string;
  iconEl: JSX.Element;
  title: string;
  description: string;
}

const QuickAction: FC<QuickActionProps> = ({ iconBg, iconEl, title, description }) => (
  <button
    onClick={() => console.log(`action: ${title}`)}
    className="flex items-center gap-3.5 w-full rounded-xl bg-[#1a1d2e]/80 border border-gray-700/50 p-4 text-left cursor-pointer transition-all duration-200 hover:border-gray-600 hover:bg-[#1f2235] group"
  >
    <span className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${iconBg}`}>
      {iconEl}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-100">{title}</p>
      <p className="text-xs text-gray-400 leading-snug mt-0.5">{description}</p>
    </div>
    <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-gray-300 group-hover:bg-white/20 transition-colors">
      {ChevronRightIcon("w-4 h-4")}
    </span>
  </button>
);

/* ──────────────────────────────────────────────
   Info Tip Card (bottom bar)
   ────────────────────────────────────────────── */

interface InfoTipProps {
  color: string;
  iconEl: JSX.Element;
  title: string;
  description: string;
}

const InfoTip: FC<InfoTipProps> = ({ color, iconEl, title, description }) => (
  <div className="flex items-start gap-3 min-w-0">
    <span className={`shrink-0 mt-0.5 ${color}`}>{iconEl}</span>
    <div className="min-w-0">
      <p className={`text-xs font-bold ${color}`}>{title}</p>
      <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{description}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   Emergency Dashboard
   ══════════════════════════════════════════════ */

interface Props {
  onBack: () => void;
}

const EmergencyDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  const dateStr = now.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="h-screen flex flex-col bg-[#0f1117] text-gray-200 font-sans overflow-hidden">
      {/* ── Top Header ──────────────────────── */}
      <header className="shrink-0 flex items-center justify-between gap-4 px-4 lg:px-6 h-16 bg-[#13151f] border-b border-gray-800">
        {/* Left: logo + back */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden shrink-0 p-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button onClick={onBack} className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors" title="Back to Home">
            {ArrowLeftIcon("w-5 h-5")}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-red-600/20 ring-2 ring-red-500/40">
              {AlertTriangleIcon("w-5 h-5 text-red-400")}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight tracking-wide">
                <span className="text-red-400">EMERGENCY</span>{" "}
                <span className="text-gray-100">WINDOW</span>
              </p>
              <p className="text-[10px] text-gray-500 tracking-wide">Your Safety, Our Priority</p>
            </div>
          </div>
        </div>

        {/* Center: alert banner */}
        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-700/90 to-red-600/90 px-5 py-2 rounded-full">
          <span className="text-yellow-300">{AlertTriangleIcon("w-4 h-4")}</span>
          <div className="text-center">
            <p className="text-xs font-bold text-white tracking-wider">ALERT ACTIVE</p>
            <p className="text-[10px] text-red-100">Please take immediate action and stay safe.</p>
          </div>
        </div>

        {/* Right: time + weather */}
        <div className="hidden sm:flex items-center gap-5 text-right">
          <div>
            <p className="text-xs font-semibold text-gray-200">{timeStr}</p>
            <p className="text-[10px] text-gray-500">{dateStr}</p>
          </div>
          <div className="border-l border-gray-700 pl-4">
            <p className="text-xs font-semibold text-gray-200">27°C</p>
            <p className="text-[10px] text-gray-500">Light Rain</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Mobile sidebar overlay ─────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Left Sidebar ──────────────────── */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-56 bg-[#13151f] border-r border-gray-800
            flex flex-col pt-4 pb-4 transition-transform duration-300
            lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Nav list */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = item.label === activeNav;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    setSidebarOpen(false);
                    console.log(`nav: ${item.label}`);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    cursor-pointer transition-all duration-150
                    ${isActive
                      ? "bg-red-600/20 text-red-400 border-l-[3px] border-red-500"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border-l-[3px] border-transparent"
                    }
                  `}
                >
                  {item.icon(isActive ? "w-[18px] h-[18px] text-red-400" : "w-[18px] h-[18px]")}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* SOS box */}
          <div className="mx-3 mt-4 rounded-xl bg-gradient-to-b from-[#1e1f2e] to-[#1a1b28] border border-gray-700/50 p-4">
            <p className="text-[10px] text-red-400 font-bold tracking-wide mb-1">In an Emergency?</p>
            <p className="text-sm font-bold text-gray-100 leading-snug">Stay Calm, Stay Safe</p>
            <p className="text-[11px] text-gray-500 mt-0.5 mb-3">We are here to help you.</p>
            <button
              onClick={() => console.log("SOS triggered")}
              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider cursor-pointer transition-colors shadow-lg shadow-red-900/30"
            >
              SOS
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ─────────────── */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-5">
            {/* ── Center: Map ────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-700/50 bg-[#1a1d2e] min-h-[300px]">
                {/* Embedded map (OSM — Wayanad area) */}
                <iframe
                  title="Emergency Map — Wayanad"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=75.8,11.5,76.3,11.85&layer=mapnik"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: "saturate(0.85) contrast(1.05)" }}
                  loading="lazy"
                />

                {/* "Raise an Alert" overlay button */}
                <div className="absolute top-4 left-4 z-10">
                  <button
                    onClick={() => console.log("raise alert")}
                    className="flex items-center gap-2 bg-[#181a27]/90 backdrop-blur border border-gray-600/50 rounded-lg px-4 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-[#1f2235] transition-colors shadow-lg"
                  >
                    <span className="text-yellow-400">{AlertTriangleIcon("w-4 h-4")}</span>
                    RAISE AN ALERT
                  </button>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
                  <button className="w-9 h-9 rounded-lg bg-[#181a27]/90 backdrop-blur border border-gray-600/50 text-gray-300 hover:text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors">+</button>
                  <button className="w-9 h-9 rounded-lg bg-[#181a27]/90 backdrop-blur border border-gray-600/50 text-gray-300 hover:text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors">−</button>
                  <button className="w-9 h-9 rounded-lg bg-[#181a27]/90 backdrop-blur border border-gray-600/50 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Live Update Bar ────────────── */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-[#1a1d2e] border border-gray-700/50 px-4 py-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="mt-0.5 text-red-400 shrink-0">{RadioIcon("w-4 h-4")}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-red-400">Live Update</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      Heavy rainfall reported in your area. Avoid low-lying areas and move to nearest safe place.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => console.log("view all alerts")}
                  className="shrink-0 flex items-center gap-1 text-xs font-medium text-gray-300 border border-gray-600/50 rounded-lg px-3 py-1.5 hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  View All Alerts
                  <span className="text-gray-500">→</span>
                </button>
              </div>

              {/* ── Bottom Info Tips ──────────── */}
              <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <InfoTip
                  color="text-red-400"
                  iconEl={BellIcon("w-4 h-4")}
                  title="Stay Informed"
                  description="Get real-time alerts and updates in your area."
                />
                <InfoTip
                  color="text-green-400"
                  iconEl={ShieldIcon("w-4 h-4")}
                  title="Be Prepared"
                  description="Know what to do and where to go."
                />
                <InfoTip
                  color="text-blue-400"
                  iconEl={UsersIcon("w-4 h-4")}
                  title="Stay Safe"
                  description="Your safety is our top priority."
                />
                <InfoTip
                  color="text-yellow-400"
                  iconEl={InfoIcon("w-4 h-4")}
                  title="Help Others"
                  description="Share alerts and help your community."
                />
              </div>
            </div>

            {/* ── Right Sidebar ──────────────── */}
            <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">
              {/* Quick actions */}
              <div className="rounded-2xl bg-[#13151f] border border-gray-800 p-5">
                <h3 className="text-sm font-bold text-gray-100 mb-0.5">What would you like to do?</h3>
                <p className="text-[11px] text-gray-500 mb-4">Quick actions to get help immediately</p>

                <div className="space-y-3">
                  <QuickAction
                    iconBg="bg-red-600/20"
                    iconEl={MapPinIcon("w-5 h-5 text-red-400")}
                    title="Nearest Safe Place"
                    description="Find the nearest shelters and safe zones around you."
                  />
                  <QuickAction
                    iconBg="bg-blue-600/20"
                    iconEl={BuildingIcon("w-5 h-5 text-blue-400")}
                    title="Contact Government Office"
                    description="Get in touch with local authorities for assistance."
                  />
                  <QuickAction
                    iconBg="bg-green-600/20"
                    iconEl={PhoneIcon("w-5 h-5 text-green-400")}
                    title="Call to Emergency"
                    description="Call emergency services immediately for help."
                  />
                </div>
              </div>

              {/* Emergency Helpline */}
              <div className="rounded-2xl bg-[#13151f] border border-gray-800 p-5">
                <p className="text-xs font-semibold text-gray-400 text-center mb-3">Emergency Helpline</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-red-400">{PhoneIcon("w-8 h-8")}</span>
                  <div>
                    <p className="text-3xl font-extrabold text-white tracking-wider">112</p>
                    <p className="text-[10px] text-gray-500">Available 24/7</p>
                  </div>
                  <button
                    onClick={() => console.log("call 112")}
                    className="ml-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-md shadow-red-900/30"
                  >
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile alert banner (shown at bottom on small screens) ── */}
      <div className="md:hidden shrink-0 flex items-center justify-center gap-2 bg-red-700/90 px-4 py-2">
        <span className="text-yellow-300">{AlertTriangleIcon("w-3.5 h-3.5")}</span>
        <p className="text-[11px] font-semibold text-white">ALERT ACTIVE — Take immediate action</p>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
