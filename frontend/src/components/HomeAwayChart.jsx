import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

function fmtK(v) { return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v; }

export default function HomeAwayChart({ data = [] }) {
  // Capitalise venue labels
  const chartData = data.map(d => ({
    ...d,
    Venue: d.Venue ? d.Venue.charAt(0).toUpperCase() + d.Venue.slice(1).toLowerCase() : d.Venue,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <XAxis dataKey="Venue" tick={{ fontSize: 11, fill: "#a5a08b" }} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: "#8b95a5" }} tickLine={false} axisLine={false} tickFormatter={fmtK} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#8b95a5" }} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: "#0d1117", border: "1px solid #f5c24b44", borderRadius: 10, fontSize: 12 }}
          formatter={(v, name) => [
            name === "TotalRuns" ? v.toLocaleString() : v,
            name === "TotalRuns" ? "Runs" : "Average"
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#8b95a5", paddingTop: 4 }}
          formatter={(v) => v === "TotalRuns" ? "RUNS" : "AVERAGE"}
        />
        <Bar yAxisId="left"  dataKey="TotalRuns"      fill="#f6dd3b" radius={[6, 6, 0, 0]} barSize={28} />
        <Bar yAxisId="left"  dataKey="BattingAverage" fill="#ecb791" radius={[6, 6, 0, 0]} barSize={28} hide />
        <Line yAxisId="right" type="monotone" dataKey="BattingAverage" stroke="#edb48c" strokeWidth={2.5} dot={{ r: 5, fill: "#f97316" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
