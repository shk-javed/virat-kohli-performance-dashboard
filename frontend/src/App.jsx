import { useEffect, useMemo, useState, useCallback } from "react";
import { FiUsers, FiLayers, FiBarChart2, FiTrendingUp, FiActivity, FiStar, FiAward, FiHash } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import FiltersSidebar from "./components/FiltersSidebar";
import HeroSection from "./components/HeroSection";
import KpiCard from "./components/KpiCard";
import RunsChart from "./components/RunsChart";
import FormatDonutChart from "./components/FormatDonutChart";
import HomeAwayChart from "./components/HomeAwayChart";
import BattingPositionTable from "./components/BattingPositionTable";
import SmartInsights from "./components/SmartInsights";
import ChaseMasterStats from "./components/ChaseMasterStats";
import { getDashboard } from "./services/api";
import "./App.css";

const KPI_META = [
  { key: "Matches", title: "MATCHES", icon: <FiUsers />, idx: 0 },
  { key: "Innings", title: "INNINGS", icon: <FiLayers />, idx: 1 },
  { key: "TotalRuns", title: "TOTAL RUNS", icon: <FiBarChart2 />, idx: 2 },
  { key: "BattingAverage", title: "BATTING AVG", icon: <FiTrendingUp />, idx: 3 },
  { key: "StrikeRate", title: "STRIKE RATE", icon: <FiActivity />, idx: 4 },
  { key: "HighestScore", title: "HIGHEST SCORE", icon: <FiStar />, idx: 5 },
  { key: "Centuries", title: "CENTURIES", icon: <FiAward />, idx: 6 },
  { key: "HalfCenturies", title: "FIFTIES", icon: <FiHash />, idx: 7 },

];

export default function App() {
  const [filters, setFilters] = useState({ format: "All", year: null, opponent: null, venue: null, homeAway: null });
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [kpiFocus, setKpiFocus] = useState("TOTAL RUNS");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeFormat = filters.format;

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  
  const load = useCallback(async (filters) => {
    setLoading(true); setError(null);
    try { const res = await getDashboard(filters); setData(res); } 
    catch (e) { setError("API error"); console.error(e); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(filters); }, [filters, load]);

  const kpiCards = useMemo(() => {
    if (!data?.kpis) return [];
    return KPI_META.map(m => ({ ...m, value: typeof data.kpis[m.key] === "number" ? data.kpis[m.key].toLocaleString() : (data.kpis[m.key] ?? "—") }));
  }, [data?.kpis]);

  const renderContent = () => {
    if (activeNav === "Dashboard") return (
      <>
        <HeroSection kpis={data?.kpis} activeFormat={activeFormat} />
        <section className="kpi-row">
          {loading ? KPI_META.map(m => <div key={m.key} className="kpi-card skeleton" />)
            : kpiCards.map(c => <KpiCard key={c.title} {...c} colorIdx={c.idx} active={kpiFocus === c.title} onClick={() => setKpiFocus(c.title)} />)}
        </section>
        <section className="grid-3">
          <div className="panel"><h3>RUNS</h3><div className="chart-box">{!loading && <RunsChart data={data?.runs_by_year || []} />}</div></div>
          <div className="panel"><h3>FORMATS</h3><div className="chart-box">{!loading && <FormatDonutChart data={data?.format_stats || []} />}</div></div>
          <div className="panel"><h3>HOME/AWAY</h3><div className="chart-box">{!loading && <HomeAwayChart data={data?.home_away || []} />}</div></div>
        </section>
        <section className="grid-3">
          <div className="panel"><h3>BATTING POSITION ANALYSIS</h3>{!loading && <BattingPositionTable data={data?.batting_position || []} />}</div>
          <div className="panel"><h3>SMART INSIGHTS</h3>{!loading && <SmartInsights data={data?.smart_insights || {}} />}</div>
          <div className="panel"><h3>CHASE MASTER STATS</h3><ChaseMasterStats chaseAverage={data?.chase_average} /></div>
        </section>
      </>
    );

    if (activeNav === "Batting") return <div className="panel"><h3>BATTING STATISTICS</h3><p>Batting specific data here...</p></div>;
    if (activeNav === "Overview") return <div className="panel"><h3>OVERVIEW SECTION</h3><p>Overview details here...</p></div>;
    
    return <div className="panel"><h3>{activeNav}</h3><p>Coming soon...</p></div>;
  };

  return (
    <div className="shell">
      <Sidebar activeFormat={activeFormat} onFormatChange={(fmt) => updateFilter("format", fmt)} activeNav={activeNav} onNavChange={setActiveNav} />
      
      <main className="main">
        {loading ? <div className="loading">Loading...</div> : renderContent()}
        {error ? <div className="error-toast">{error}</div> : null}
      </main>

      <FiltersSidebar filters={filters} onFilterChange={updateFilter} chaseAverage={data?.chase_average} />
    </div>
  );
}