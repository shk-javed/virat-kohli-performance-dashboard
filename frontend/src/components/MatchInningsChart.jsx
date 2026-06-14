import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function MatchInningsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={data}>
        <XAxis dataKey="Innings" />
        <YAxis />
        <Tooltip />
       <Bar
          dataKey="TotalRuns"
          fill="#E8B84C"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MatchInningsChart;
