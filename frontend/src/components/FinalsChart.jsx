import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#f5c24b",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
];

export default function FinalsChart({ data }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="TotalRuns"
          nameKey="FinalType"
          outerRadius={140}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#141824",
            border: "1px solid #f5c24b",
            borderRadius: "12px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
