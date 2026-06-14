import { FiFilter } from "react-icons/fi";

export default function FiltersSidebar({ filters = {}, onFilterChange, chaseAverage }) {
  // Safe handler taaki agar value na ho toh crash na kare
  const handleChange = (filterKey, value) => {
    if (onFilterChange) {
      onFilterChange(filterKey, value);
    }
  };

  return (
    <aside className="filters-sidebar">
      <div className="fs-header">
        <span className="fs-title">FILTERS</span>
        <FiFilter size={13} className="fs-icon" />
      </div>

      <div className="fs-group">
        <label className="fs-label">FORMAT</label>
        <select 
          className="fs-select" 
          value={filters.format || "All"}
          onChange={(e) => handleChange("format", e.target.value)}
        >
          <option value="All">All Formats</option>
          <option value="ODI">ODI</option>
          <option value="TEST">Test Matches</option>
          <option value="T20I">T20 Internationals</option>
          <option value="IPL">IPL</option>
        </select>
      </div>

      <div className="fs-group">
        <label className="fs-label">OPPOSITION</label>
        {/* Backend mein "opponent" key use hoti hai */}
        <select 
          className="fs-select"
          value={filters.opponent || ""}
          onChange={(e) => handleChange("opponent", e.target.value)}
        >
          <option value="">All Teams</option>
          <option value="Australia">Australia</option>
          <option value="England">England</option>
          <option value="Pakistan">Pakistan</option>
          <option value="South Africa">South Africa</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Sri Lanka">Sri Lanka</option>
        </select>
      </div>

      <div className="fs-group">
        <label className="fs-label">VENUE (Home/Away)</label>
        {/* Backend mein "homeAway" key use hoti hai */}
        <select 
          className="fs-select"
          value={filters.homeAway || ""}
          onChange={(e) => handleChange("homeAway", e.target.value)}
        >
          <option value="">All Venues</option>
          <option value="Home">Home (India)</option>
          <option value="Away">Away (Overseas)</option>
          <option value="Neutral">Neutral</option>
        </select>
      </div>

      {/* Chase Average card at bottom */}
      <div className="fs-chase-card">
        <span className="fcc-label">CHASE AVERAGE</span>
        <span className="fcc-sub">(2nd Innings Avg)</span>
        <span className="fcc-val">
          {chaseAverage !== undefined && chaseAverage !== null && chaseAverage !== 0 ? chaseAverage : "—"}
        </span>
      </div>
    </aside>
  );
}