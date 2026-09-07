import { useState, useRef, type FC } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
}
interface Alert {
  type: string;
  severity: "High" | "Moderate" | "Low";
  distance: string;
  time: string;
}
interface Settlement {
  name: string;
  risk: "Critical" | "High" | "Moderate";
  population: number;
}
interface FamilyMember {
  name: string;
  initials: string;
  status: "Safe" | "Unknown";
  location: string;
}
interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
}

// ─── Placeholder Data (Wayanad, Kerala) ───────────────────────────────────────
const ALERTS: Alert[] = [
  { type: "Landslide", severity: "High", distance: "2.4 km", time: "10 min ago" },
  { type: "Flash Flood", severity: "Moderate", distance: "5.1 km", time: "32 min ago" },
  { type: "Rockfall", severity: "Low", distance: "8.7 km", time: "1 hr ago" },
];

const SETTLEMENTS: Settlement[] = [
  { name: "Mundakkai Colony", risk: "Critical", population: 312 },
  { name: "Chooralmala Village", risk: "Critical", population: 480 },
  { name: "Attamala Ward", risk: "High", population: 215 },
  { name: "Puthumala Hill Area", risk: "High", population: 178 },
];

const FAMILY: FamilyMember[] = [
  { name: "Rajan (Father)", initials: "RK", status: "Safe", location: "Meppadi Relief Camp" },
  { name: "Suma (Mother)", initials: "SK", status: "Safe", location: "Meppadi Relief Camp" },
  { name: "Arjun (Brother)", initials: "AK", status: "Unknown", location: "Last seen Chooralmala" },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Safe Places", icon: "🛡️" },
  { label: "Alerts", icon: "🔔" },
  { label: "Risk Areas", icon: "⚠️" },
  { label: "Relocation", icon: "🚌" },
  { label: "My Family", icon: "👨‍👩‍👧" },
  { label: "Resources", icon: "📚" },
  { label: "Disaster Simulation", icon: "🌀" },
  { label: "Settings", icon: "⚙️" },
];

const MAP_FILTERS = ["All", "Hazards", "Safe Sites", "Shelters", "Hospitals"];

const RESOURCES = [
  { icon: "📋", label: "NDMA Evacuation Guidelines" },
  { icon: "🗺️", label: "Wayanad District Hazard Map" },
  { icon: "🏥", label: "Nearby Medical Facilities" },
  { icon: "📞", label: "Emergency Contact Directory" },
];

// ─── Helper: severity badge ───────────────────────────────────────────────────
function SeverityBadge({ level }: { level: "High" | "Moderate" | "Low" | "Critical" }) {
  const classes: Record<string, string> = {
    High: "bg-red-100 text-red-700 border border-red-300",
    Critical: "bg-red-200 text-red-800 border border-red-400",
    Moderate: "bg-amber-100 text-amber-700 border border-amber-300",
    Low: "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${classes[level]}`}>
      {level}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! I am your SurakshaSetu AI assistant. How can I help you stay safe today?", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [reportType, setReportType] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  function getBotReply(text: string): string {
    const t = text.toLowerCase();
    if (t.includes("safe") && t.includes("place"))
      return "There are 14 safe shelters within 10 km of your location in Wayanad. Meppadi Community Hall and Sultan Bathery Relief Camp are the closest.";
    if (t.includes("route") || t.includes("evacuate") || t.includes("escape"))
      return "Recommended evacuation: NH-766 towards Sultan Bathery - road is clear. Avoid Mundakkai road (active landslide zone).";
    if (t.includes("weather") || t.includes("rain"))
      return "Current Wayanad forecast: Heavy rainfall expected next 48h. IMD orange alert active. Stay indoors or evacuate now.";
    if (t.includes("shelter"))
      return "Open shelters: Meppadi Community Hall (cap. 500, 340 occupied), Sultan Bathery Govt. School (cap. 800, 520 occupied).";
    if (t.includes("hospital") || t.includes("medical"))
      return "Nearest hospitals: Wayanad District Hospital (8 km), Kalpetta General Hospital (12 km). Call 108 for ambulance.";
    if (t.includes("family"))
      return "Your family check-in shows 2 members safe at Meppadi Relief Camp. Arjun location is still unconfirmed - contact NDRF at 1800-180-7188.";
    return "I understand. Please stay calm and follow official instructions. Call 112 for immediate assistance.";
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: Date.now(), text, isUser: true };
    const botMsg: ChatMessage = { id: Date.now() + 1, text: getBotReply(text), isUser: false };
    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3000);
    setReportType("");
    setReportDesc("");
  }

  // Reusable sidebar inner content
  const SidebarContent = (
    <>
      <div className="px-4 py-5 border-b border-slate-700">
        <div className="text-white font-extrabold text-lg leading-tight">SurakshaSetu</div>
        <div className="text-slate-400 text-xs mt-0.5">Hazard Safety Platform</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.label !== "Dashboard") console.log(`Navigate to: ${item.label}`);
              setActiveNav(item.label);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
              ${
                activeNav === item.label
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <a
          href="tel:112"
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
        >
          📞 Emergency 112
        </a>
        <button
          onClick={onBack}
          className="mt-2 w-full text-xs text-slate-400 hover:text-white text-center py-1.5 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* ── Desktop sidebar (always visible, part of flex flow) ── */}
      <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 bg-slate-900 h-full">
        {SidebarContent}
      </aside>

      {/* ── Mobile sidebar (fixed overlay, toggled by hamburger) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-52 bg-slate-900 flex flex-col lg:hidden
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {SidebarContent}
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-500">Wayanad District, Kerala — Live Hazard View</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              RK
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4 max-w-7xl mx-auto">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium mb-1">Safety Status</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">Safe</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Last verified 5 min ago</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium mb-1">Current Location</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span className="text-sm font-bold text-slate-800">Meppadi</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Wayanad, Kerala</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium mb-1">Weather and Hazard</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌧️</span>
                <span className="text-sm font-bold text-slate-800">Heavy Rain</span>
              </div>
              <p className="text-xs text-amber-600 mt-2 font-medium">IMD Orange Alert</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm bg-red-50">
              <p className="text-xs text-slate-500 font-medium mb-1">Risk Level</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-bold text-red-700">High</span>
              </div>
              <p className="text-xs text-red-500 mt-2 font-medium">Landslide zone nearby</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">🔔 Active Alerts</h2>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-4 py-2 text-left font-medium">Disaster Type</th>
                    <th className="px-4 py-2 text-left font-medium">Severity</th>
                    <th className="px-4 py-2 text-left font-medium">Distance</th>
                    <th className="px-4 py-2 text-left font-medium">Time</th>
                    <th className="px-4 py-2 text-left font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ALERTS.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{a.type}</td>
                      <td className="px-4 py-3"><SeverityBadge level={a.severity} /></td>
                      <td className="px-4 py-3 text-slate-600">{a.distance}</td>
                      <td className="px-4 py-3 text-slate-400">{a.time}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline text-xs font-medium">View details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-bold text-slate-800">🗺️ Live Hazard and Safety Map</h2>
              <div className="flex gap-1.5 flex-wrap">
                {MAP_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors
                      ${activeFilter === f
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="m-4 h-60 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
              <span className="text-4xl">🗺️</span>
              <p className="text-sm font-medium">Interactive Map — Wayanad District</p>
              <p className="text-xs">Red zones · Safe shelters · Evacuation routes</p>
              <div className="flex gap-4 text-xs mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" />Hazard</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" />Safe</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" />Shelter</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" />Hospital</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">🚨 High-Risk Settlements</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {SETTLEMENTS.map((s, i) => (
                  <li key={i} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.population} residents</p>
                    </div>
                    <SeverityBadge level={s.risk} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">🏕️ Recommended Relocation Site</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Sultan Bathery Govt. HSS</p>
                    <p className="text-xs text-slate-500">Sultan Bathery, Wayanad — 18 km away</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Open</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Capacity used</span>
                    <span className="font-medium text-slate-700">520 / 800</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Food", value: "Available", color: "text-green-600" },
                    { label: "Medical", value: "On-site", color: "text-green-600" },
                    { label: "Water", value: "Available", color: "text-green-600" },
                    { label: "Transport", value: "Limited", color: "text-amber-600" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-slate-400">{item.label}</p>
                      <p className={`font-semibold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-3">🚗 Safe Relocation Route</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">From:</span> Meppadi, Wayanad
                  <span className="mx-2 text-slate-300">→</span>
                  <span className="font-semibold">To:</span> Sultan Bathery Govt. HSS
                </p>
                <p className="text-xs text-slate-500">
                  Via NH-766 · 18 km · Est. 35 min · Road status: <span className="text-green-600 font-medium">Clear</span>
                </p>
                <p className="text-xs text-red-500 font-medium">
                  ⚠ Avoid: Mundakkai–Chooralmala road (active landslide)
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-fit">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                  Get Directions 🗺️
                </button>
                <button className="text-blue-600 hover:underline text-xs text-center font-medium">
                  View alternative route
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">📝 Report an Incident</h2>
              </div>
              <form onSubmit={submitReport} className="p-4 space-y-3">
                {reportSubmitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2 font-medium">
                    ✅ Report submitted successfully!
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">Incident Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type…</option>
                    <option>Landslide</option>
                    <option>Flash Flood</option>
                    <option>Road Blocked</option>
                    <option>Person Missing</option>
                    <option>Structural Damage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">Description</label>
                  <textarea
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe what you observed…"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">Photo (optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center text-slate-400 text-xs cursor-pointer hover:border-blue-400 transition-colors">
                    📷 Tap to attach photo
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">🤖 AI Assistant</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                {chatMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs text-xs px-3 py-2 rounded-2xl leading-relaxed
                        ${m.isUser
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-slate-100 text-slate-700 rounded-bl-sm"}`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
                {["Nearest shelter", "Evacuation route", "Weather update"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setChatInput(chip)}
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Ask about safety, routes, shelters…"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChat}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">👨‍👩‍👧 My Family</h2>
                <button className="text-xs text-blue-600 hover:underline font-medium">+ Add member</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {FAMILY.map((f, i) => (
                  <li key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                        {f.initials}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
                          ${f.status === "Safe" ? "bg-green-500" : "bg-amber-400"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                      <p className="text-xs text-slate-400 truncate">{f.location}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${f.status === "Safe" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {f.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">📚 Resources</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {RESOURCES.map((r, i) => (
                  <li key={i}>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                      <span className="text-xl">{r.icon}</span>
                      <span className="text-sm text-slate-700 font-medium">{r.label}</span>
                      <span className="ml-auto text-slate-300 text-sm">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Emergency Contacts</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Police — 112", href: "tel:112" },
                { label: "NDMA — 1800-180-7188", href: "tel:18001807188" },
                { label: "SDMA Kerala — 1070", href: "tel:1070" },
                { label: "NDRF — 011-24363260", href: "tel:01124363260" },
                { label: "Ambulance — 108", href: "tel:108" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-1.5 bg-slate-700 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-full transition-colors"
                >
                  📞 {c.label}
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
