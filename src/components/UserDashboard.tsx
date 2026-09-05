import { useState, useEffect, useRef, type FC } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
}

const VIDISHA: [number, number] = [23.5251, 77.8121];

const PLACES = [
  { type: "safe", name: "Community Safe Point – Station Road", coords: [23.5285, 77.8065] as [number, number] },
  { type: "shelter", name: "Govt. Relief Shelter – Civil Lines", coords: [23.5320, 77.8145] as [number, number] },
  { type: "warn", name: "Reported Flood-Risk Zone", coords: [23.5350, 77.8200] as [number, number] },
  { type: "hospital", name: "District Hospital, Vidisha", coords: [23.5220, 77.8260] as [number, number] },
  { type: "hospital", name: "City Care Hospital", coords: [23.5175, 77.7995] as [number, number] },
  { type: "safe", name: "Safe Point – Bus Stand", coords: [23.5210, 77.8095] as [number, number] },
  { type: "shelter", name: "Community Shelter – Sanchi Road", coords: [23.5165, 77.8180] as [number, number] },
  { type: "safe", name: "Safe Point – Udayagiri Chowk", coords: [23.5145, 77.8140] as [number, number] },
];

const PIN_CONFIG: Record<string, { bg: string; icon: string }> = {
  safe: { bg: "#22a559", icon: "🛡️" },
  shelter: { bg: "#2f6fed", icon: "🏠" },
  hospital: { bg: "#ef3b3b", icon: "H" },
  warn: { bg: "#f59e0b", icon: "⚠️" },
};

function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("safe") && t.includes("place"))
    return "There are 12 safe places within 5 km. Check the Quick Access panel or the map for exact locations.";
  if (t.includes("weather"))
    return "It's 27°C with light rain in Vidisha right now, humidity at 68%.";
  if (t.includes("emergency") || t.includes("contact"))
    return "Tap the red 112 button in the sidebar to call emergency services immediately, available 24/7.";
  if (t.includes("hospital"))
    return 'The nearest hospitals are marked with a red "H" on the Live Safety Map — tap one to open directions.';
  if (t.includes("shelter"))
    return "There are 8 shelters open right now. They are marked in blue on the map.";
  return "Got it — I've noted that. For anything urgent, please call 112 right away.";
}

export const UserDashboard: FC<Props> = ({ onBack }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi Satyam! 👋\nHow can I help you stay safe today?",
      isUser: false,
    },
  ]);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(VIDISHA, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Helper for DivIcon
    const makeIcon = (bg: string, icon: string, size = 30) =>
      L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;background:${bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid #fff;">${icon}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

    // You are here marker
    const userMarker = L.marker(VIDISHA, {
      icon: L.divIcon({
        className: "",
        html: `<div style="width:36px;height:36px;background:#2f6fed;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 0 8px rgba(47,111,237,0.2),0 3px 8px rgba(0,0,0,0.25);border:2px solid #fff;">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      }),
    })
      .addTo(map)
      .bindPopup("<b>You are here</b><br>Vidisha, Madhya Pradesh");

    userMarkerRef.current = userMarker;

    // Add place markers
    PLACES.forEach((p) => {
      const cfg = PIN_CONFIG[p.type];
      const marker = L.marker(p.coords, {
        icon: makeIcon(cfg.bg, cfg.icon, 30),
      }).addTo(map);

      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        p.name + " Vidisha"
      )}`;
      marker.bindPopup(
        `<b>${p.name}</b><br><a href="${mapsUrl}" target="_blank" rel="noopener" style="color:#2f6fed;text-decoration:none;font-weight:600;">Open in Google Maps ›</a>`
      );
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleZoom = (delta: number) => {
    if (!mapInstanceRef.current) return;
    if (delta > 0) mapInstanceRef.current.zoomIn();
    else mapInstanceRef.current.zoomOut();
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 15);
        }
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(coords).bindPopup("<b>You are here</b>").openPopup();
        }
      },
      (err) => {
        alert("Could not get your location (" + err.message + "). Showing default location.");
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(VIDISHA, 14);
        }
      }
    );
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      text,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: Date.now() + 1,
        text: getBotReply(text),
        isUser: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1c2230] font-sans flex flex-col">
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-[240px] bg-white border-r border-[#eef0f3]
            flex flex-col pb-5 transition-transform duration-300
            lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-b from-[#ef3b3b] to-[#dc2f2f] text-white p-6 pb-7 flex flex-col gap-2.5">
            <div className="w-11 h-11 border-2 border-white/80 rounded-full flex items-center justify-center text-xl">
              🛡️
            </div>
            <h1 className="text-base font-bold tracking-tight m-0">User Page</h1>
            <p className="text-xs text-white/80 -mt-1 m-0">Safety &amp; Relocation Portal</p>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab("Dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                activeTab === "Dashboard"
                  ? "bg-[#fdeceb] text-[#ef3b3b]"
                  : "text-[#5b6274] hover:bg-[#f7f8fa]"
              }`}
            >
              <span className="w-5 text-center text-base">🏠</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("Safe Places");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                activeTab === "Safe Places"
                  ? "bg-[#fdeceb] text-[#ef3b3b]"
                  : "text-[#5b6274] hover:bg-[#f7f8fa]"
              }`}
            >
              <span className="w-5 text-center text-base">🛡️</span>
              <span>Safe Places</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("Alerts");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                activeTab === "Alerts"
                  ? "bg-[#fdeceb] text-[#ef3b3b]"
                  : "text-[#5b6274] hover:bg-[#f7f8fa]"
              }`}
            >
              <span className="w-5 text-center text-base">🔔</span>
              <span>Alerts</span>
            </button>

            <a
              href="https://en.wikipedia.org/wiki/Family"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#5b6274] hover:bg-[#f7f8fa] transition-colors"
            >
              <span className="w-5 text-center text-base">👨‍👩‍👧</span>
              <span>My Family</span>
            </a>

            <a
              href="https://www.ndma.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#5b6274] hover:bg-[#f7f8fa] transition-colors"
            >
              <span className="w-5 text-center text-base">📘</span>
              <span>Resources</span>
            </a>

            {/* Back to Home Button */}
            <div className="pt-2 border-t border-[#eef0f3] mt-2">
              <button
                onClick={onBack}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#ef3b3b] hover:bg-[#fdeceb] cursor-pointer transition-colors"
              >
                <span className="w-5 text-center text-base">⬅️</span>
                <span>Back to Home</span>
              </button>
            </div>
          </nav>

          {/* Emergency Helpline Box */}
          <div className="mx-3.5 bg-[#fff5f4] border border-[#fbdcda] rounded-2xl p-4">
            <div className="text-[11px] font-bold text-[#ef3b3b] tracking-wide mb-2">
              IN AN EMERGENCY?
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:112"
                className="w-9 h-9 bg-[#ef3b3b] text-white rounded-full flex items-center justify-center text-sm shrink-0"
              >
                📞
              </a>
              <a href="tel:112" className="text-2xl font-extrabold text-[#1c2230] leading-none">
                112
              </a>
            </div>
            <div className="text-xs text-[#6b7280] mt-2">Emergency Call</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#22a559] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22a559] inline-block" />
              Available 24/7
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-12">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eef0f3] rounded-lg text-xs font-bold text-[#5b6274] hover:text-[#ef3b3b] hover:bg-white shadow-xs cursor-pointer transition-colors"
                title="Back to Landing Page"
              >
                <span>⬅️</span>
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 text-xl text-[#333] cursor-pointer"
              >
                ☰
              </button>
              <div>
                <p className="text-xs text-[#6b7280] m-0">Welcome back,</p>
                <h2 className="text-2xl font-extrabold m-0 flex items-center gap-2 text-[#1c2230]">
                  Satyam <span>👋</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative text-xl cursor-pointer"
                onClick={() => alert("13 new alerts in your area")}
              >
                🔔
                <span className="absolute -top-1.5 -right-2 bg-[#ef3b3b] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border border-white">
                  13
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                S
              </div>
            </div>
          </div>

          {/* ── TOP STAT CARDS ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* Safe Status Card */}
            <div className="bg-gradient-to-b from-[#eefaf1] to-[#f6fdf8] border border-[#dff2e4] rounded-2xl p-5 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#cdeed9] flex items-center justify-center text-3xl mx-auto mb-2.5 text-[#22a559]">
                🛡️
              </div>
              <div className="text-xs tracking-widest text-[#22a559] font-bold">YOU ARE</div>
              <div className="text-3xl font-extrabold text-[#22a559] my-0.5 tracking-wide">
                SAFE
              </div>
              <div className="text-xs text-[#5f7a68]">Stay alert, stay safe!</div>
            </div>

            {/* Current Location */}
            <div className="bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#fdeaea] text-[#ef3b3b] flex items-center justify-center text-lg shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-xs text-[#8890a0] m-0 mb-0.5">Current Location</p>
                  <p className="text-lg font-extrabold text-[#1c2230] m-0">Vidisha</p>
                  <p className="text-xs text-[#8890a0] mt-0.5">Madhya Pradesh, India</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Vidisha,Madhya+Pradesh,India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ef3b3b] text-white text-xs font-bold rounded-lg w-fit mt-3"
              >
                View on Map ›
              </a>
            </div>

            {/* Weather Status */}
            <div className="bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#e8f1fe] text-[#2f6fed] flex items-center justify-center text-lg shrink-0">
                  🌧️
                </div>
                <div>
                  <p className="text-xs text-[#8890a0] m-0 mb-0.5">Weather Status</p>
                  <p className="text-lg font-extrabold text-[#1c2230] m-0">27°C</p>
                  <p className="text-xs text-[#8890a0] mt-0.5">Light Rain</p>
                  <p className="text-xs text-[#8890a0]">Humidity 68%</p>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#fff3e0] text-[#f59e0b] flex items-center justify-center text-lg shrink-0">
                  <svg width="28" height="28" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f3e3d0" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeDasharray="70 30"
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[#8890a0] m-0 mb-0.5">Risk Level</p>
                  <p className="text-lg font-extrabold text-[#f59e0b] m-0">Moderate</p>
                  <p className="text-xs text-[#8890a0] mt-0.5">Stay informed</p>
                </div>
              </div>
              <a
                href="https://sachet.ndma.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eef0f3] text-[#ef3b3b] text-xs font-bold rounded-lg w-fit mt-3 shadow-xs"
              >
                Details ›
              </a>
            </div>
          </div>

          {/* ── ALERT BANNER ───────────────────────── */}
          <div className="bg-gradient-to-r from-[#fdeceb] to-[#fff5f4] border border-[#fbdcda] rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-[#ef3b3b]">⚠️</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#c22b2b] m-0">
                  Report an Alert
                </h3>
                <p className="text-xs text-[#8a5555] m-0 mt-0.5">
                  Help us keep our community safe
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl opacity-60 hidden sm:inline">🚨</span>
              <a
                href="mailto:alerts@surakshasetu.gov.in?subject=New%20Safety%20Alert&body=Location%3A%20Vidisha%2C%20Madhya%20Pradesh%0ADescription%3A%20"
                className="px-4 py-2 bg-[#ef3b3b] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs"
              >
                Report Now ›
              </a>
            </div>
          </div>

          {/* ── MAIN ROW: MAP / QUICK ACCESS / CHAT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-start">
            {/* Map Column (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 font-extrabold text-sm text-[#1c2230]">
                  <span className="w-2 h-2 rounded-full bg-[#22a559]" />
                  <span>Live Safety Map</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#22a559]">
                  <span className="w-2 h-2 rounded-full bg-[#22a559] animate-pulse" />
                  Live
                </div>
              </div>

              {/* Map View */}
              <div className="relative h-[340px] rounded-xl overflow-hidden border border-[#eef0f3]">
                <div ref={mapContainerRef} className="w-full h-full" />
                <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-[400]">
                  <button
                    onClick={() => handleZoom(1)}
                    className="w-8 h-8 bg-white border border-[#e5e7eb] rounded-lg text-base font-bold flex items-center justify-center shadow-md hover:bg-slate-50 cursor-pointer"
                    title="Zoom in"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleZoom(-1)}
                    className="w-8 h-8 bg-white border border-[#e5e7eb] rounded-lg text-base font-bold flex items-center justify-center shadow-md hover:bg-slate-50 cursor-pointer"
                    title="Zoom out"
                  >
                    −
                  </button>
                  <button
                    onClick={handleLocate}
                    className="w-8 h-8 bg-white border border-[#e5e7eb] rounded-lg text-sm flex items-center justify-center shadow-md hover:bg-slate-50 cursor-pointer"
                    title="Find my location"
                  >
                    ◎
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#6b7280]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2f6fed]" /> Your Location
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22a559]" /> Safe Place
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2f6fed]" /> Shelter
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef3b3b]" /> Hospital
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Flood Risk Zone
                </span>
              </div>
            </div>

            {/* Quick Access Column (3 cols) */}
            <div className="lg:col-span-3 bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-sm text-[#1c2230] mb-3">Quick Access</div>
                <div className="divide-y divide-[#f2f3f5]">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=safe+places+near+Vidisha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#22a559] text-white flex items-center justify-center text-sm shrink-0">
                      🛡️
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="block text-xs font-bold text-[#1c2230] truncate">Safe Places</b>
                      <span className="text-[11px] text-[#8890a0] truncate block">
                        Nearest secure locations
                      </span>
                    </div>
                    <span className="text-slate-400">›</span>
                  </a>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=hospitals+near+Vidisha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#ef3b3b] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      H
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="block text-xs font-bold text-[#1c2230] truncate">Nearby Hospitals</b>
                      <span className="text-[11px] text-[#8890a0] truncate block">
                        Medical assistance near you
                      </span>
                    </div>
                    <span className="text-slate-400">›</span>
                  </a>

                  <button
                    onClick={handleLocate}
                    className="w-full flex items-center gap-3 py-2.5 hover:bg-slate-50 text-left cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#2f6fed] text-white flex items-center justify-center text-sm shrink-0">
                      📍
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="block text-xs font-bold text-[#1c2230] truncate">My Location</b>
                      <span className="text-[11px] text-[#8890a0] truncate block">
                        Share live location
                      </span>
                    </div>
                    <span className="text-slate-400">›</span>
                  </button>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=shelters+near+Vidisha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#7c5cf0] text-white flex items-center justify-center text-sm shrink-0">
                      🏠
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="block text-xs font-bold text-[#1c2230] truncate">Shelters</b>
                      <span className="text-[11px] text-[#8890a0] truncate block">
                        Find relief shelters
                      </span>
                    </div>
                    <span className="text-slate-400">›</span>
                  </a>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Vidisha,Madhya+Pradesh,India"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-2 rounded-xl border border-[#f3d4d2] bg-white text-[#ef3b3b] font-bold text-xs text-center hover:bg-[#fff5f4] transition-colors block"
              >
                View All on Map
              </a>
            </div>

            {/* AI Chat Column (3 cols) */}
            <div className="lg:col-span-3 bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-xs flex flex-col h-full min-h-[380px]">
              <div className="font-extrabold text-sm text-[#1c2230] mb-3">Chat With Bot</div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 mb-3 max-h-[220px] pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 p-2.5 rounded-xl text-xs leading-relaxed ${
                      m.isUser
                        ? "bg-[#fdeceb] text-[#1c2230] flex-row-reverse text-right"
                        : "bg-[#f7f8fa] text-[#1c2230]"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        m.isUser ? "bg-white" : "bg-[#20232b] text-white"
                      }`}
                    >
                      {m.isUser ? "🙋" : "🤖"}
                    </div>
                    <p className="m-0 whitespace-pre-line">{m.text}</p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["Nearby safe places", "Weather update", "Emergency contact"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendChat(chip)}
                    className="border border-[#e5e7eb] bg-white hover:bg-[#f7f8fa] rounded-full px-2.5 py-1 text-[11px] text-[#374151] cursor-pointer transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex gap-2 items-center mt-auto">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChat(chatInput);
                  }}
                  placeholder="Type something..."
                  className="flex-1 border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ef3b3b]"
                />
                <button
                  onClick={() => handleSendChat(chatInput)}
                  className="w-8 h-8 bg-[#ef3b3b] hover:bg-[#dc2f2f] text-white rounded-xl flex items-center justify-center text-xs cursor-pointer transition-colors"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          {/* ── BOTTOM STATS STRIP ─────────────────── */}
          <div className="bg-white border border-[#eef0f3] rounded-2xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#f0f1f3] p-4 lg:p-5">
            <div className="flex items-center gap-3 p-3">
              <div className="w-11 h-11 rounded-full bg-[#fdeceb] text-[#ef3b3b] flex items-center justify-center text-lg shrink-0">
                🔔
              </div>
              <div>
                <h4 className="text-lg font-extrabold m-0 text-[#1c2230]">3</h4>
                <p className="text-xs text-[#8890a0] m-0">Active Alerts</p>
                <p className="text-[10px] text-[#8890a0] m-0">In your area</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3">
              <div className="w-11 h-11 rounded-full bg-[#e8f7ee] text-[#22a559] flex items-center justify-center text-lg shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="text-lg font-extrabold m-0 text-[#1c2230]">12</h4>
                <p className="text-xs text-[#8890a0] m-0">Safe Places Nearby</p>
                <p className="text-[10px] text-[#8890a0] m-0">Within 5 km</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3">
              <div className="w-11 h-11 rounded-full bg-[#e8f1fe] text-[#2f6fed] flex items-center justify-center text-lg shrink-0">
                🏠
              </div>
              <div>
                <h4 className="text-lg font-extrabold m-0 text-[#1c2230]">8</h4>
                <p className="text-xs text-[#8890a0] m-0">Shelters Available</p>
                <p className="text-[10px] text-[#8890a0] m-0">Open now</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3">
              <div className="w-11 h-11 rounded-full bg-[#f1ecfd] text-[#7c5cf0] flex items-center justify-center text-lg shrink-0">
                👨‍👩‍👧
              </div>
              <div>
                <h4 className="text-lg font-extrabold m-0 text-[#1c2230]">4,582</h4>
                <p className="text-xs text-[#8890a0] m-0">People Protected</p>
                <p className="text-[10px] text-[#8890a0] m-0">In your zone</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:col-span-2 lg:col-span-1">
              <div className="w-11 h-11 rounded-full bg-[#fdeceb] text-[#ef3b3b] flex items-center justify-center text-lg shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="text-xs font-extrabold m-0 text-[#1c2230] leading-snug">
                  Together, we build a safer tomorrow.
                </h4>
                <p className="text-[10px] text-[#8890a0] m-0 mt-0.5">Stay alert. Stay alive. 🤍</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
