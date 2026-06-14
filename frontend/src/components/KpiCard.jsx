// Tiny static sparkline (decorative, like reference image)
function Sparkline({ color = "#f5c24b" }) {
  // generates a gentle wavy path
  const pts = [0,8,3,12,7,5,11,15,15,9,19,13,23,7,27,11,31,6,35,10,39,4,43,9,47,13,51,7,55,11,59,5,63,9,67,13];
  let d = "";
  for (let i = 0; i < pts.length; i += 2) {
    d += (i === 0 ? "M" : "L") + `${pts[i]},${pts[i + 1]} `;
  }
  return (
    <svg viewBox="0 0 67 20" className="sparkline" preserveAspectRatio="none">
      <polyline points={pts.reduce((a, v, i) => a + (i % 2 === 0 ? (i === 0 ? "" : " ") + v : "," + v), "")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICON_COLORS = [
  "#f5c24b","#f5c24b","#3b82f6","#10b981","#ef4444","#f59e0b","#8b5cf6","#ec4899"
];

export default function KpiCard({ title, value, icon, subtitle, active, onClick, colorIdx = 0 }) {
  const color = ICON_COLORS[colorIdx % ICON_COLORS.length];
  return (
    <button className={`kpi-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="kc-top">
        <span className="kc-icon" style={{ color }}>{icon}</span>
        <span className="kc-title">{title}</span>
      </div>
      <div className="kc-value">{value ?? "—"}</div>
      <div className="kc-sub">{subtitle || "All Formats"}</div>
      <Sparkline color={color} />
    </button>
  );
}
