import { useState, useRef, useEffect, type FC, type ReactNode, type FormEvent } from "react";

// ==========================================================================
// SurakshaSetu — Pan-India Resident Safety & Disaster Management Dashboard
// Visual identity: "Beacon to safety" — Forest-teal ink, signal amber, 
// terrain contour motifs, designed with authentic human craft.
// ==========================================================================

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  .ss-root {
    --ink: #0F1F1C;
    --ink-soft: #16302B;
    --paper: #F6F4EE;
    --paper-raised: #FFFFFF;
    --line: #E4E0D4;
    --teal: #0E6B62;
    --teal-deep: #0A4F48;
    --teal-tint: #E4F0EE;
    --amber: #C97A1E;
    --amber-tint: #FBEEDC;
    --danger: #B8271F;
    --danger-tint: #FBE7E4;
    --safe: #34724A;
    --safe-tint: #E5F0E6;
    --ink-60: rgba(15, 31, 28, 0.6);
    --ink-40: rgba(15, 31, 28, 0.4);
    font-family: 'Inter', sans-serif;
    color: var(--ink);
  }
  .ss-root .ss-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.015em; }
  .ss-root .ss-num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }

  .ss-contours {
    background-image:
      radial-gradient(circle at 15% 20%, rgba(255,255,255,0.05) 0, transparent 45%),
      repeating-radial-gradient(circle at 80% 110%, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 14px);
  }

  .ss-beacon {
    box-shadow: 0 0 0 0 rgba(201, 122, 30, 0.55);
    animation: ss-beacon-pulse 2.6s ease-out infinite;
  }
  @keyframes ss-beacon-pulse {
    0% { box-shadow: 0 0 0 0 rgba(201, 122, 30, 0.5); }
    70% { box-shadow: 0 0 0 14px rgba(201, 122, 30, 0); }
    100% { box-shadow: 0 0 0 0 rgba(201, 122, 30, 0); }
  }

  .ss-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
  .ss-scrollbar::-webkit-scrollbar-thumb { background: #C9C3AF; border-radius: 4px; }
  .ss-scrollbar::-webkit-scrollbar-track { background: transparent; }

  .ss-focus:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
  }

  @keyframes ss-slide-up {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .ss-animate-in {
    animation: ss-slide-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// ==========================================
// 🎨 HANDCRAFTED ICON PACK
// ==========================================
const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const p: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    shield: <><path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    warning: <><path d="m12 3 9 18H3L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
    bus: <><path d="M5 16h14" /><path d="M6 16V5h12v11" /><path d="M6 9h12" /><circle cx="8" cy="18" r="1.5" /><circle cx="16" cy="18" r="1.5" /></>,
    family: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><path d="M14 15c3 0 5 2 5 5" /></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19c0-1.1.9-2 2-2h13" /></>,
    simulation: <><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></>,
    report: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="M18 6 6 18M6 6l12 12" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    bot: <><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M12 8V4M8 4h8M2 14h2M20 14h2M9 13v2M15 13v2" /></>,
    droplet: <><path d="M12 2.5s6.5 7.2 6.5 12A6.5 6.5 0 1 1 5.5 14.5C5.5 9.7 12 2.5 12 2.5Z" /></>,
    utensils: <><path d="M7 3v7c0 1.1.9 2 2 2s2-.9 2-2V3M9 12v9M17 3c-1.5 0-3 1.5-3 4v4h3M17 11v10" /></>,
    cross: <><path d="M12 6v12M6 12h12" /></>,
    truck: <><rect x="1" y="7" width="13" height="10" rx="1" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="17.5" cy="18.5" r="1.5" /></>,
    pin: <><path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></>,
    users: <><circle cx="9" cy="7" r="3" /><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /><path d="M17 4.6a3 3 0 0 1 0 5.8" /><path d="M20.5 20c0-2.6-1.9-4.7-4.5-5.6" /></>,
    sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></>,
    volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    play: <><polygon points="5 3 19 12 5 21 5 3" /></>,
  };
  return <svg {...c}>{p[name] ?? p.settings}</svg>;
};

// ==========================================
// 🇮🇳 PAN-INDIA DATA REPOSITORY
// ==========================================
interface IndianRegion {
  id: string;
  name: string;
  state: string;
  hazardType: string;
  alertLevel: "Critical" | "High" | "Moderate" | "Low";
  weatherCondition: string;
  sheltersCount: number;
}

const REGIONS: IndianRegion[] = [
  { id: "wayanad", name: "Wayanad", state: "Kerala", hazardType: "Landslide & Inundation", alertLevel: "High", weatherCondition: "Heavy Monsoonal Rain (IMD Orange)", sheltersCount: 14 },
  { id: "chamoli", name: "Chamoli (Joshimath)", state: "Uttarakhand", hazardType: "Flash Flood & Slope Subsidence", alertLevel: "Critical", weatherCondition: "Torrential Downpour (IMD Red)", sheltersCount: 9 },
  { id: "puri", name: "Puri Coastal", state: "Odisha", hazardType: "Cyclonic Surge (Bay of Bengal)", alertLevel: "Moderate", weatherCondition: "Squally Winds 65 km/h", sheltersCount: 22 },
  { id: "guwahati", name: "Brahmaputra Basin", state: "Assam", hazardType: "Riverine Floods", alertLevel: "High", weatherCondition: "Water levels above danger mark", sheltersCount: 19 },
  { id: "shimla", name: "Shimla & Mandi", state: "Himachal Pradesh", hazardType: "Cloudburst & Road Blockage", alertLevel: "Moderate", weatherCondition: "Active Western Disturbance", sheltersCount: 11 },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: "home" },
  { label: "Safe Places", icon: "shield" },
  { label: "Alerts", icon: "bell" },
  { label: "Relocation", icon: "bus" },
  { label: "My Family", icon: "family" },
  { label: "Resources", icon: "book" },
  { label: "Disaster Simulation", icon: "simulation" },
  { label: "Settings", icon: "settings" },
];

const SEVERITY_STYLE: Record<string, { text: string; bg: string; dot: string }> = {
  High: { text: "#B8271F", bg: "#FBE7E4", dot: "#B8271F" },
  Critical: { text: "#8C1B15", bg: "#F6D9D5", dot: "#8C1B15" },
  Moderate: { text: "#C97A1E", bg: "#FBEEDC", dot: "#C97A1E" },
  Low: { text: "#34724A", bg: "#E5F0E6", dot: "#34724A" },
  Safe: { text: "#34724A", bg: "#E5F0E6", dot: "#34724A" },
  Unknown: { text: "#C97A1E", bg: "#FBEEDC", dot: "#C97A1E" },
};

function Badge({ level }: { level: string }) {
  const s = SEVERITY_STYLE[level] ?? SEVERITY_STYLE.Low;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.text, background: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {level}
    </span>
  );
}

// ==========================================
// 🗺️ ILLUSTRATED MAP COMPONENT
// ==========================================
function HazardMap({ filter, region }: { filter: string; region: IndianRegion }) {
  const showHazards = filter === "All" || filter === "Hazards";
  const showShelters = filter === "All" || filter === "Shelters" || filter === "Safe Sites";
  const showHospitals = filter === "All" || filter === "Hospitals";

  return (
    <svg viewBox="0 0 720 320" className="w-full h-full" role="img" aria-label={`Hazard Map for ${region.name}`}>
      <defs>
        <linearGradient id="ss-terrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFEAD9" />
          <stop offset="100%" stopColor="#DCD5BC" />
        </linearGradient>
        <radialGradient id="ss-hazard-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8271F" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#B8271F" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="720" height="320" fill="url(#ss-terrain)" />

      {[40, 75, 112, 150, 190, 232, 276].map((y, i) => (
        <path
          key={y}
          d={`M -10 ${y} C 120 ${y - 22}, 220 ${y + 24}, 340 ${y - 8} S 560 ${y + 20}, 730 ${y - 10}`}
          fill="none"
          stroke="#0F1F1C"
          strokeOpacity={0.06 + (i % 2) * 0.02}
          strokeWidth={1.2}
        />
      ))}

      <path d="M 30 260 C 160 230, 210 280, 340 250 S 560 200, 700 235" fill="none" stroke="#0E6B62" strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />

      {showHazards && (
        <g>
          <circle cx="255" cy="130" r="78" fill="url(#ss-hazard-glow)" />
          <path
            d="M 210 108 C 230 88, 275 88, 296 106 C 320 118, 316 152, 292 166 C 268 182, 226 178, 208 156 C 194 138, 194 120, 210 108 Z"
            fill="#B8271F"
            fillOpacity="0.22"
            stroke="#B8271F"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x="252" y="132" textAnchor="middle" fontSize="11" fontWeight={700} fill="#8C1B15">{region.name} Red Zone</text>
          <text x="252" y="146" textAnchor="middle" fontSize="9" fill="#8C1B15" fillOpacity={0.85}>{region.hazardType}</text>
        </g>
      )}

      <path d="M 300 168 C 360 190, 420 176, 470 190 C 530 206, 580 190, 616 168" fill="none" stroke="#0E6B62" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />

      <g transform="translate(300 168)">
        <circle r="9" fill="#0E6B62" fillOpacity="0.18" />
        <circle r="4.5" fill="#0E6B62" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
      <text x="300" y="192" textAnchor="middle" fontSize="9.5" fontWeight={600} fill="#16302B">Your Point</text>

      {showShelters && (
        <g fill="#34724A">
          <g transform="translate(616 168)">
            <path d="M0 -11 C6 -11 10 -6 10 0 C10 7 4 12 0 16 C-4 12 -10 7 -10 0 C-10 -6 -6 -11 0 -11Z" />
            <circle r="3" fill="#fff" />
          </g>
          <text x="616" y="196" textAnchor="middle" fontSize="9.5" fontWeight={600} fill="#16302B">Main Relief Camp</text>
        </g>
      )}

      {showHospitals && (
        <g transform="translate(430 232)">
          <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#B8271F" />
          <path d="M0 -4.5 V4.5 M-4.5 0 H4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <text x="0" y="24" textAnchor="middle" fontSize="8.5" fill="#16302B" fillOpacity={0.75}>Apex Hospital</text>
        </g>
      )}

      <g opacity="0.75">
        <rect x="18" y="18" width="145" height="22" rx="11" fill="#0F1F1C" fillOpacity="0.08" />
        <text x="28" y="33" fontSize="9.5" fontWeight={600} fill="#16302B">🇮🇳 NDMA Grid · {region.name}</text>
      </g>
    </svg>
  );
}

// ==========================================
// 🧭 SIDEBAR COMPONENT
// ==========================================
function SidebarInner({
  activeNav,
  setActiveNav,
  setSidebarOpen,
  onBack,
  currentRegion,
  setCurrentRegion,
}: {
  activeNav: string;
  setActiveNav: (v: string) => void;
  setSidebarOpen: (v: boolean) => void;
  onBack?: () => void;
  currentRegion: IndianRegion;
  setCurrentRegion: (r: IndianRegion) => void;
}) {
  return (
    <>
      <div className="relative px-5 pt-6 pb-4 border-b border-white/10 overflow-hidden">
        <div className="ss-contours absolute inset-0 pointer-events-none" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #C97A1E, #E0952F)" }}>
            <Icon name="shield" size={17} />
          </div>
          <div>
            <p className="ss-display text-white font-semibold text-[15px] leading-tight">SurakshaSetu</p>
            <p className="text-white/45 text-[11px] mt-0.5">National Disaster Grid · India</p>
          </div>
        </div>

        {/* Pan-India Region Selector in Sidebar */}
        <div className="relative mt-3.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">Select Jurisdiction</label>
          <select
            value={currentRegion.id}
            onChange={(e) => {
              const r = REGIONS.find((x) => x.id === e.target.value);
              if (r) setCurrentRegion(r);
            }}
            className="w-full bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/15 outline-none cursor-pointer"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.name}, {r.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 ss-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
              className={`ss-focus w-full flex items-center gap-3 px-3.5 py-2.5 mb-0.5 text-[13.5px] text-left rounded-lg transition-colors ${
                active ? "text-white" : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              }`}
              style={active ? { background: "rgba(201,122,30,0.18)", boxShadow: "inset 2px 0 0 #C97A1E" } : undefined}
            >
              <span className="w-5 flex justify-center flex-shrink-0"><Icon name={item.icon} size={17} /></span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Emergency Hotline */}
      <div className="px-4 py-4 border-t border-white/10">
        <a
          href="tel:112"
          className="ss-focus flex items-center justify-center gap-2 w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-md"
          style={{ background: "#B8271F" }}
        >
          <Icon name="phone" size={16} /> National Emergency 112
        </a>
        {onBack && (
          <button onClick={onBack} className="ss-focus mt-2.5 w-full text-[12px] text-white/40 hover:text-white/70 text-center py-1.5 transition-colors">
            ← Exit to Portal
          </button>
        )}
      </div>
    </>
  );
}

// ==========================================
// 🏠 MAIN COMPONENT
// ==========================================
interface Props {
  onBack?: () => void;
}

export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<IndianRegion>(REGIONS[0]);
  const [activeFilter, setActiveFilter] = useState("All");

  // State: Incident Report
  const [reportType, setReportType] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // State: Family Tracker
  const [family, setFamily] = useState([
    { id: 1, name: "Rajan (Father)", initials: "RK", status: "Safe", location: "Sector 4 Relief Camp", battery: "78%", lastSeen: "12 min ago" },
    { id: 2, name: "Suma (Mother)", initials: "SK", status: "Safe", location: "Sector 4 Relief Camp", battery: "92%", lastSeen: "12 min ago" },
    { id: 3, name: "Arjun (Brother)", initials: "AK", status: "Unknown", location: "Near District Market Area", battery: "24%", lastSeen: "1 hr ago" },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);

  // State: Survival Checklist
  const [survivalItems, setSurvivalItems] = useState([
    { id: 1, text: "3-day supply of drinking water (4L per person/day)", checked: true },
    { id: 2, text: "Non-perishable food (dry ration, glucose, nuts)", checked: true },
    { id: 3, text: "Battery-powered radio / NOAA receiver & extra batteries", checked: false },
    { id: 4, text: "Waterproof pouch with Aadhaar, Ration Card & Deeds", checked: true },
    { id: 5, text: "First-aid kit with antiseptic, ORS sachets & prescriptions", checked: false },
    { id: 6, text: "High-decibel whistle & emergency signaling torch", checked: false },
  ]);

  // State: Disaster Simulation Sandbox
  const [simType, setSimType] = useState<"Flood" | "Landslide" | "Cyclone">("Flood");
  const [rainfallMm, setRainfallMm] = useState<number>(140);
  const [isSimulating, setIsSimulating] = useState(false);

  // State: Floating AI Assistant
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; text: string; isBot: boolean; time: string }>>([
    {
      id: 1,
      text: "Namaste! 🙏 Main SurakshaSetu AI hoon. Bharat ke kisi bhi disaster zone ke safe shelters, relief routes, NDRF protocols ya family check-in ke baare me poochiye!",
      isBot: true,
      time: "Just now",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAiOpen) setTimeout(() => chatInputRef.current?.focus(), 150);
  }, [isAiOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  function getBotReply(t: string): string {
    const l = t.toLowerCase();
    if (l.includes("shelter") || l.includes("camp") || l.includes("safe place")) {
      return `${currentRegion.name} me ${currentRegion.sheltersCount} verified relief shelters active hain. Nearest: Govt. Higher Secondary School Shelter. Water & Medical on site available hai.`;
    }
    if (l.includes("route") || l.includes("evacuate") || l.includes("road")) {
      return `Evacuation notice for ${currentRegion.name}: National Highway connect stretch clear hai. Low-lying riverbeds aur vulnerable steep slopes avoid karein.`;
    }
    if (l.includes("weather") || l.includes("rain") || l.includes("alert")) {
      return `${currentRegion.name} bulletin: ${currentRegion.weatherCondition}. Alert level is currently ${currentRegion.alertLevel}. Follow SDMA broadcast.`;
    }
    if (l.includes("family") || l.includes("bhai") || l.includes("father")) {
      return "Aapke Family Safety tab me 2 members safe marked hain. Arjun ka battery low report hua hai. Emergency SOS bhejne ke liye 'My Family' tab use karein.";
    }
    if (l.includes("number") || l.includes("help") || l.includes("call")) {
      return "National Helplines:\n• All-India Emergency: 112\n• NDRF Disaster Control: 011-24363260\n• NDMA Toll-free: 1078\n• Ambulance Service: 108";
    }
    return `Kripya calm rahein aur unche sthan par sharan lein. ${currentRegion.state} Disaster Authority official advisory follow karein. Kisi bhi tatkal sahayata ke liye 112 call karein.`;
  }

  function sendChat(overrideText?: string) {
    const text = (overrideText ?? chatInput).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      text,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: reply, isBot: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      setIsTyping(false);
    }, 600);
  }

  function submitReport(e: FormEvent) {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3500);
    setReportType("");
    setReportDesc("");
  }

  function addFamilyMember(e: FormEvent) {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: `${newMemberName} (${newMemberRelation || "Relative"})`,
      initials: newMemberName.slice(0, 2).toUpperCase(),
      status: "Safe",
      location: `Registered in ${currentRegion.name}`,
      battery: "95%",
      lastSeen: "Just now",
    };
    setFamily((prev) => [...prev, newEntry]);
    setNewMemberName("");
    setNewMemberRelation("");
    setShowAddFamilyModal(false);
  }

  const sp = { activeNav, setActiveNav, setSidebarOpen, onBack, currentRegion, setCurrentRegion };

  return (
    <div className="ss-root relative flex h-screen overflow-hidden" style={{ background: "var(--paper)" }}>
      <style>{FONT_STYLES}</style>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full" style={{ background: "var(--ink)" }}>
        <SidebarInner {...sp} />
      </aside>

      {/* Sidebar Mobile Drawer */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col lg:hidden transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--ink)" }}
      >
        <SidebarInner {...sp} />
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto ss-scrollbar flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 px-5 py-3.5 flex items-center justify-between gap-3 shadow-xs" style={{ background: "var(--paper-raised)", borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <button className="ss-focus lg:hidden p-1.5 rounded text-[var(--ink)] hover:bg-black/5" onClick={() => setSidebarOpen(true)}>
              <Icon name="menu" size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="ss-display text-[17px] font-semibold leading-tight truncate">{activeNav}</h1>
              <p className="text-[12px] flex items-center gap-1.5" style={{ color: "var(--ink-60)" }}>
                <span>📍 {currentRegion.name}, {currentRegion.state}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>Pan-India Enabled</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full"
              style={{ color: "var(--teal-deep)", background: "var(--teal-tint)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
              Live Early Warning Network
            </span>
            <div className="w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
              RK
            </div>
          </div>
        </header>

        {/* Dynamic Nav View Rendering */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1">
          {/* =========================================================
              VIEW 1: SAFE PLACES
             ========================================================= */}
          {activeNav === "Safe Places" ? (
            <div className="space-y-5 ss-animate-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="ss-display text-2xl font-semibold">Designated Safe Shelters & Camps</h2>
                  <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                    Verified shelters under District Disaster Management Authority ({currentRegion.name}, {currentRegion.state})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}>
                    ✓ {currentRegion.sheltersCount} Verified Sites Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Government HSS Relief Centre", distance: "1.4 km", cap: "420 / 600", status: "Open", medical: true, food: true, water: true },
                  { name: "Community Centre & Civil Hall", distance: "2.8 km", cap: "180 / 300", status: "Open", medical: true, food: true, water: true },
                  { name: "Apex Multi-Purpose Cyclone/Flood Shelter", distance: "4.1 km", cap: "510 / 800", status: "Open", medical: true, food: true, water: true },
                  { name: "District Sports Indoor Complex", distance: "6.5 km", cap: "210 / 500", status: "Open", medical: false, food: true, water: true },
                  { name: "St. Thomas Relief Campus", distance: "7.9 km", cap: "290 / 400", status: "Open", medical: true, food: true, water: true },
                  { name: "State Polytechnic Annex Ward", distance: "9.2 km", cap: "310 / 450", status: "Open", medical: true, food: true, water: true },
                ].map((s) => (
                  <div key={s.name} className="rounded-xl p-5 flex flex-col justify-between" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[15px] leading-tight">{s.name}</h3>
                        <Badge level={s.status} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>📍 {s.distance} from your location</p>
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span style={{ color: "var(--ink-60)" }}>Occupancy</span>
                          <span className="font-semibold">{s.cap}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: "70%", background: "var(--teal)" }} />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 text-[11px]">
                        {s.medical && <span className="px-2 py-0.5 rounded" style={{ background: "var(--paper)" }}>🏥 Medical Unit</span>}
                        {s.food && <span className="px-2 py-0.5 rounded" style={{ background: "var(--paper)" }}>🍲 Cooked Food</span>}
                        {s.water && <span className="px-2 py-0.5 rounded" style={{ background: "var(--paper)" }}>💧 Potable Water</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Directions to ${s.name} initiated via GPS coordinates.`)}
                      className="ss-focus mt-4 w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: "var(--teal)" }}
                    >
                      Navigate to Shelter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeNav === "Alerts" ? (
            /* =========================================================
               VIEW 2: ALERTS (PAN-INDIA WARNING BULLETIN)
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="ss-display text-2xl font-semibold">Active Early Warnings & Dispatches</h2>
                  <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                    National Disaster Management Authority (NDMA) &amp; IMD Unified Alerts
                  </p>
                </div>
                <button
                  onClick={() => alert("Simulating Emergency Siren Alert Broadcast")}
                  className="ss-focus flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-xs"
                  style={{ background: "var(--danger)" }}
                >
                  <Icon name="volume" size={15} /> Play Siren Test
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    type: "Severe Flash Flood & Inundation Warning",
                    agency: "Central Water Commission (CWC) & IMD",
                    severity: "Critical",
                    zone: `${currentRegion.name}, ${currentRegion.state}`,
                    time: "14 mins ago",
                    desc: "Water levels rising above Danger Level (+1.8m). Low-lying residents instructed to proceed towards designated shelters immediately.",
                  },
                  {
                    type: "Steep Slope Landslide Threat",
                    agency: "Geological Survey of India (GSI)",
                    severity: "High",
                    zone: "Catchment sectors, Hill Slopes",
                    time: "48 mins ago",
                    desc: "Pore-pressure saturation reached 92%. NH link roads under surveillance. Heavy transport strictly suspended.",
                  },
                  {
                    type: "High-Velocity Squall & Power Grid Advisory",
                    agency: "State Disaster Management Authority (SDMA)",
                    severity: "Moderate",
                    zone: "District-wide electricity feeder lines",
                    time: "2 hours ago",
                    desc: "Sustained winds 55-70 km/h expected. Unanchored roof sheets and tree branches may cause interruptions.",
                  },
                  {
                    type: "General Public Precaution Advisory",
                    agency: "District Administration",
                    severity: "Low",
                    zone: "Urban Municipal Wards",
                    time: "4 hours ago",
                    desc: "Keep emergency torches charged and family documents in sealed waterproof pouches.",
                  },
                ].map((alert, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-5 transition-all"
                    style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--danger-tint)", color: "var(--danger)" }}>
                          <Icon name="warning" size={16} />
                        </span>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{alert.type}</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>Source: {alert.agency} · {alert.time}</p>
                        </div>
                      </div>
                      <Badge level={alert.severity} />
                    </div>
                    <p className="text-xs sm:text-sm mt-3 pl-10" style={{ color: "var(--ink-60)" }}>{alert.desc}</p>
                    <div className="mt-3.5 pl-10 flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded font-medium" style={{ background: "var(--paper)" }}>📍 {alert.zone}</span>
                      <button
                        onClick={() => window.alert("Protocol shared via WhatsApp/SMS to local contacts.")}
                        className="ss-focus text-xs font-semibold hover:underline"
                        style={{ color: "var(--teal)" }}
                      >
                        Share Alert Bulletin →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeNav === "Relocation" ? (
            /* =========================================================
               VIEW 3: RELOCATION & EVACUATION TRANSIT
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              <div>
                <h2 className="ss-display text-2xl font-semibold">Evacuation &amp; Transport Logistics</h2>
                <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                  NDRF and State Transport relief shuttle corridors for {currentRegion.name}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                    <h3 className="ss-display font-semibold text-base mb-3">Live Evacuation Transit Schedule</h3>
                    <div className="space-y-3">
                      {[
                        { busId: "Relief Bus #04", route: "Meppadi Market → Sultan Bathery HSS", eta: "Departs in 15 mins", seats: "18 seats left", status: "Boarding" },
                        { busId: "NDRF Shuttle #12", route: "River Ward Outpost → Apex Stadium Shelter", eta: "Departs in 35 mins", seats: "24 seats left", status: "En Route" },
                        { busId: "Relief Bus #09", route: "High School Junction → Civil Hall", eta: "Departs in 1 hr", seats: "32 seats left", status: "Scheduled" },
                      ].map((bus) => (
                        <div key={bus.busId} className="p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: "var(--paper)" }}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs" style={{ color: "var(--teal-deep)" }}>{bus.busId}</span>
                              <Badge level="Safe" />
                            </div>
                            <p className="text-xs font-medium mt-1">{bus.route}</p>
                            <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>{bus.eta} · {bus.seats}</p>
                          </div>
                          <button
                            onClick={() => alert(`Seat requested for ${bus.busId}. Your boarding SMS code will arrive shortly.`)}
                            className="ss-focus px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap"
                            style={{ background: "var(--teal)" }}
                          >
                            Reserve Transit Seat
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                    <h3 className="ss-display font-semibold text-base mb-2">Corridor Safety Status</h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}>
                        <span>🛣️ National Highway link (Sector A to East)</span>
                        <span className="font-bold">100% Clear &amp; Escorted</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded" style={{ background: "var(--danger-tint)", color: "var(--danger)" }}>
                        <span>⚠️ Valley Bypass Bridge (Sector C)</span>
                        <span className="font-bold">Submerged - Completely Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-5 flex flex-col justify-between" style={{ background: "var(--ink)", color: "#fff" }}>
                  <div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase" style={{ background: "rgba(201,122,30,0.3)", color: "#E0952F" }}>
                      Offline Evacuation Guide
                    </span>
                    <h3 className="ss-display font-semibold text-lg mt-3">Download Offline Evacuation Map</h3>
                    <p className="text-xs text-white/65 mt-2 leading-relaxed">
                      Mobile towers may lose power during severe cyclones and flash floods. Save the route directions directly to your device storage.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Offline Relief Corridor Map (.pdf) downloaded to your device.")}
                    className="ss-focus mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95"
                    style={{ background: "#C97A1E" }}
                  >
                    <Icon name="download" size={15} /> Save Offline Route Map
                  </button>
                </div>
              </div>
            </div>
          ) : activeNav === "My Family" ? (
            /* =========================================================
               VIEW 4: MY FAMILY (EMERGENCY CHECK-IN & TRACKER)
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="ss-display text-2xl font-semibold">Family Safety Roster</h2>
                  <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                    Real-time safety status and GPS check-ins for your registered household
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert("Safety confirmation broadcasted to District Control Room & Family SMS roster.")}
                    className="ss-focus px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-xs"
                    style={{ background: "var(--safe)" }}
                  >
                    ✓ I Am Safe (One-Tap Check-In)
                  </button>
                  <button
                    onClick={() => setShowAddFamilyModal(true)}
                    className="ss-focus px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-xs"
                    style={{ background: "var(--teal)" }}
                  >
                    + Add Member
                  </button>
                </div>
              </div>

              {/* Add Member Form Modal */}
              {showAddFamilyModal && (
                <div className="rounded-xl p-5 mb-4" style={{ background: "var(--paper-raised)", border: "2px solid var(--teal)" }}>
                  <h3 className="ss-display font-semibold text-sm mb-3">Register New Family Member</h3>
                  <form onSubmit={addFamilyMember} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Full Name (e.g. Sneha)"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="ss-focus flex-1 px-3 py-2 text-xs rounded-lg border"
                      style={{ borderColor: "var(--line)" }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Relation (e.g. Sister)"
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="ss-focus px-3 py-2 text-xs rounded-lg border"
                      style={{ borderColor: "var(--line)" }}
                    />
                    <button type="submit" className="ss-focus px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: "var(--teal)" }}>
                      Save Member
                    </button>
                    <button type="button" onClick={() => setShowAddFamilyModal(false)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {family.map((member) => (
                  <div key={member.id} className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center text-white" style={{ background: "var(--teal)" }}>
                          {member.initials}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{member.name}</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>Last Check-in: {member.lastSeen}</p>
                        </div>
                      </div>
                      <Badge level={member.status} />
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs space-y-1" style={{ borderColor: "var(--line)" }}>
                      <p className="flex justify-between">
                        <span style={{ color: "var(--ink-60)" }}>Location:</span>
                        <span className="font-medium truncate max-w-[170px]">{member.location}</span>
                      </p>
                      <p className="flex justify-between">
                        <span style={{ color: "var(--ink-60)" }}>Phone Battery:</span>
                        <span className="font-semibold">{member.battery}</span>
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => alert(`Pinging location of ${member.name}... GPS telemetry requested.`)}
                        className="ss-focus flex-1 py-1.5 text-xs font-medium rounded-lg border text-center hover:bg-slate-50"
                        style={{ borderColor: "var(--line)" }}
                      >
                        Ping Location
                      </button>
                      <button
                        onClick={() => alert(`Sending automated SMS alert to ${member.name}'s phone.`)}
                        className="ss-focus px-3 py-1.5 text-xs font-semibold rounded-lg text-white"
                        style={{ background: "var(--teal)" }}
                      >
                        Send Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeNav === "Resources" ? (
            /* =========================================================
               VIEW 5: RESOURCES & SURVIVAL KIT
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              <div>
                <h2 className="ss-display text-2xl font-semibold">Disaster Preparedness &amp; Survival Manuals</h2>
                <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                  Verified safety toolkits, emergency checklists, and national response guidelines
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Survival Kit Checklist */}
                <div className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="ss-display font-semibold text-base">Emergency Go-Bag Checklist</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}>
                      {survivalItems.filter((x) => x.checked).length} of {survivalItems.length} Packed
                    </span>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--ink-60)" }}>
                    Essential items every household in vulnerable flood/landslide zones must have ready in a sealed bag.
                  </p>
                  <div className="space-y-2.5">
                    {survivalItems.map((item) => (
                      <label key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-black/[0.02] transition-colors border" style={{ borderColor: "var(--line)" }}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {
                            setSurvivalItems((prev) =>
                              prev.map((x) => (x.id === item.id ? { ...x, checked: !x.checked } : x))
                            );
                          }}
                          className="mt-0.5 rounded text-teal-700 w-4 h-4 cursor-pointer"
                        />
                        <span className={`text-xs ${item.checked ? "line-through text-slate-400" : "font-medium"}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Guidelines Library */}
                <div className="space-y-4">
                  <div className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                    <h3 className="ss-display font-semibold text-base mb-3">National Disaster Guidelines</h3>
                    <div className="space-y-2.5">
                      {[
                        { title: "NDMA Standard Flood Safety Protocol", size: "1.8 MB PDF" },
                        { title: "Landslide Early Warning Signs & Escarpment Guide", size: "2.4 MB PDF" },
                        { title: "First-Aid for Waterborne Inundations & Snakebites", size: "950 KB PDF" },
                        { title: "Drinking Water Purification in Relief Camps", size: "640 KB PDF" },
                      ].map((doc) => (
                        <div key={doc.title} className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer" style={{ borderColor: "var(--line)" }}>
                          <div>
                            <p className="text-xs font-semibold">{doc.title}</p>
                            <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>{doc.size} · Official Ministry Documentation</p>
                          </div>
                          <button onClick={() => alert(`Downloading: ${doc.title}`)} className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--ink)", color: "#fff" }}>
                    <div>
                      <p className="font-semibold text-xs">Need an emergency volunteer team?</p>
                      <p className="text-[11px] text-white/50 mt-0.5">Civil Defence &amp; Aapda Mitra community volunteers</p>
                    </div>
                    <a href="tel:1078" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "var(--teal)" }}>
                      Call 1078
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === "Disaster Simulation" ? (
            /* =========================================================
               VIEW 6: DISASTER SIMULATION SANDBOX (TACTILE & CREATIVE)
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              <div>
                <h2 className="ss-display text-2xl font-semibold">Tactile Disaster Impact Simulator</h2>
                <p className="text-sm" style={{ color: "var(--ink-60)" }}>
                  Simulate local rainfall, flash-flood thresholds, and safe evacuation radii for {currentRegion.name}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <h3 className="ss-display font-semibold text-base">Simulation Parameters</h3>

                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color: "var(--ink-60)" }}>Select Hazard Model</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Flood", "Landslide", "Cyclone"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSimType(t)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            simType === t ? "text-white" : "hover:bg-slate-50"
                          }`}
                          style={simType === t ? { background: "var(--teal)", borderColor: "var(--teal)" } : { borderColor: "var(--line)" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Monsoon Rainfall Intensity</span>
                      <span className="font-bold" style={{ color: "var(--danger)" }}>{rainfallMm} mm/24h</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="320"
                      step="10"
                      value={rainfallMm}
                      onChange={(e) => setRainfallMm(Number(e.target.value))}
                      className="w-full cursor-pointer accent-teal-700"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>40 mm (Normal)</span>
                      <span>150 mm (Warning)</span>
                      <span>300+ mm (Extreme)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                    <button
                      onClick={() => {
                        setIsSimulating(true);
                        setTimeout(() => setIsSimulating(false), 800);
                      }}
                      className="ss-focus w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-md flex items-center justify-center gap-2"
                      style={{ background: "var(--teal)" }}
                    >
                      <Icon name="simulation" size={16} />
                      {isSimulating ? "Recalculating Models..." : "Run Hydrological Prediction"}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 rounded-xl p-5 flex flex-col justify-between" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                      <h3 className="ss-display font-semibold text-base">Predicted Impact Radius &amp; Casualties</h3>
                      <Badge level={rainfallMm > 200 ? "Critical" : rainfallMm > 110 ? "High" : "Moderate"} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <div className="p-3 rounded-lg" style={{ background: "var(--paper)" }}>
                        <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>Inundation Level</p>
                        <p className="text-xl font-bold mt-1 ss-num" style={{ color: "var(--danger)" }}>
                          +{(rainfallMm * 0.016).toFixed(1)} m
                        </p>
                        <p className="text-[10px] text-slate-500">Above road crest</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: "var(--paper)" }}>
                        <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>Exposed Population</p>
                        <p className="text-xl font-bold mt-1 ss-num">
                          {Math.round(rainfallMm * 14.5).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">Within 3 km contour</p>
                      </div>
                      <div className="p-3 rounded-lg col-span-2 sm:col-span-1" style={{ background: "var(--paper)" }}>
                        <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>Safe Transit Buffer</p>
                        <p className="text-xl font-bold mt-1 ss-num" style={{ color: "var(--safe)" }}>
                          {Math.max(15, 60 - Math.round(rainfallMm * 0.15))} mins
                        </p>
                        <p className="text-[10px] text-slate-500">Before road inundation</p>
                      </div>
                    </div>

                    <div className="mt-5 p-3.5 rounded-xl border" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                      <p className="text-xs font-semibold mb-1">🤖 AI Automated Safety Recommendation:</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--ink-60)" }}>
                        {rainfallMm > 200
                          ? `Extreme flood runoff imminent in ${currentRegion.name}. All valley routes must be evacuated within the next 20 minutes. Proceed towards Sultan Bathery Shelter.`
                          : rainfallMm > 110
                          ? `Moderate saturation threshold reached. Slopes over 30 degrees have a 68% slippage probability. Avoid underpasses and river bridges.`
                          : `Normal monsoon capacity. Drains are currently running at safe velocity. Continue monitoring IMD bulletins.`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--line)" }}>
                    <span style={{ color: "var(--ink-40)" }}>Model: NDMA Indian Hydro-Morphology v4.2</span>
                    <button
                      onClick={() => alert("Simulation report generated and sent to offline logs.")}
                      className="font-semibold hover:underline"
                      style={{ color: "var(--teal)" }}
                    >
                      Export Model Report →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === "Settings" ? (
            /* =========================================================
               VIEW 7: SETTINGS
               ========================================================= */
            <div className="max-w-2xl mx-auto rounded-xl p-6 ss-animate-in" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <h2 className="ss-display text-lg font-semibold mb-1">Preferences &amp; Pan-India Configuration</h2>
              <p className="text-sm mb-6" style={{ color: "var(--ink-60)" }}>Customize emergency notifications and regional protocols</p>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <p className="text-sm font-semibold">Disaster Alert Cell Broadcast</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Receive high-priority audio sirens during red alerts.</p>
                  </div>
                  <button className="ss-focus text-white px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--teal)" }}>ON</button>
                </div>
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <p className="text-sm font-semibold">Offline Map Caching</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Store topography and evacuation roads locally.</p>
                  </div>
                  <button className="ss-focus text-white px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--teal)" }}>ON</button>
                </div>
                <div>
                  <label className="text-sm font-semibold">Language / भाषा / ഭാഷ</label>
                  <select className="ss-focus mt-2 w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--line)" }}>
                    <option>English (India)</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Malayalam (മലയാളം)</option>
                    <option>Odia (ଓଡ଼ିଆ)</option>
                    <option>Bengali (বাংলা)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================
               VIEW 8: DEFAULT DASHBOARD
               ========================================================= */
            <div className="space-y-5 ss-animate-in">
              {/* Top Status Strip */}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x lg:divide-y-0" style={{ borderColor: "var(--line)" }}>
                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Safety Status</p>
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}>
                        <Icon name="shield" size={18} />
                      </span>
                      <div>
                        <p className="ss-display text-lg font-semibold leading-none">Safe</p>
                        <p className="text-[11px] mt-1" style={{ color: "var(--ink-40)" }}>verified just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Active Region</p>
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}>
                        <Icon name="pin" size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-none">{currentRegion.name}</p>
                        <p className="text-[11px] mt-1" style={{ color: "var(--ink-40)" }}>{currentRegion.state}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Weather Report</p>
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}>
                        <Icon name="droplet" size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-none truncate">{currentRegion.weatherCondition}</p>
                        <p className="text-[11px] mt-1 font-medium" style={{ color: "var(--amber)" }}>NDMA Advisory</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4" style={{ background: "var(--danger-tint)" }}>
                    <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#8C1B15" }}>Threat Level</p>
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#F6D9D5", color: "var(--danger)" }}>
                        <Icon name="warning" size={18} />
                      </span>
                      <div>
                        <p className="ss-display text-lg font-semibold leading-none" style={{ color: "var(--danger)" }}>{currentRegion.alertLevel}</p>
                        <p className="text-[11px] mt-1" style={{ color: "#8C1B15" }}>{currentRegion.hazardType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Hazard & Safety Map */}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between flex-wrap gap-2.5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">Live Hazard &amp; Safety Map ({currentRegion.name})</h2>
                  <div className="flex gap-1.5 flex-wrap">
                    {["All", "Hazards", "Safe Sites", "Shelters", "Hospitals"].map((f) => {
                      const on = activeFilter === f;
                      return (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className="ss-focus text-[11.5px] px-3 py-1 rounded-full font-medium transition-colors"
                          style={on ? { background: "var(--teal)", color: "#fff" } : { background: "transparent", color: "var(--ink-60)", border: "1px solid var(--line)" }}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
                    <HazardMap filter={activeFilter} region={currentRegion} />
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[11px]" style={{ color: "var(--ink-60)" }}>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />Red zone</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--safe)" }} />Relief Shelter</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--teal)" }} />Your point</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 border-t border-dashed" style={{ borderColor: "var(--teal)" }} />Evacuation route</span>
                  </div>
                </div>
              </div>

              {/* Incident Reporting & Family Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <div className="px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
                    <h2 className="ss-display text-[14.5px] font-semibold">Report Incident to District Control</h2>
                  </div>
                  <form onSubmit={submitReport} className="p-4 sm:p-5 space-y-3.5">
                    {reportSubmitted && (
                      <div className="text-[12.5px] rounded-lg px-3 py-2" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}>
                        ✓ Incident report logged into National Disaster Response Database.
                      </div>
                    )}
                    <div>
                      <label className="text-[12px] font-medium mb-1.5 block" style={{ color: "var(--ink-60)" }}>Incident Type</label>
                      <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="ss-focus w-full rounded-lg px-3 py-2 text-xs" style={{ border: "1px solid var(--line)" }} required>
                        <option value="">Select hazard type</option>
                        <option>Flash Flood / Inundation</option>
                        <option>Landslide / Mudslip</option>
                        <option>Road Blocked / Fallen Tree</option>
                        <option>Missing Person Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[12px] font-medium mb-1.5 block" style={{ color: "var(--ink-60)" }}>Location &amp; Observation Details</label>
                      <textarea
                        value={reportDesc}
                        onChange={(e) => setReportDesc(e.target.value)}
                        rows={3}
                        placeholder="Describe severity, approximate landmark, and people affected"
                        className="ss-focus w-full rounded-lg px-3 py-2 text-xs resize-none"
                        style={{ border: "1px solid var(--line)" }}
                        required
                      />
                    </div>
                    <button type="submit" className="ss-focus w-full text-white font-semibold text-xs py-2.5 rounded-lg" style={{ background: "var(--danger)" }}>
                      Transmit Incident to NDRF / SDMA
                    </button>
                  </form>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
                    <h2 className="ss-display text-[14.5px] font-semibold">Family Safety Summary</h2>
                    <button onClick={() => setActiveNav("My Family")} className="ss-focus text-xs font-semibold" style={{ color: "var(--teal)" }}>
                      View All ({family.length}) →
                    </button>
                  </div>
                  <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
                    {family.slice(0, 3).map((f) => (
                      <li key={f.id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center text-white flex-shrink-0" style={{ background: "var(--teal)" }}>
                            {f.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{f.name}</p>
                            <p className="text-[11px]" style={{ color: "var(--ink-40)" }}>{f.location}</p>
                          </div>
                        </div>
                        <Badge level={f.status} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-slate-50 border-t" style={{ borderColor: "var(--line)" }}>
                    <button
                      onClick={() => setActiveNav("Disaster Simulation")}
                      className="ss-focus w-full py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 hover:bg-white transition-colors"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <Icon name="simulation" size={14} /> Open Impact Simulator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-10" />
      </main>

      {/* ========================================================================= */}
      {/* 🤖 GLOBAL FLOATING CIRCULAR AI ASSISTANT (RIGHT BOTTOM CORNER)            */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {/* Floating Chat Popup Window */}
        {isAiOpen && (
          <div
            style={{
              width: 380,
              maxWidth: "calc(100vw - 32px)",
              height: 520,
              maxHeight: "calc(100vh - 120px)",
              boxShadow: "0 25px 50px -12px rgba(15,31,28,0.35)",
            }}
            className="mb-4 rounded-2xl border flex flex-col overflow-hidden ss-animate-in"
          >
            {/* Header */}
            <div className="p-4 text-white flex items-center justify-between" style={{ background: "linear-gradient(120deg, #0E6B62, #0A4F48)" }}>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  <Icon name="bot" size={19} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "#C97A1E", boxShadow: "0 0 0 2px #0A4F48" }} />
                </div>
                <div>
                  <h3 className="ss-display font-semibold text-[13.5px] leading-tight">SurakshaSetu AI</h3>
                  <p className="text-[10.5px] text-white/70 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C97A1E" }} />
                    Pan-India 24/7 Disaster Support
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="ss-focus w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Message Roster */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 ss-scrollbar" style={{ background: "var(--paper)" }}>
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isBot ? "items-start" : "items-end"}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.isBot ? "flex-row" : "flex-row-reverse"}`}>
                    {m.isBot && (
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}>
                        <Icon name="bot" size={14} />
                      </div>
                    )}
                    <div
                      className="px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed whitespace-pre-line"
                      style={
                        m.isBot
                          ? { background: "var(--paper-raised)", color: "var(--ink)", border: "1px solid var(--line)", borderTopLeftRadius: 4 }
                          : { background: "var(--teal)", color: "#fff", fontWeight: 500, borderTopRightRadius: 4 }
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                  <span className="text-[10px] mt-1 px-1" style={{ color: "var(--ink-40)" }}>{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}>
                    <Icon name="bot" size={14} />
                  </div>
                  <div className="px-3 py-2 rounded-2xl flex items-center gap-1.5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)", borderTopLeftRadius: 4 }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: "var(--teal)" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: "var(--teal)" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--teal)" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto ss-scrollbar" style={{ background: "var(--paper-raised)", borderTop: "1px solid var(--line)" }}>
              {["Nearest shelter", "Evacuation route", "Helpline numbers"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendChat(chip)}
                  className="ss-focus text-[11px] whitespace-nowrap px-2.5 py-1.5 rounded-full font-medium transition-colors"
                  style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 flex items-center gap-2" style={{ background: "var(--paper-raised)", borderTop: "1px solid var(--line)" }}>
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask NDMA protocols, safe routes..."
                className="ss-focus flex-1 rounded-xl px-3.5 py-2.5 text-[12.5px] placeholder:text-[var(--ink-40)]"
                style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
              />
              <button
                onClick={() => sendChat()}
                disabled={!chatInput.trim()}
                className="ss-focus w-9 h-9 rounded-xl text-white flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-35"
                style={{ background: "var(--teal)" }}
              >
                <Icon name="send" size={15} />
              </button>
            </div>
          </div>
        )}

        {/* 🔵 THE FLOATING CIRCLE AI BUTTON */}
        <button
          onClick={() => setIsAiOpen((prev) => !prev)}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0E6B62, #0A4F48)",
            boxShadow: "0 10px 25px rgba(14,107,98,0.45)",
          }}
          className="ss-focus ss-beacon relative text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white"
          title={isAiOpen ? "Close AI Assistant" : "Open AI Assistant"}
          aria-label="AI Assistant"
        >
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full" style={{ background: "#C97A1E", boxShadow: "0 0 0 2px #0A4F48" }} />
          {isAiOpen ? <Icon name="close" size={23} /> : <Icon name="bot" size={26} />}
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
