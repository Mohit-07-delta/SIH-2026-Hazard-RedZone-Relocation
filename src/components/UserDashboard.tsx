import { useState, useRef, useEffect, type FC, type ReactNode, type FormEvent } from "react";

// ==========================================================================
// SurakshaSetu — resident dashboard
// Visual identity: "beacon to safety" — deep forest-teal ink, warm signal-amber
// accent, terrain contour motifs (grounded in the hazard-mapping subject).
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
  .ss-root .ss-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
  .ss-root .ss-num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }

  .ss-contours {
    background-image:
      radial-gradient(circle at 15% 20%, rgba(255,255,255,0.05) 0, transparent 45%),
      repeating-radial-gradient(circle at 80% 110%, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 14px);
  }

  .ss-beacon {
    box-shadow: 0 0 0 0 rgba(201, 122, 30, 0.55);
    animation: ss-beacon-pulse 2.6s ease-out 1;
  }
  @keyframes ss-beacon-pulse {
    0% { box-shadow: 0 0 0 0 rgba(201, 122, 30, 0.5); }
    70% { box-shadow: 0 0 0 14px rgba(201, 122, 30, 0); }
    100% { box-shadow: 0 0 0 0 rgba(201, 122, 30, 0); }
  }

  .ss-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .ss-scrollbar::-webkit-scrollbar-thumb { background: #C9C3AF; border-radius: 4px; }
  .ss-scrollbar::-webkit-scrollbar-track { background: transparent; }

  .ss-focus:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ss-beacon, .ss-pulse-dot { animation: none !important; }
  }
`;

// ==========================================
// ICONS
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
  };
  return <svg {...c}>{p[name] ?? p.settings}</svg>;
};

interface Props { onBack?: () => void; }
interface AlertItem { type: string; severity: "High" | "Moderate" | "Low"; distance: string; time: string; icon: string; }
interface Settlement { name: string; exposed: number; risk: "Critical" | "High" | "Moderate"; }
interface FamilyMember { name: string; initials: string; status: "Safe" | "Unknown"; location: string; }
interface ChatMessage { id: number; text: string; isBot: boolean; time: string; }

const ALERTS: AlertItem[] = [
  { type: "Landslide", severity: "High", distance: "2.4 km", time: "10 min ago", icon: "warning" },
  { type: "Flash Flood", severity: "Moderate", distance: "5.1 km", time: "32 min ago", icon: "droplet" },
  { type: "Rockfall", severity: "Low", distance: "8.7 km", time: "1 hr ago", icon: "shield" },
];
const SETTLEMENTS: Settlement[] = [
  { name: "Mundakkai Colony", exposed: 312, risk: "Critical" },
  { name: "Chooralmala Village", exposed: 480, risk: "Critical" },
  { name: "Attamala Ward", exposed: 215, risk: "High" },
  { name: "Puthumala Hill Area", exposed: 178, risk: "High" },
];
const FAMILY: FamilyMember[] = [
  { name: "Rajan (Father)", initials: "RK", status: "Safe", location: "Meppadi Relief Camp" },
  { name: "Suma (Mother)", initials: "SK", status: "Safe", location: "Meppadi Relief Camp" },
  { name: "Arjun (Brother)", initials: "AK", status: "Unknown", location: "Last seen Chooralmala" },
];
const ROUTE_STOPS = [
  { label: "Meppadi", sub: "Starting point", state: "done" as const },
  { label: "NH-766", sub: "18 km · clear stretch", state: "done" as const },
  { label: "Mundakkai–Chooralmala Rd", sub: "Active landslide · avoided", state: "danger" as const },
  { label: "Sultan Bathery Govt. HSS", sub: "Est. 35 min · destination", state: "target" as const },
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

const MAP_FILTERS = ["All", "Hazards", "Safe Sites", "Shelters", "Hospitals"];
const RESOURCES = [
  { icon: "report", label: "NDMA Evacuation Guidelines" },
  { icon: "map", label: "Wayanad District Hazard Map" },
  { icon: "shield", label: "Nearby Medical Facilities" },
  { icon: "phone", label: "Emergency Contact Directory" },
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
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ color: s.text, background: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {level}
    </span>
  );
}

// ==========================================
// ILLUSTRATED HAZARD MAP (no external map lib)
// ==========================================
function HazardMap({ filter }: { filter: string }) {
  const showHazards = filter === "All" || filter === "Hazards";
  const showShelters = filter === "All" || filter === "Shelters" || filter === "Safe Sites";
  const showHospitals = filter === "All" || filter === "Hospitals";

  return (
    <svg viewBox="0 0 720 320" className="w-full h-full" role="img" aria-label="Illustrated hazard map of Wayanad district">
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

      {/* contour lines — terrain of the Western Ghats */}
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

      {/* river / backwater ribbon */}
      <path d="M 30 260 C 160 230, 210 280, 340 250 S 560 200, 700 235" fill="none" stroke="#0E6B62" strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />

      {/* hazard red-zone */}
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
          <text x="252" y="132" textAnchor="middle" fontSize="11" fontWeight={700} fill="#8C1B15">Mundakkai</text>
          <text x="252" y="146" textAnchor="middle" fontSize="9" fill="#8C1B15" fillOpacity={0.85}>Landslide red-zone</text>
        </g>
      )}

      {/* evacuation route */}
      <path
        d="M 300 168 C 360 190, 420 176, 470 190 C 530 206, 580 190, 616 168"
        fill="none"
        stroke="#0E6B62"
        strokeWidth="3"
        strokeDasharray="1 9"
        strokeLinecap="round"
      />

      {/* you-are-here marker */}
      <g transform="translate(300 168)">
        <circle r="9" fill="#0E6B62" fillOpacity="0.18" />
        <circle r="4.5" fill="#0E6B62" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
      <text x="300" y="192" textAnchor="middle" fontSize="9.5" fontWeight={600} fill="#16302B">Meppadi</text>

      {/* shelters */}
      {showShelters && (
        <g fill="#34724A">
          <g transform="translate(616 168)">
            <path d="M0 -11 C6 -11 10 -6 10 0 C10 7 4 12 0 16 C-4 12 -10 7 -10 0 C-10 -6 -6 -11 0 -11Z" />
            <circle r="3" fill="#fff" />
          </g>
          <text x="616" y="196" textAnchor="middle" fontSize="9.5" fontWeight={600} fill="#16302B">Sultan Bathery HSS</text>

          <g transform="translate(470 96)">
            <path d="M0 -9 C5 -9 8 -5 8 0 C8 6 3 10 0 13 C-3 10 -8 6 -8 0 C-8 -5 -5 -9 0 -9Z" />
            <circle r="2.4" fill="#fff" />
          </g>
          <text x="470" y="118" textAnchor="middle" fontSize="8.5" fill="#16302B" fillOpacity={0.75}>Kalpetta Shelter</text>
        </g>
      )}

      {/* hospital marker */}
      {showHospitals && (
        <g transform="translate(430 232)">
          <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#B8271F" />
          <path d="M0 -4.5 V4.5 M-4.5 0 H4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <text x="0" y="24" textAnchor="middle" fontSize="8.5" fill="#16302B" fillOpacity={0.75}>District Hospital</text>
        </g>
      )}

      <g opacity="0.55">
        <rect x="18" y="18" width="120" height="20" rx="10" fill="#0F1F1C" fillOpacity="0.06" />
        <text x="30" y="32" fontSize="9.5" fontWeight={600} fill="#16302B">Wayanad District</text>
      </g>
    </svg>
  );
}

function SidebarInner({ activeNav, setActiveNav, setSidebarOpen, onBack }: {
  activeNav: string; setActiveNav: (v: string) => void; setSidebarOpen: (v: boolean) => void; onBack?: () => void;
}) {
  return (
    <>
      <div className="relative px-5 pt-6 pb-5 border-b border-white/10 overflow-hidden">
        <div className="ss-contours absolute inset-0 pointer-events-none" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C97A1E, #E0952F)" }}>
            <Icon name="shield" size={17} />
          </div>
          <div>
            <p className="ss-display text-white font-semibold text-[15px] leading-tight">SurakshaSetu</p>
            <p className="text-white/45 text-[11px] mt-0.5">Wayanad, Kerala</p>
          </div>
        </div>
      </div>
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
      <div className="px-4 py-4 border-t border-white/10">
        <a href="tel:112" className="ss-focus flex items-center justify-center gap-2 w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-colors" style={{ background: "#B8271F" }}>
          <Icon name="phone" size={16} /> Emergency 112
        </a>
        {onBack && (
          <button onClick={onBack} className="ss-focus mt-2.5 w-full text-[12px] text-white/40 hover:text-white/70 text-center py-1.5 transition-colors">
            Back to Home
          </button>
        )}
      </div>
    </>
  );
}

export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [reportType, setReportType] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Namaste! 🙏 Main SurakshaSetu AI assistant hoon. Wayanad safe shelters, evacuation routes ya weather alert ke baare me poochiye!",
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
    if (l.includes("shelter") || l.includes("safe") || l.includes("place")) {
      return "Wayanad me 14 shelters active hain:\n• Meppadi Relief Shelter (1.8 km)\n• Sultan Bathery Govt. School (18 km, capacity 800)";
    }
    if (l.includes("route") || l.includes("evacuate") || l.includes("road")) {
      return "Evacuation ke liye NH-766 towards Sultan Bathery bilkul clear hai. Mundakkai-Chooralmala road avoid karein.";
    }
    if (l.includes("weather") || l.includes("rain")) {
      return "IMD Orange alert active hai. Agle 48 ghante me heavy rainfall expected hai. Slopes aur nadiyo se door rahein.";
    }
    if (l.includes("family")) {
      return "Family Status: Rajan & Suma safe hain Meppadi Relief Camp me. Arjun ki location check ki ja rahi hai.";
    }
    return "Surakshit sthan par rahein. Kisi bhi emergency mein 112 ya Ambulance ke liye 108 dial karein.";
  }

  function sendChat(overrideText?: string) {
    const text = (overrideText ?? chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
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
    setTimeout(() => setReportSubmitted(false), 3000);
    setReportType("");
    setReportDesc("");
  }

  const sp = { activeNav, setActiveNav, setSidebarOpen, onBack };

  return (
    <div className="ss-root relative flex h-screen overflow-hidden" style={{ background: "var(--paper)" }}>
      <style>{FONT_STYLES}</style>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full" style={{ background: "var(--ink)" }}>
        <SidebarInner {...sp} />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col lg:hidden transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--ink)" }}
      >
        <SidebarInner {...sp} />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto ss-scrollbar">
        <header className="sticky top-0 z-20 px-5 py-3.5 flex items-center gap-3" style={{ background: "var(--paper-raised)", borderBottom: "1px solid var(--line)" }}>
          <button className="ss-focus lg:hidden p-1.5 rounded text-[var(--ink)] hover:bg-black/5" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="ss-display text-[17px] font-semibold leading-tight truncate">{activeNav}</h1>
            <p className="text-[12px]" style={{ color: "var(--ink-60)" }}>Wayanad District, Kerala</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="hidden sm:flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full"
              style={{ color: "var(--teal-deep)", background: "var(--teal-tint)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full ss-pulse-dot" style={{ background: "var(--teal)", animation: "ss-beacon-pulse 2.2s ease-in-out infinite" }} />
              Live
            </span>
            <div className="w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
              RK
            </div>
          </div>
        </header>

        {activeNav === "Settings" ? (
          <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            <div className="rounded-xl p-6" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <h2 className="ss-display text-lg font-semibold mb-1">Settings</h2>
              <p className="text-sm mb-6" style={{ color: "var(--ink-60)" }}>Manage your SurakshaSetu preferences</p>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <p className="text-sm font-semibold">Emergency Notifications</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Receive alerts about nearby hazards.</p>
                  </div>
                  <button className="ss-focus text-white px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--teal)" }}>ON</button>
                </div>
                <div>
                  <label className="text-sm font-semibold">Language</label>
                  <select className="ss-focus mt-2 w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--line)" }}>
                    <option>English</option><option>Hindi</option><option>Malayalam</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === "Safe Places" ? (
          <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
            <h2 className="ss-display text-2xl font-semibold">Safe Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ n: "Meppadi Relief Shelter", d: "1.8 km away" }, { n: "Government High School Shelter", d: "3.2 km away" }].map((x) => (
                <div key={x.n} className="rounded-xl p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                  <h3 className="font-semibold">{x.n}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--ink-60)" }}>{x.d}</p>
                  <div className="mt-3"><Badge level="Safe" /></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">

            {/* Status strip — deliberately not four identical cards */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x lg:divide-y-0" style={{ borderColor: "var(--line)" }}>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Your safety status</p>
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}><Icon name="shield" size={18} /></span>
                    <div>
                      <p className="ss-display text-lg font-semibold leading-none">Safe</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--ink-40)" }}>verified 5 min ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Current location</p>
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}><Icon name="pin" size={18} /></span>
                    <div>
                      <p className="text-sm font-semibold leading-none">Meppadi</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--ink-40)" }}>Wayanad, Kerala</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--ink-40)" }}>Weather</p>
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}><Icon name="droplet" size={18} /></span>
                    <div>
                      <p className="text-sm font-semibold leading-none">Heavy rain</p>
                      <p className="text-[11px] mt-1 font-medium" style={{ color: "var(--amber)" }}>IMD Orange Alert</p>
                    </div>
                  </div>
                </div>
                <div className="p-4" style={{ background: "var(--danger-tint)" }}>
                  <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#8C1B15" }}>Risk level</p>
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#F6D9D5", color: "var(--danger)" }}><Icon name="warning" size={18} /></span>
                    <div>
                      <p className="ss-display text-lg font-semibold leading-none" style={{ color: "var(--danger)" }}>High</p>
                      <p className="text-[11px] mt-1" style={{ color: "#8C1B15" }}>Landslide zone nearby</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
                <h2 className="ss-display text-[14.5px] font-semibold">Active Alerts</h2>
                <button onClick={() => setActiveNav("Alerts")} className="ss-focus text-xs font-medium" style={{ color: "var(--teal-deep)" }}>View all</button>
              </div>
              <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
                {ALERTS.map((a, i) => {
                  const s = SEVERITY_STYLE[a.severity];
                  return (
                    <li key={i} className="flex items-center gap-3 px-4 sm:px-5 py-3" style={{ borderLeft: `3px solid ${s.dot}` }}>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.text }}>
                        <Icon name={a.icon} size={15} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.type}</p>
                        <p className="ss-num text-[11.5px]" style={{ color: "var(--ink-40)" }}>{a.distance} · {a.time}</p>
                      </div>
                      <Badge level={a.severity} />
                      <button className="ss-focus text-xs font-medium hidden sm:block" style={{ color: "var(--teal-deep)" }}>View</button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Illustrated hazard map */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between flex-wrap gap-2.5" style={{ borderBottom: "1px solid var(--line)" }}>
                <h2 className="ss-display text-[14.5px] font-semibold">Live Hazard &amp; Safety Map</h2>
                <div className="flex gap-1.5 flex-wrap">
                  {MAP_FILTERS.map((f) => {
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
                  <HazardMap filter={activeFilter} />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[11px]" style={{ color: "var(--ink-60)" }}>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />Red zone</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--safe)" }} />Shelter</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "var(--teal)" }} />You are here</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 border-t border-dashed" style={{ borderColor: "var(--teal)" }} />Evacuation route</span>
                </div>
              </div>
            </div>

            {/* Settlements + Relocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">High-Risk Settlements</h2>
                </div>
                <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
                  {SETTLEMENTS.map((s, i) => (
                    <li key={i} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--paper)", color: "var(--ink-60)" }}>
                          <Icon name="users" size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{s.name}</p>
                          <p className="ss-num text-[11.5px]" style={{ color: "var(--ink-40)" }}>{s.exposed.toLocaleString()} residents</p>
                        </div>
                      </div>
                      <Badge level={s.risk} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--ink)", color: "#fff" }}>
                <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">Recommended Relocation Site</h2>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(52,114,74,0.28)", color: "#8FD3A6" }}>Open</span>
                </div>
                <div className="p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="ss-display text-[15px] font-semibold">Sultan Bathery Govt. HSS</p>
                    <p className="text-[12px] text-white/50">18 km away</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px] text-white/55 mb-1.5">
                      <span>Capacity</span><span className="ss-num">520 / 800</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.12)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: "65%", background: "#C97A1E" }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-[12px]">
                    {[
                      { l: "Food", v: "Available", ok: true, icon: "utensils" },
                      { l: "Medical", v: "On-site", ok: true, icon: "cross" },
                      { l: "Water", v: "Available", ok: true, icon: "droplet" },
                      { l: "Transport", v: "Limited", ok: false, icon: "truck" },
                    ].map((x) => (
                      <div key={x.l} className="rounded-lg p-2.5 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <span style={{ color: x.ok ? "#8FD3A6" : "#E5B072" }}><Icon name={x.icon} size={14} /></span>
                        <div>
                          <p className="text-white/45 text-[10.5px] leading-none">{x.l}</p>
                          <p className="font-semibold mt-0.5" style={{ color: x.ok ? "#8FD3A6" : "#E5B072" }}>{x.v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Route timeline — genuinely sequential, so numbering/line is justified */}
            <div className="rounded-xl p-4 sm:p-5" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="ss-display text-[14.5px] font-semibold">Safe Relocation Route</h2>
                <div className="flex items-center gap-3">
                  <button className="ss-focus text-white text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--teal)" }}>Get Directions</button>
                  <button className="ss-focus text-[12.5px] font-medium" style={{ color: "var(--teal-deep)" }}>Alternative route</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-0">
                {ROUTE_STOPS.map((stop, i) => (
                  <div key={stop.label} className="flex sm:flex-col items-start sm:items-stretch gap-3 sm:flex-1 relative">
                    <div className="flex sm:flex-col items-center sm:w-full">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 z-10"
                        style={{
                          background: stop.state === "danger" ? "var(--danger)" : stop.state === "target" ? "var(--teal)" : "var(--ink-40)",
                        }}
                      />
                      {i < ROUTE_STOPS.length - 1 && (
                        <span className="hidden sm:block flex-1 h-px w-full mt-1.5" style={{ background: "var(--line)" }} />
                      )}
                      {i < ROUTE_STOPS.length - 1 && (
                        <span className="sm:hidden w-px flex-1 self-stretch mx-[5.5px]" style={{ background: "var(--line)", minHeight: "20px" }} />
                      )}
                    </div>
                    <div className="pb-4 sm:pb-0 sm:mt-2.5">
                      <p className="text-[13px] font-semibold">{stop.label}</p>
                      <p className="text-[11.5px]" style={{ color: stop.state === "danger" ? "var(--danger)" : "var(--ink-40)" }}>{stop.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Incident + My Family */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">Report an Incident</h2>
                </div>
                <form onSubmit={submitReport} className="p-4 sm:p-5 space-y-3.5">
                  {reportSubmitted && (
                    <div className="text-[12.5px] rounded-lg px-3 py-2" style={{ background: "var(--safe-tint)", color: "var(--safe)" }}>
                      Report submitted — thank you for keeping the district informed.
                    </div>
                  )}
                  <div>
                    <label className="text-[12px] font-medium mb-1.5 block" style={{ color: "var(--ink-60)" }}>Incident type</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="ss-focus w-full rounded-lg px-3 py-2.5 text-sm" style={{ border: "1px solid var(--line)" }} required>
                      <option value="">Select type</option>
                      <option>Landslide</option><option>Flash Flood</option><option>Road Blocked</option><option>Person Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium mb-1.5 block" style={{ color: "var(--ink-60)" }}>Description</label>
                    <textarea
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                      rows={3}
                      placeholder="Describe what you observed"
                      className="ss-focus w-full rounded-lg px-3 py-2.5 text-sm resize-none"
                      style={{ border: "1px solid var(--line)" }}
                      required
                    />
                  </div>
                  <button type="submit" className="ss-focus w-full text-white font-semibold text-sm py-2.5 rounded-lg" style={{ background: "var(--danger)" }}>
                    Submit Report
                  </button>
                </form>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">My Family</h2>
                  <button className="ss-focus text-xs font-medium" style={{ color: "var(--teal-deep)" }}>+ Add</button>
                </div>
                <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
                  {FAMILY.map((f, i) => (
                    <li key={i} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center" style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}>
                          {f.initials}
                        </div>
                        <span
                          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                          style={{ borderColor: "var(--paper-raised)", background: f.status === "Safe" ? "var(--safe)" : "var(--amber)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-[11.5px] truncate" style={{ color: "var(--ink-40)" }}>{f.location}</p>
                      </div>
                      <Badge level={f.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resources + Emergency Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--paper-raised)", border: "1px solid var(--line)" }}>
                <div className="px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2 className="ss-display text-[14.5px] font-semibold">Resources</h2>
                </div>
                <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
                  {RESOURCES.map((r, i) => (
                    <li key={i}>
                      <button className="ss-focus w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-black/[0.02] text-left transition-colors">
                        <span style={{ color: "var(--teal-deep)" }}><Icon name={r.icon} size={17} /></span>
                        <span className="text-sm font-medium">{r.label}</span>
                        <span className="ml-auto" style={{ color: "var(--ink-40)" }}>→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl p-4 sm:p-5 flex flex-col justify-between" style={{ background: "var(--ink)" }}>
                <div>
                  <p className="text-[11.5px] font-semibold text-white/45 mb-3">Emergency Contacts</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { l: "Police 112", h: "tel:112" },
                      { l: "NDMA", h: "tel:18001807188" },
                      { l: "SDMA Kerala", h: "tel:1070" },
                      { l: "NDRF", h: "tel:01124363260" },
                      { l: "Ambulance 108", h: "tel:108" },
                    ].map((x) => (
                      <a
                        key={x.l}
                        href={x.h}
                        className="ss-focus flex items-center gap-1.5 text-white text-[12px] font-medium px-3 py-2 rounded-full transition-colors"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <Icon name="phone" size={12} /> {x.l}
                      </a>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-white/35 mt-4">24/7 toll-free disaster management helpline.</p>
              </div>
            </div>

            <div className="h-4" />
          </div>
        )}
      </main>

      {/* Floating AI assistant */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999999, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {isAiOpen && (
          <div
            style={{ width: 380, maxWidth: "calc(100vw - 32px)", height: 520, maxHeight: "calc(100vh - 120px)", boxShadow: "0 25px 50px -12px rgba(15,31,28,0.35)" }}
            className="mb-4 rounded-2xl border flex flex-col overflow-hidden"
          >
            <div className="p-4 text-white flex items-center justify-between" style={{ background: "linear-gradient(120deg, #0E6B62, #0A4F48)" }}>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon name="bot" size={19} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "#C97A1E", boxShadow: "0 0 0 2px #0A4F48" }} />
                </div>
                <div>
                  <h3 className="ss-display font-semibold text-[13.5px] leading-tight">SurakshaSetu AI</h3>
                  <p className="text-[10.5px] text-white/70 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C97A1E" }} />
                    Online · 24/7 disaster support
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="ss-focus w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon name="close" size={16} />
              </button>
            </div>

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

            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto ss-scrollbar" style={{ background: "var(--paper-raised)", borderTop: "1px solid var(--line)" }}>
              {["Nearest shelter", "Evacuation route", "Weather update"].map((chip) => (
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

            <div className="p-3 flex items-center gap-2" style={{ background: "var(--paper-raised)", borderTop: "1px solid var(--line)" }}>
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask about disaster safety, shelters..."
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

        <button
          onClick={() => setIsAiOpen((prev) => !prev)}
          style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg, #0E6B62, #0A4F48)", boxShadow: "0 10px 25px rgba(14,107,98,0.4)" }}
          className="ss-focus ss-beacon relative text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
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
