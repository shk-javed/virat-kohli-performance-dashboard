import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default function OpponentChart({ data }) {
    return (
        <div className="runs-chart">
            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="Opponent"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                    />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            background: "#141824",
                            border: "1px solid #f5c24b",
                            borderRadius: "12px",
                            color: "#fff"
                        }}
                    />
                    <Bar
                        dataKey="TotalRuns"
                        fill="#f5c24b"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
