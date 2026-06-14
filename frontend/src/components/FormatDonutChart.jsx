import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// FORMAT SPECIFIC PREMIUM GOLDEN PALETTE
const FORMAT_COLORS = {
  "T20I": "#f0a800", // Brightest Gold
  "ODI": "#dfdf00",  // Metallic Gold
  "TEST": "#7c6836"  // Antique Bronze/Gold
};

function getColor(name) {
  const format = name?.toUpperCase();
  return FORMAT_COLORS[format] || "#475569"; // Fallback grey
}

export default function FormatDonutChart({ data = [], activeFormat, onFormatClick }) {
  if (!data.length) return null;
  const total = data.reduce((s, d) => s + (d.TotalRuns || 0), 0);

  return (
    <div className="donut-wrap">
      {/* Donut Area */}
      <div className="donut-chart-area">
        <div className="donut-center">
          <span className="dc-val">{total > 26000 ? "26,000+" : total.toLocaleString()}</span>
          <span className="dc-sub">TOTAL RUNS</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* GLOW EFFECT FILTER */}
            <defs>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f5c24b" floodOpacity="0.8"/>
              </filter>
            </defs>
            <Pie 
              data={data} 
              dataKey="TotalRuns" 
              nameKey="Format"
              cx="50%" cy="50%" 
              innerRadius="65%" 
              outerRadius="85%"
              stroke="none" 
              onClick={(e) => onFormatClick?.(e.Format)}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {data.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={getColor(entry.Format)}
                  // Glow filter aur crisp border
                  style={{ filter: "url(#goldGlow)", outline: "none" }}
                  stroke={getColor(entry.Format)}
                  strokeWidth={2}
                  opacity={activeFormat === "All" || activeFormat === entry.Format ? 1 : 0.3} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: "#0d1117", border: "1px solid rgba(245, 194, 75, 0.3)", borderRadius: 8, fontSize: 12, color: "#fff" }}
              itemStyle={{ color: "#f5c24b", fontWeight: "bold" }}
              formatter={(v) => [v.toLocaleString(), "Runs"]} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Area */}
      <ul className="donut-legend">
        {data.map((entry, i) => {
          const pct = total > 0 ? ((entry.TotalRuns / total) * 100).toFixed(1) : 0;
          const color = getColor(entry.Format);
          const isActive = activeFormat === "All" || activeFormat === entry.Format;
          
          return (
            <li 
              key={i} 
              className="dl-item" 
              style={{ opacity: isActive ? 1 : 0.4 }}
              onClick={() => onFormatClick?.(entry.Format)}
            >
              {/* Legend dots with glow effect */}
              <span className="dl-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <span className="dl-fmt">{entry.Format}</span>
              <span className="dl-runs">{(entry.TotalRuns || 0).toLocaleString()}</span>
              <span className="dl-pct">({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}