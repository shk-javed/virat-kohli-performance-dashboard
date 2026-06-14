from sqlalchemy import text

def fetch_dashboard_data(
    db,
    format_filter="All",
    year_filter=None,
    opponent_filter=None,
    venue_filter=None,
    home_away_filter=None,
):

    filters = []
    params = {}

    if format_filter and format_filter != "All":
        filters.append("MatchType = :format")
        params["format"] = format_filter

    if year_filter:
        filters.append("MatchYear = :year")
        params["year"] = year_filter

    if opponent_filter:
        filters.append("Opposition = :opponent")
        params["opponent"] = opponent_filter

    if venue_filter:
        filters.append("VenueCountry = :venue")
        params["venue"] = venue_filter

    # ── Yeh naya Dynamic Filter Logic hai ──
    if home_away_filter:
        home_away_calc = "CASE WHEN VenueCountry = 'India' THEN 'Home' WHEN VenueCountry = Opposition THEN 'Away' ELSE 'Neutral' END"
        filters.append(f"({home_away_calc}) = :homeAway")
        params["homeAway"] = home_away_filter

    where_clause = ""
    if filters:
        where_clause = " AND " + " AND ".join(filters)

    # ── KPIs ─────────────────────────────────────────────
    kpi_sql = f"""
    SELECT
        COUNT(*) AS Matches,
        SUM(CASE WHEN Runs_Clean IS NOT NULL THEN 1 ELSE 0 END) AS Innings,
        SUM(Runs_Clean) AS TotalRuns,
        ROUND(
            SUM(Runs_Clean) /
            NULLIF(COUNT(*) - SUM(NotOut),0),
            2
        ) AS BattingAverage,
        ROUND(
            SUM(Runs_Clean) * 100 /
            NULLIF(SUM(BF),0),
            2
        ) AS StrikeRate,
        MAX(Runs_Clean) AS HighestScore,
        SUM(
            CASE
                WHEN Runs_Clean>=100 THEN 1
                ELSE 0
            END
        ) AS Centuries,
        SUM(
            CASE
                WHEN Runs_Clean BETWEEN 50 AND 99 THEN 1
                ELSE 0
            END
        ) AS HalfCenturies
    FROM virat_matchwise_clean
    WHERE 1=1
    {where_clause}
    """

    kpi_row = db.execute(text(kpi_sql), params).mappings().first()
    kpis = dict(kpi_row) if kpi_row else {}
    
    # ── Format Stats (donut) ─────────────────────────────────────────────
    format_stats = [
        dict(r)
        for r in db.execute(
            text(f"""
            SELECT
                MatchType AS Format,
                SUM(Runs_Clean) AS TotalRuns,
                ROUND(SUM(Runs_Clean) / NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS BattingAverage,
                ROUND(SUM(Runs_Clean) * 100 / NULLIF(SUM(BF),0), 2) AS StrikeRate,
                SUM(CASE WHEN Runs_Clean >= 100 THEN 1 ELSE 0 END) AS Centuries
            FROM virat_matchwise_clean
            WHERE 1=1 {where_clause}
            GROUP BY MatchType
            ORDER BY TotalRuns DESC
            """),
            params
        ).mappings().all()
    ]

    # ── Runs By Year ───────────────────────────────────────────────────
    runs_by_year = [
        dict(r)
        for r in db.execute(
            text(f"""
            SELECT
                MatchYear AS Year,
                SUM(Runs_Clean) AS TotalRuns,
                ROUND(SUM(Runs_Clean) / NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS BattingAverage,
                ROUND(SUM(Runs_Clean) * 100 / NULLIF(SUM(BF),0), 2) AS StrikeRate
            FROM virat_matchwise_clean
            WHERE 1=1 {where_clause}
            GROUP BY MatchYear
            ORDER BY MatchYear
            """),
            params
        ).mappings().all()
    ]
    
    # ── Home / Away ───────────────────────────────────────────────────
    # TEMP BYPASS: API crash rokne ke liye empty list bhej rahe hain
    # ── Home / Away ───────────────────────────────────────────────────
    
    home_away_calc = "CASE WHEN VenueCountry = 'India' THEN 'Home' WHEN VenueCountry = Opposition THEN 'Away' ELSE 'Neutral' END"

    home_away = [
        dict(r)
        for r in db.execute(
            text(f"""
            SELECT
                {home_away_calc} AS Venue,
                COUNT(*) AS Matches,
                SUM(Runs_Clean) AS TotalRuns,
                ROUND(SUM(Runs_Clean) / NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS BattingAverage,
                ROUND(SUM(Runs_Clean) * 100 / NULLIF(SUM(BF),0), 2) AS StrikeRate,
                SUM(CASE WHEN Runs_Clean >= 100 THEN 1 ELSE 0 END) AS Centuries
            FROM virat_matchwise_clean
            WHERE 1=1 {where_clause}
            GROUP BY {home_away_calc}
            ORDER BY TotalRuns DESC
            """),
            params
        ).mappings().all()
    ]

    # ── Batting Position ───────────────────────────────────────────────
    batting_position = [
        dict(r)
        for r in db.execute(
            text(f"""
            SELECT
                CASE
                    WHEN Pos = 1 THEN '1st position'
                    WHEN Pos = 2 THEN '2nd position'
                    WHEN Pos = 3 THEN '3rd position'
                    ELSE CONCAT(Pos,'th position')
                END AS Position,
                COUNT(*) AS Innings,
                SUM(Runs_Clean) AS Runs,
                ROUND(SUM(Runs_Clean) / NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS Average,
                SUM(CASE WHEN Runs_Clean >= 100 THEN 1 ELSE 0 END) AS Centuries,
                SUM(CASE WHEN Runs_Clean BETWEEN 50 AND 99 THEN 1 ELSE 0 END) AS HalfCenturies
            FROM virat_matchwise_clean
            WHERE Pos IS NOT NULL AND Pos <> '' AND Runs_Clean IS NOT NULL {where_clause}
            GROUP BY Pos
            ORDER BY Runs DESC
            """),
            params
        ).mappings().all()
    ]
    
    # ── Smart Insights & Chase Stats ─────────────────────────────────────────────
    def first(query):
        r = db.execute(text(query), params).mappings().first()
        return dict(r) if r else {}

    best_year = first(f"""SELECT MatchYear AS AnalysisValue, SUM(Runs_Clean) AS TotalRuns FROM virat_matchwise_clean WHERE 1=1 {where_clause} GROUP BY MatchYear ORDER BY TotalRuns DESC LIMIT 1""")
    best_opponent = first(f"""SELECT Opposition AS AnalysisValue, SUM(Runs_Clean) AS TotalRuns FROM virat_matchwise_clean WHERE 1=1 {where_clause} GROUP BY Opposition ORDER BY TotalRuns DESC LIMIT 1""")
    best_country = first(f"""SELECT VenueCountry AS AnalysisValue, ROUND(SUM(Runs_Clean)/NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS BattingAverage FROM virat_matchwise_clean WHERE 1=1 {where_clause} GROUP BY VenueCountry ORDER BY BattingAverage DESC LIMIT 1""")
    best_format = first(f"""SELECT MatchType AS AnalysisValue, SUM(Runs_Clean) AS TotalRuns FROM virat_matchwise_clean WHERE 1=1 {where_clause} GROUP BY MatchType ORDER BY TotalRuns DESC LIMIT 1""")

    # 1. Best Continent Calculation
    continent_calc = """
    CASE 
        WHEN VenueCountry IN ('India', 'Sri Lanka', 'Bangladesh', 'United Arab Emirates', 'Pakistan') THEN 'Asia' 
        WHEN VenueCountry IN ('Australia', 'New Zealand') THEN 'Oceania' 
        WHEN VenueCountry IN ('England', 'Ireland') THEN 'Europe' 
        WHEN VenueCountry IN ('South Africa', 'Zimbabwe') THEN 'Africa' 
        WHEN VenueCountry IN ('West Indies') THEN 'Americas' 
        ELSE 'Other' 
    END
    """
    best_continent = first(f"""SELECT {continent_calc} AS AnalysisValue, SUM(Runs_Clean) AS TotalRuns FROM virat_matchwise_clean WHERE 1=1 {where_clause} GROUP BY {continent_calc} ORDER BY TotalRuns DESC LIMIT 1""")

    # 2. Dynamic Chase Average Calculation (Innings = 2)
    chase_data = first(f"""SELECT ROUND(SUM(Runs_Clean) / NULLIF(COUNT(*) - SUM(NotOut),0), 2) AS ChaseAverage FROM virat_matchwise_clean WHERE Inns = '2' {where_clause}""")
    chase_avg = chase_data.get("ChaseAverage") if chase_data.get("ChaseAverage") is not None else 0.0

    smart_insights = {
        "best_year": {"label": "Best Year", "AnalysisValue": best_year.get("AnalysisValue", "-"), "sub": f"{best_year.get('TotalRuns',0)} Runs"},
        "best_opponent": {"label": "Best Opponent", "AnalysisValue": best_opponent.get("AnalysisValue", "-"), "sub": f"{best_opponent.get('TotalRuns',0)} Runs"},
        "best_country": {"label": "Best Country", "AnalysisValue": best_country.get("AnalysisValue", "-"), "sub": f"Avg {best_country.get('BattingAverage',0) or 0}"},
        "best_format": {"label": "Best Format", "AnalysisValue": best_format.get("AnalysisValue", "-"), "sub": f"{best_format.get('TotalRuns',0)} Runs"},
        "best_continent": {"label": "Best Continent", "AnalysisValue": best_continent.get("AnalysisValue", "-"), "sub": f"{best_continent.get('TotalRuns',0)} Runs"},
    }

    return {
        "kpis": kpis,
        "format_stats": format_stats,
        "runs_by_year": runs_by_year,
        "home_away": home_away,
        "batting_position": batting_position,
        "smart_insights": smart_insights,
        "chase_average": chase_avg, # Yahan naya Chase Average frontend ko bhej diya
    }