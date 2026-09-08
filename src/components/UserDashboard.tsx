import { useState, useRef, type FC, type ReactNode, type FormEvent } from "react";

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const c = { 
    width: size, 
    height: size, 
    viewBox: "0 0 24 24", 
    fill: "none", 
    stroke: "currentColor", 
    strokeWidth: 2, 
    strokeLinecap: "round" as const, 
    strokeLinejoin: "round" as const 
  };
  const p: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    shield: <><path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    warning: <><path d="m12 3 9 18H3L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    bus: <><path d="M5 16h14"/><path d="M6 16V5h12v11"/><path d="M6 9h12"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></>,
    family: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/><path d="M14 15c3 0 5 2 5 5"/></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19c0-1.1.9-2 2-2h13"/></>,
    simulation: <><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    report: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    // Newly Added Icons for Floating AI Assistant
    bot: <><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></>,
  };
  return <svg {...c}>{p[name] ?? p.settings}</svg>;
};

interface Props { onBack: () => void; }
interface AlertItem { type: string; severity: "High" | "Moderate" | "Low"; distance: string; time: string; }
interface Settlement { name: string; exposed: number; risk: "Critical" | "High" | "Moderate"; }
interface FamilyMember { name: string; initials: string; status: "Safe" | "Unknown"; location: string; }
interface ChatMessage { id: number; text: string; isUser: boolean; }

const ALERTS: AlertItem[] = [
  { type: "Landslide", severity: "High", distance: "2.4 km", time: "10 min ago" },
  { type: "Flash Flood", severity: "Moderate", distance: "5.1 km", time: "32 min ago" },
  { type: "Rockfall", severity: "Low", distance: "8.7 km", time: "1 hr ago" },
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
const NAV_ITEMS = [
  { label: "Dashboard", icon: "home" }, { label: "Safe Places", icon: "shield" },
  { label: "Alerts", icon: "bell" }, { label: "Risk Areas", icon: "warning" },
  { label: "Relocation", icon: "bus" }, { label: "My Family", icon: "family" },
  { label: "Resources", icon: "book" }, { label: "Disaster Simulation", icon: "simulation" },
  { label: "Settings", icon: "settings" },
];
const MAP_FILTERS = ["All", "Hazards", "Safe Sites", "Shelters", "Hospitals"];
const RESOURCES = [
  { icon: "report", label: "NDMA Evacuation Guidelines" },
  { icon: "map", label: "Wayanad District Hazard Map" },
  { icon: "shield", label: "Nearby Medical Facilities" },
  { icon: "phone", label: "Emergency Contact Directory" },
];

function Badge({ level }: { level: string }) {
  const m: Record<string, string> = {
    High: "bg-red-100 text-red-700", Critical: "bg-red-200 text-red-800",
    Moderate: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700", Safe: "bg-green-100 text-green-700", Unknown: "bg-amber-100 text-amber-700",
  };
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${m[level] ?? ""}`}>{level}</span>;
}

function SidebarInner({ activeNav, setActiveNav, setSidebarOpen, onBack }: {
  activeNav: string; setActiveNav: (v: string) => void; setSidebarOpen: (v: boolean) => void; onBack: () => void;
}) {
  return (
    <>
      <div className="px-4 pt-5 pb-4 border-b border-slate-700">
        <p className="text-white font-extrabold text-base">SurakshaSetu</p>
        <p className="text-slate-400 text-xs mt-0.5">Wayanad, Kerala</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => (
          <button key={item.label}
            onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${activeNav === item.label ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <span className="w-5 flex justify-center flex-shrink-0"><Icon name={item.icon} size={18} /></span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-slate-700">
        <a href="tel:112" className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors">
          <Icon name="phone" size={16} /> Emergency 112
        </a>
        <button onClick={onBack} className="mt-2 w-full text-xs text-slate-400 hover:text-white text-center py-1.5 transition-colors">Back to Home</button>
      </div>
    </>
  );
}

export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Floating Chat State
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! I am your SurakshaSetu AI assistant. How can I help you stay safe today?", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [reportType, setReportType] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  function getBotReply(t: string): string {
    const l = t.toLowerCase();
    if (l.includes("safe") && l.includes("place")) return "There are 14 safe shelters within 10 km of Wayanad.";
    if (l.includes("route") || l.includes("evacuate")) return "Recommended evacuation: NH-766 towards Sultan Bathery.";
    if (l.includes("weather") || l.includes("rain")) return "Heavy rainfall expected next 48h. IMD orange alert active.";
    if (l.includes("shelter")) return "Open: Meppadi Community Hall (500 cap), Sultan Bathery Govt. School (800 cap).";
    if (l.includes("hospital") || l.includes("medical")) return "Wayanad District Hospital (8 km). Call 108 for ambulance.";
    if (l.includes("family")) return "2 members safe at Meppadi Relief Camp. Arjun location unconfirmed.";
    return "Please stay calm and follow official instructions. Call 112 for immediate help.";
  }

  function sendChat(overrideText?: string) {
    const text = (overrideText ?? chatInput).trim();
    if (!text) return;
    const u: ChatMessage = { id: Date.now(), text, isUser: true };
    const b: ChatMessage = { id: Date.now() + 1, text: getBotReply(text), isUser: false };
    setChatMessages(prev => [...prev, u, b]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function submitReport(e: FormEvent) {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3000);
    setReportType(""); setReportDesc("");
  }

  const sp = { activeNav, setActiveNav, setSidebarOpen, onBack };

  return (
    <div className="relative flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-slate-900 h-full">
        <SidebarInner {...sp} />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-slate-900 flex flex-col lg:hidden transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarInner {...sp} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button className="lg:hidden p-1.5 rounded text-slate-600 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-800">{activeNav}</h1>
            <p className="text-xs text-slate-500">Wayanad District, Kerala</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Live
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">RK</div>
          </div>
        </header>

        {activeNav === "Settings" ? (
          <div className="p-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Manage your SurakshaSetu preferences</p>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Emergency Notifications</p>
                    <p className="text-xs text-slate-500 mt-1">Receive alerts about nearby hazards.</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">ON</button>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Location Sharing</p>
                    <p className="text-xs text-slate-500 mt-1">Allow SurakshaSetu to use your location.</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">ON</button>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-800">Language</label>
                  <select className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                    <option>English</option><option>Hindi</option><option>Malayalam</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === "Safe Places" ? (
          <div className="p-4 space-y-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900">Safe Places</h2>
            <p className="text-sm text-slate-500">Nearby safe shelters and evacuation locations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800">Meppadi Relief Shelter</h3>
                <p className="text-sm text-slate-500 mt-1">1.8 km away</p>
                <span className="inline-block mt-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">SAFE</span>
                <button onClick={() => alert("Directions coming soon")} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Get Directions</button>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800">Government High School Shelter</h3>
                <p className="text-sm text-slate-500 mt-1">3.2 km away</p>
                <span className="inline-block mt-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">SAFE</span>
                <button onClick={() => alert("Directions coming soon")} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Get Directions</button>
              </div>
            </div>
          </div>
        ) : activeNav === "Alerts" ? (
          <div className="p-4 space-y-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Active Alerts</h2>
              <p className="text-sm text-slate-500 mt-1">Current disaster alerts in your area</p>
            </div>
            <div className="space-y-3">
              {ALERTS.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                        <Icon name="warning" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{item.type}</h3>
                        <p className="text-sm text-slate-500 mt-1">{item.distance} - {item.time}</p>
                      </div>
                    </div>
                    <Badge level={item.severity} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => alert("Details coming soon")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">View Details</button>
                    <button onClick={() => alert("Route coming soon")} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">Evacuation Route</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium mb-1">Safety Status</p>
                <div className="flex items-center gap-2"><span className="text-2xl">🛡️</span><Badge level="Safe" /></div>
                <p className="text-xs text-slate-400 mt-2">Last verified 5 min ago</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium mb-1">Current Location</p>
                <div className="flex items-center gap-2"><span className="text-xl">📍</span><span className="text-sm font-bold text-slate-800">Meppadi</span></div>
                <p className="text-xs text-slate-400 mt-2">Wayanad, Kerala</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium mb-1">Weather</p>
                <div className="flex items-center gap-2"><span className="text-xl">🌧️</span><span className="text-sm font-bold text-slate-800">Heavy Rain</span></div>
                <p className="text-xs text-amber-600 mt-2 font-medium">IMD Orange Alert</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm bg-red-50">
                <p className="text-xs text-slate-500 font-medium mb-1">Risk Level</p>
                <div className="flex items-center gap-2"><span className="text-xl">⚠️</span><span className="text-sm font-bold text-red-700">High</span></div>
                <p className="text-xs text-red-500 mt-2 font-medium">Landslide zone nearby</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Active Alerts</h2>
                <button onClick={() => setActiveNav("Alerts")} className="text-xs text-blue-600 font-medium hover:underline">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <th className="px-4 py-2 text-left">Type</th><th className="px-4 py-2 text-left">Severity</th>
                    <th className="px-4 py-2 text-left">Distance</th><th className="px-4 py-2 text-left">Time</th><th className="px-4 py-2 text-left">Details</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {ALERTS.map((a, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{a.type}</td>
                        <td className="px-4 py-3"><Badge level={a.severity} /></td>
                        <td className="px-4 py-3 text-slate-600">{a.distance}</td>
                        <td className="px-4 py-3 text-slate-400">{a.time}</td>
                        <td className="px-4 py-3"><button className="text-blue-600 hover:underline text-xs">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-sm font-bold text-slate-800">Live Hazard and Safety Map</h2>
                <div className="flex gap-1.5 flex-wrap">
                  {MAP_FILTERS.map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                      className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${activeFilter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="m-4 h-60 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="text-4xl">🗺️</span>
                <p className="text-sm font-medium">Interactive Map - Wayanad District</p>
                <p className="text-xs">Red zones - Safe shelters - Evacuation routes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100"><h2 className="text-sm font-bold text-slate-800">High-Risk Settlements</h2></div>
                <ul className="divide-y divide-slate-100">
                  {SETTLEMENTS.map((s, i) => (
                    <li key={i} className="px-4 py-3 flex items-center justify-between">
                      <div><p className="text-sm font-medium text-slate-800">{s.name}</p><p className="text-xs text-slate-400">{s.exposed.toLocaleString()} residents</p></div>
                      <Badge level={s.risk} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100"><h2 className="text-sm font-bold text-slate-800">Recommended Relocation Site</h2></div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm font-bold text-slate-800">Sultan Bathery Govt. HSS</p><p className="text-xs text-slate-500">18 km away</p></div>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Open</span>
                  </div>
                  <div><div className="flex justify-between text-xs text-slate-500 mb-1"><span>Capacity</span><span>520 / 800</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[{l:"Food",v:"Available",c:"text-green-600"},{l:"Medical",v:"On-site",c:"text-green-600"},{l:"Water",v:"Available",c:"text-green-600"},{l:"Transport",v:"Limited",c:"text-amber-600"}].map(x => (
                      <div key={x.l} className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-slate-400">{x.l}</p><p className={`font-semibold ${x.c}`}>{x.v}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Safe Relocation Route</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-slate-700"><span className="font-semibold">From:</span> Meppadi <span className="mx-1 text-slate-300">to</span> <span className="font-semibold">Sultan Bathery Govt. HSS</span></p>
                  <p className="text-xs text-slate-500">Via NH-766 - 18 km - Est. 35 min - <span className="text-green-600 font-medium">Clear</span></p>
                  <p className="text-xs text-red-500 font-medium">Avoid: Mundakkai-Chooralmala road (active landslide)</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg">Get Directions</button>
                  <button className="text-blue-600 hover:underline text-xs text-center">View alternative route</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Incident Reporting Form */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100"><h2 className="text-sm font-bold text-slate-800">Report an Incident</h2></div>
                <form onSubmit={submitReport} className="p-4 space-y-3">
                  {reportSubmitted && <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2">Report submitted!</div>}
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Incident Type</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" required>
                      <option value="">Select type</option><option>Landslide</option><option>Flash Flood</option>
                      <option>Road Blocked</option><option>Person Missing</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Description</label>
                    <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} rows={3} placeholder="Describe what you observed" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" required />
                  </div>
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 rounded-lg">Submit Report</button>
                </form>
              </div>

              {/* Quick AI Trigger Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <Icon name="bot" size={22} />
                  </div>
                  <h3 className="text-base font-bold">24/7 AI Disaster Assistant</h3>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Need instant advice on evacuation shelters, safe routes, or medical help? Open the floating assistant at the bottom right anytime.
                  </p>
                </div>
                <button
                  onClick={() => setIsFloatingChatOpen(true)}
                  className="mt-4 flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 px-4 rounded-lg transition-colors shadow"
                >
                  <Icon name="sparkles" size={16} /> Open AI Assistant
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-800">My Family</h2>
                  <button className="text-xs text-blue-600 hover:underline">+ Add</button>
                </div>
                <ul className="divide-y divide-slate-100">
                  {FAMILY.map((f, i) => (
                    <li key={i} className="px-4 py-3 flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">{f.initials}</div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${f.status === "Safe" ? "bg-green-500" : "bg-amber-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                        <p className="text-xs text-slate-400 truncate">{f.location}</p>
                      </div>
                      <Badge level={f.status} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100"><h2 className="text-sm font-bold text-slate-800">Resources</h2></div>
                <ul className="divide-y divide-slate-100">
                  {RESOURCES.map((r, i) => (
                    <li key={i}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left">
                        <span className="text-slate-500"><Icon name={r.icon} size={18} /></span>
                        <span className="text-sm text-slate-700 font-medium">{r.label}</span>
                        <span className="ml-auto text-slate-300">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Emergency Contacts</p>
              <div className="flex flex-wrap gap-2">
                {[{l:"Police 112",h:"tel:112"},{l:"NDMA",h:"tel:18001807188"},{l:"SDMA Kerala",h:"tel:1070"},{l:"NDRF",h:"tel:01124363260"},{l:"Ambulance 108",h:"tel:108"}].map(x => (
                  <a key={x.l} href={x.h} className="flex items-center gap-1.5 bg-slate-700 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-full">📞 {x.l}</a>
                ))}
              </div>
            </div>
            <div className="h-4" />
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 🤖 FLOATING AI ASSISTANT WIDGET (BOTTOM-RIGHT CIRCLE & EXPANDING WINDOW) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        
        {/* Floating Chat Window */}
        {isFloatingChatOpen && (
          <div className="pointer-events-auto mb-3 w-[92vw] sm:w-[380px] h-[520px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ease-out transform translate-y-0 opacity-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-3.5 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="bot" size={18} />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-blue-700 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm leading-tight">SurakshaSetu AI</h3>
                    <span className="bg-blue-500/40 text-[10px] font-semibold px-1.5 py-0.2 rounded text-blue-100">Helper</span>
                  </div>
                  <p className="text-[11px] text-blue-100">Online • Wayanad Disaster Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsFloatingChatOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="Minimize Chat"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
              {chatMessages.map(m => (
                <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start gap-2"}`}>
                  {!m.isUser && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="bot" size={13} />
                    </div>
                  )}
                  <div className={`max-w-[80%] text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                    m.isUser 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {["Nearest shelter", "Evacuation route", "Weather update", "Family status"].map(chip => (
                <button
                  key={chip}
                  onClick={() => sendChat(chip)}
                  className="text-[11px] whitespace-nowrap bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 px-2.5 py-1 rounded-full font-medium transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Ask about safety, routes, shelters..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <button
                onClick={() => sendChat()}
                disabled={!chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-sm"
                title="Send Message"
              >
                <Icon name="send" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Circular Floating Trigger Button (FAB) */}
        <button
          onClick={() => setIsFloatingChatOpen(prev => !prev)}
          className="pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none ring-4 ring-white"
          title={isFloatingChatOpen ? "Close AI Assistant" : "Open AI Assistant"}
          aria-label="AI Assistant"
        >
          {/* Pulsing online indicator badge */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          {/* Icon switches between Bot and Close */}
          {isFloatingChatOpen ? (
            <Icon name="x" size={22} />
          ) : (
            <div className="flex items-center justify-center">
              <Icon name="bot" size={26} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
