const INSIGHT_CONFIG = [
  { key: "best_year", icon: "📅", label: "Best Year", valKey: "AnalysisValue" },
  { key: "best_opponent", icon: "🏏", label: "Best Opponent", valKey: "AnalysisValue" },
  { key: "best_country", icon: "🌍", label: "Best Country", valKey: "AnalysisValue" },
  { key: "best_format", icon: "🏆", label: "Best Format", valKey: "AnalysisValue" },
  { key: "best_continent", icon: "🌏", label: "Best Continent", valKey: "AnalysisValue" },
];

export default function SmartInsights({ data }) {
  if (!data) return null;

  return (
    <div className="si-wrap">
      {INSIGHT_CONFIG.map(({ key, icon, label }) => {
        const item = data[key];
        if (!item) return null;
        const value = item.AnalysisValue ?? "—";
        const sub = item.sub ?? "";
        return (
          <div key={key} className="si-card">
            <span className="si-icon">{icon}</span>
            <span className="si-label">{label}</span>
            <span className="si-val">{value}</span>
            <span className="si-sub">{sub}</span>
          </div>
        );
      })}
      <div className="si-note">
        ★ Kohli dominates across formats, especially in ODIs and in Asia.
      </div>
    </div>
  );
}
