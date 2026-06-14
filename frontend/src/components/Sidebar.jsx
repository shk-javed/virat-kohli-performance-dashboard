import { useState, useEffect } from "react"; // Ensure ye import hai
import { FiHome, FiBarChart2, FiActivity, FiBookOpen, FiUsers, FiMapPin, FiShield, FiMoreHorizontal, FiRefreshCw, FiInfo, FiExternalLink } from "react-icons/fi";
import { GiCricketBat } from "react-icons/gi";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FiHome },
  { label: "Overview", icon: FiBarChart2 },
  { label: "Batting", icon: GiCricketBat },
  { label: "Analytics", icon: FiActivity },
  { label: "Records", icon: FiBookOpen },
  { label: "Opposition", icon: FiUsers },
  { label: "Venues", icon: FiMapPin },
  { label: "Chase Master", icon: FiShield },
  { label: "More Insights", icon: FiMoreHorizontal },
];

const TRIVIA_DATA = [
  "Kohli is the fastest player in history to reach 13,000 runs in ODIs.",
  "Virat Kohli has the most centuries in successful run chases in ODI history.",
  "He is the only player to score over 20,000 international runs in a single decade.",
  "Kohli holds the record for most runs in a single edition of the ICC World T20."
];

export default function Sidebar({ activeNav, onNavChange }) {
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % TRIVIA_DATA.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return ( // <--- Yahan return zaroori tha
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-crown">♛</div>
        <div className="sb-brand-name">KING KOHLI</div>
        <div className="sb-brand-sub">The Run Machine</div>
      </div>

      <div className="sb-profile">
        <div className="sb-profile-card">
          <div className="sb-profile-row">
            <span className="sb-p-label">Role</span>
            <span className="sb-p-val">Top Order Batter</span>
          </div>
          <div className="sb-profile-row">
            <span className="sb-p-label">Batting Style</span>
            <span className="sb-p-val">Right-Handed</span>
          </div>
        </div>
      </div>

      <nav className="sb-nav">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              className={`sb-link ${isActive ? "active" : ""}`}
              onClick={() => onNavChange(label)}
            >
              <Icon className={`sb-icon ${isActive ? "active-icon" : ""}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* DYNAMIC TRIVIA BOX */}
      <div className="sb-fact-box">
        <div className="sb-fact-header">
          <FiInfo size={12} color="#f5c24b" /> <span>Did You Know?</span>
        </div>
        <p style={{ minHeight: "40px", transition: "opacity 0.5s" }}>
          {TRIVIA_DATA[triviaIndex]}
        </p>
      </div>

      <div className="sb-footer">
        <div className="sb-footer-line">
          <span className="sb-muted">Data Source</span>
          <a href="#" target="_blank" rel="noreferrer" className="sb-link-ext">
            My Python API <FiExternalLink size={10} />
          </a>
        </div>
        <div className="sb-footer-line">
          <span className="sb-muted">Last Updated</span>
          <span>June 2026</span>
        </div>
        <button className="sb-refresh" onClick={() => window.location.reload()} title="Reload Dashboard">
          <FiRefreshCw size={11} /> Refresh Data
        </button>
      </div>
    </aside>
  );
}