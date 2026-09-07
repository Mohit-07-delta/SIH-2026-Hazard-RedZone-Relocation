import { useState, useRef, type FC } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props { onBack: () => void; }
interface AlertItem { type: string; severity: "High" | "Moderate" | "Low"; detail: string; time: string; }
interface Settlement { name: string; exposed: number; risk: "High" | "Moderate" | "Low"; }
interface FamilyMember { initials: string; name: string; }
interface ChatMessage { id: number; text: string; isUser: boolean; }

// ─── Static Data ─────────────────────────────────────────────────────────────
const ALERTS: AlertItem[] = [
  { type: "Landslide warning", severity: "High",     detail: "2.2 km away · 12 min ago",        time: "" },
  { type: "Heavy rainfall (orange)", severity: "Moderate", detail: "District-wide · 45 min ago",  time: "" },
  { type: "Road blockage — Meppadighat", severity: "Moderate", detail: "9.7 km away · 2 hours ago", time: "" },
];

const SETTLEMENTS: Settlement[] = [
  { name: "Chooralmala", exposed: 1440, risk: "High" },
  { name: "Mundakkai",   exposed: 860,  risk: "High" },
  { name: "Attamala",    exposed: 411,  risk: "Moderate" },
];

const FAMILY: FamilyMember[] = [
  { initials: "AN", name: "Anjali Menon" },
  { initials: "RK", name: "Rahul Krishnan" },
  { initials: "DN", name: "Devika Nair" },
];

const MAP_FILTERS = ["All", "Hazards", "Safe Sites", "Shelters", "Hospitals"];

const NAV_ITEMS = [
  { label: "Dashboard",          icon: "grid" },
  { label: "Safe Places",        icon: "shield" },
  { label: "Alerts",             icon: "bell" },
  { label: "Risk Areas",         icon: "alert-triangle" },
  { label: "Relocation",         icon: "map-pin" },
  { label: "My Family",          icon: "users" },
  { label: "Resources",          icon: "book-open" },
  { label: "Disaster Simulation",icon: "activity" },
  { label: "Settings",           icon: "settings" },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icon = ({ name, cls = "w-4 h-4" }: { name: string; cls?: string }) => {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    "alert-triangle": "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01",
    "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    "book-open": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-2a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    "map-icon": "M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7",
    location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    thermometer: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z",
    "upload-cloud": "M16 16l-4-4-4 4M12 12v9M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3",
    "chevron-right": "M9 18l6-6-6-6",
    "alert-warning": "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    route: "M3 17l4-8 4 4 4-6 4 4M21 21H3",
    incident: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    bot: "M12 2a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zM9 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
    family: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    resources: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
    clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l4 2",
  };
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {(paths[name] ?? "").split("M").filter(Boolean).map((d, i) => (
        <path key={i} d={"M" + d} />
      ))}
    </svg>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ level }: { level: "High" | "Moderate" | "Low" | "Safe" | "Moderate-main" }) {
  const map: Record<string, string> = {
    High:     "bg-red-100 text-red-700",
    Low:      "bg-green-100 text-green-700",
    Safe:     "bg-green-100 text-green-700",
    Moderate: "bg-amber-100 text-amber-700",
    "Moderate-main": "bg-amber-100 text-amber-700",
  };
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[level] ?? ""}`}>{level === "Moderate-main" ? "Moderate" : level}</span>;
}

// ─── Sidebar inner ────────────────────────────────────────────────────────────
function SidebarInner({ activeNav, setActiveNav, setSidebarOpen, onBack }: {
  activeNav: string;
  setActiveNav: (v: string) => void;
  setSidebarOpen: (v: boolean) => void;
  onBack: () => void;
}) {
  return (
    <>
      <div className="px-4 pt-5 pb-4">
        <p className="text-white font-extrabold text-base leading-tight">SurakshaSetu</p>
        <p className="text-slate-400 text-xs mt-0.5">Wayanad, Kerala</p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); setSidebarOpen(false); if (item.label !== "Dashboard") console.log("nav:", item.label); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Icon name={item.icon} cls="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-700 space-y-2">
        <button
          onClick={onBack}
          className="w-full text-xs text-slate-400 hover:text-white text-center py-1.5 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! I can explain your current risk, suggest a safe site, or guide you during an alert. What would you like to know?", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [reportType, setReportType] = useState("");
  const [reportLoc, setReportLoc] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  function getBotReply(t: string): string {
    const l = t.toLowerCase();
    if (l.includes("risk")) return "Your current risk level is Moderate (Level 2 of 4). Main factor: soil saturation after 3 days of continuous rain near Kalpetta North.";
    if (l.includes("safe site") || l.includes("safe place")) return "Nearest safe site: Meppadi Govt. Higher Secondary School, 6.4 km. Capacity: 320/500 used. Amenities: Medical, Water, Power, Shelter.";
    if (l.includes("route") || l.includes("short route")) return "Fastest safe route: Kalpetta North → Meppadi Govt. HSS via Meppadi bypass. 18 min drive. Avoid Chooralmala junction — drive slowly.";
    if (l.includes("shelter") || l.includes("nearby")) return "Nearby shelters: Meppadi HSS (6.4 km), Kalpetta Community Hall (3.1 km), Vythiri Relief Centre (9.2 km).";
    if (l.includes("what should")) return "Stay indoors, avoid low-lying areas, keep emergency kit ready. Call 112 if you feel unsafe. Monitor NDMA alerts.";
    return "Understood. For immediate help call 112. I am monitoring all alerts in Wayanad district.";
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: Date.now(), text, isUser: true };
    const botMsg: ChatMessage = { id: Date.now() + 1, text: getBotReply(text), isUser: false };
    setChatMessages(p => [...p, userMsg, botMsg]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3000);
    setReportType(""); setReportLoc(""); setReportDesc("");
  }

  const sidebarProps = { activeNav, setActiveNav, setSidebarOpen, onBack };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-48 flex-shrink-0 bg-slate-900 h-full">
        <SidebarInner {...sidebarProps} />
      </aside>

      {/* ── Mobile Sidebar overlay ────────────────────────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-48 bg-slate-900 flex flex-col lg:hidden transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarInner {...sidebarProps} />
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">

        {/* Top header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <button className="lg:hidden mr-3 text-gray-500" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="text-xl font-bold text-gray-900 inline">User Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Hazard red zone &amp; relocation planning — Wayanad district demo</p>
        </div>

        <div className="p-5 space-y-4 max-w-6xl">

          {/* ── Row 1: 4 Stat cards ──────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Safety Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Safety Status</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-800">Kalpetta Municipality</span>
                <Badge level="Safe" />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Icon name="clock" cls="w-3 h-3" /> Updated 5m ago</p>
              <p className="text-xs text-gray-500 mt-1">Some stability normal no active landslide signature nearby</p>
            </div>

            {/* Current Location */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Current Location</p>
              <div className="flex items-center gap-1 mb-1">
                <Icon name="location" cls="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-gray-800">Kalpetta North</span>
              </div>
              <p className="text-xs text-gray-400">North18, Wayanad</p>
              <button className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-0.5">
                View on map <Icon name="chevron-right" cls="w-3 h-3" />
              </button>
            </div>

            {/* Weather */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Weather</p>
                <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Heavy rain warning</span>
              </div>
              <p className="text-lg font-bold text-gray-800 flex items-center gap-1"><Icon name="thermometer" cls="w-4 h-4 text-orange-500" /> 24°C</p>
              <p className="text-xs text-gray-500 mt-1">Rainfall 66 mm / 24h</p>
              <p className="text-xs text-gray-500">Humidity 92%</p>
            </div>

            {/* Risk Level */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Risk Level</p>
                <Badge level="Moderate-main" />
              </div>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1"><Icon name="alert-triangle" cls="w-4 h-4 text-amber-500" /> Level 2 of 4</p>
              <p className="text-xs text-gray-500 mt-1">Main factor: soil saturation after 3 days of continuous rain</p>
            </div>
          </div>

          {/* ── Active Alerts ─────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Icon name="bell" cls="w-4 h-4" /> Active alerts</span>
              <span className="text-xs text-gray-400">3 active</span>
            </div>
            <div className="divide-y divide-gray-100">
              {ALERTS.map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-800">{a.type} </span>
                    <Badge level={a.severity} />
                    <p className="text-xs text-gray-400 mt-0.5">{a.detail}</p>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline whitespace-nowrap ml-4">View details</button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Live Hazard Map ───────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Icon name="map-icon" cls="w-4 h-4" /> Live hazard &amp; safety map</span>
            </div>
            <div className="px-5 py-3 flex gap-2 flex-wrap">
              {MAP_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors
                    ${activeFilter === f ? "bg-slate-800 text-white border-slate-800" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Map placeholder */}
            <div className="mx-5 mb-5 h-52 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm font-medium text-gray-400">Map view</p>
              <p className="text-xs text-gray-400">Showing: {activeFilter}</p>
            </div>
          </div>

          {/* ── Row: High-Risk Settlements + Relocation Site ──────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* High-Risk Settlements */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="alert-triangle" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">High-risk settlements</span>
              </div>
              <div className="divide-y divide-gray-100">
                {SETTLEMENTS.map((s, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.exposed.toLocaleString()} exposed</p>
                    </div>
                    <Badge level={s.risk} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Relocation Site */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="map-pin" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">Recommended relocation site</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Meppadi Govt. Higher Secondary School</p>
                  <p className="text-xs text-gray-500">6.4 km from your location</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Capacity</span>
                    <span className="font-medium">320 / 500</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Accessibility: bus and ambulance; some access on main roads.</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Medical", "Water", "Power", "Shelter"].map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full border border-gray-300 text-gray-600 bg-gray-50">✓ {tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Safe Relocation Route ─────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
              <Icon name="route" cls="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-800">Safe relocation route</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Kalpetta North → Meppadi Govt. HSS</p>
              <p className="text-xs text-gray-500">Distance: 6.4 km · ETA: 18 mins-road · Via Meppadi bypass</p>
              <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs text-amber-700 flex items-start gap-1.5">
                <Icon name="alert-warning" cls="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Warning: going reported near Chooralmala junction — drive slowly
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
                  <Icon name="map-icon" cls="w-3.5 h-3.5" /> Get directions
                </button>
                <button className="text-xs text-blue-600 hover:underline font-medium">View alternative route</button>
              </div>
            </div>
          </div>

          {/* ── Row: Report + AI ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Report an Incident */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="incident" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">Report an incident</span>
              </div>
              <form onSubmit={submitReport} className="px-5 py-4 space-y-3">
                {reportSubmitted && (
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">✅ Report submitted!</div>
                )}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Incident type *</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  >
                    <option value="">Select type</option>
                    <option>Landslide</option>
                    <option>Flash Flood</option>
                    <option>Road Blocked</option>
                    <option>Person Missing</option>
                    <option>Structural Damage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Location *</label>
                  <input
                    value={reportLoc}
                    onChange={e => setReportLoc(e.target.value)}
                    placeholder="e.g. Chooralmala, near school Junction"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Photo (optional)</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Icon name="upload-cloud" cls="w-4 h-4" /> Upload photo
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Description *</label>
                  <textarea
                    value={reportDesc}
                    onChange={e => setReportDesc(e.target.value)}
                    placeholder="What is happening? Any people affected?"
                    rows={2}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Icon name="incident" cls="w-4 h-4" /> Submit report
                </button>
              </form>
            </div>

            {/* AI Assistant */}
            <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="bot" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">AI assistant</span>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-48">
                {chatMessages.map(m => (
                  <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs text-xs px-3 py-2 rounded-xl leading-relaxed
                      ${m.isUser ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-700"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="px-5 py-2 flex flex-wrap gap-1.5">
                {["Check my risk", "Find safe site", "Find short route", "Nearby shelter"].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setChatInput(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="px-5 pb-4 pt-2 flex gap-2 border-t border-gray-100">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Ask a question..."
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={sendChat}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>

          {/* ── Row: My Family + Resources ──────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* My Family */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="family" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">My family</span>
              </div>
              <div className="divide-y divide-gray-100">
                {FAMILY.map((f, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {f.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{f.name}</p>
                      <p className="text-xs text-gray-400">Shared location</p>
                    </div>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <Icon name="resources" cls="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">Resources</span>
              </div>
              <div className="divide-y divide-gray-100">
                {["Disaster safety guides", "Do's & Don'ts", "Emergency kit checklist", "Helpline numbers"].map(r => (
                  <button key={r} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left">
                    <span className="text-sm text-gray-700">{r}</span>
                    <Icon name="chevron-right" cls="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Emergency Contacts ──────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
            <p className="text-xs text-gray-500 font-medium mb-3">Emergency contacts</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "112", href: "tel:112" },
                { label: "NDMA", href: "tel:18001807188" },
                { label: "SDMA", href: "tel:1070" },
                { label: "NDRF", href: "tel:01124363260" },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  <Icon name="phone" cls="w-3 h-3" /> {c.label}
                </a>
              ))}
            </div>
          </div>

          <div className="h-4" />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
