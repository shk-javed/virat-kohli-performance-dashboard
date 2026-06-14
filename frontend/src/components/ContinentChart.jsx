import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function ContinentChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <XAxis dataKey="Continent" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="TotalRuns"
          fill="#E8B84C"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ContinentChart;
