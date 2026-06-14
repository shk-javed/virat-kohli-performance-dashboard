import { FiCalendar, FiShield, FiAward, FiLayers } from "react-icons/fi";

export default function HeroSection({ kpis, activeFormat }) {
  const formatLabel = activeFormat === "All" ? "All" : activeFormat;

  return (
    <header className="hero">
      <img src="/virat.png" alt="Virat Kohli" className="hero-img" />

      <div className="hero-center">
        <h1 className="hero-name">
          <span className="skew-text">VIRAT KOHLI</span>
        </h1>
        <div className="hero-tagline">THE CHASE MASTER</div>
      </div>

      <div className="hero-kpi-bar">
        <div className="hk-item">
          <FiCalendar className="hk-icon" />
          <div className="hk-content">
            <span className="hk-label">DEBUT</span>
            <span className="hk-val">2008</span>
          </div>
        </div>
        <div className="hk-item">
          <FiShield className="hk-icon" />
          <div className="hk-content">
            <span className="hk-label">MATCHES</span>
            <span className="hk-val">{kpis?.Matches ?? "—"}</span>
          </div>
        </div>
        <div className="hk-item">
          <FiAward className="hk-icon" />
          <div className="hk-content">
            <span className="hk-label">TITLES</span>
            <span className="hk-val">5</span>
          </div>
        </div>
        <div className="hk-item">
          <FiLayers className="hk-icon" />
          <div className="hk-content">
            <span className="hk-label">FORMAT</span>
            <span className="hk-val">{formatLabel}</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <span className="jc-label">JERSEY NO.</span>
        <span className="jc-num">18</span>
      </div>
    </header>
  );
}