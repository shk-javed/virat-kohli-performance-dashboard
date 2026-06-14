export default function BattingPositionTable({ data = [] }) {
  if (!data.length) return <div className="no-data">No data</div>;

  // top 5 rows only to keep compact
  // Sort by batting position (1 → 7)
  const rows = [...data]
    .sort(
      (a, b) =>
        Number(a.Position.match(/\d+/)?.[0]) -
        Number(b.Position.match(/\d+/)?.[0])
    )
    .slice(0, 5);

  return (
    <div className="bp-table-wrap">
      <table className="bp-table">
        <thead>
          <tr>
            <th>POSITION</th>
            <th>INNINGS</th>
            <th>RUNS</th>
            <th>AVERAGE</th>
            <th>100s/50s</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                Number(row.Position.match(/\d+/)?.[0]) === 3
                  ? "bp-top"
                  : ""
              }
            >
              <td className={`bp-pos ${Number(row.Position.match(/\d+/)?.[0]) === 3 ? "bp-top-pos" : ""
                }`}>
                {row.Position.match(/\d+/)?.[0]}
              </td>
              <td>{row.Innings ?? "—"}</td>
              <td className="bp-runs">{row.Runs?.toLocaleString() ?? "—"}</td>
              <td>{row.Average ?? "—"}</td>
              <td>{row.Centuries ?? "—"} / {row.HalfCenturies ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Insight note like reference */}
      <div className="bp-insight">
        <span className="bp-insight-icon">♛</span>
        <span>Kohli performs best at Position 3 with higher average and more centuries.</span>
      </div>
    </div>
  );
}
