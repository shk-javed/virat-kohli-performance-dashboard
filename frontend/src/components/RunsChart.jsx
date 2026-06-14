import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function fmt(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v;
}

export default function RunsChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gRuns" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f6e03b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#d7f63b" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(251, 243, 229, 0.88)" strokeDasharray="4 4" />
        <XAxis dataKey="Year" tick={{ fontSize: 10, fill: "#8b95a5" }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: "#d9dadd" }} tickLine={false} axisLine={false} tickFormatter={fmt} />
        <Tooltip
          contentStyle={{ background: "#7c7e82", border: "1px solid #f5c24b44", borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: "#f5c24b" }}
          formatter={(v) => [v.toLocaleString(), "Runs"]}
        />
        <Area type="monotone" dataKey="TotalRuns" stroke="#f6da3b" strokeWidth={2.5} fill="url(#gRuns)"
          dot={{ r: 3, fill: "#f6e63b", strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
