import { FiZap, FiTarget, FiBarChart2, FiAward, FiShield, FiStar } from "react-icons/fi";

const STATS = [
  { icon: <FiZap color="#f5c24b" />, label: "Overall Chase Average", value: "—" },
  { icon: <FiTarget color="#ef4444" />, label: "Centuries in Successful Chases", value: "27" },
  { icon: <FiBarChart2 color="#3b82f6" />, label: "50+ Scores in Successful Chases", value: "92" },
  { icon: <FiAward color="#f5c24b" />, label: "Win% when scoring 50+ in Chase", value: "71.2%" },
  { icon: <FiShield color="#38bdf8" />, label: "Not Outs in Successful Chases", value: "39" },
  { icon: <FiStar color="#f5c24b" />, label: "Player of the Match in Chases", value: "18" },
];

export default function ChaseMasterStats({ chaseAverage }) {
  return (
    <div className="cm-wrap">
      <div className="cm-list">
        {STATS.map(({ icon, label, value }) => {
          
          const displayValue = label === "Overall Chase Average"
            ? (chaseAverage !== undefined && chaseAverage !== null && chaseAverage !== 0 ? chaseAverage : "—")
            : value;

          return (
            <div key={label} className="cm-row">
              <span className="cm-icon">{icon}</span>
              <span className="cm-label">{label}</span>
              <span className="cm-value">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}