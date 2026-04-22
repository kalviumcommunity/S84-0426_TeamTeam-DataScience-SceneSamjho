const KPI_ITEMS = [
  { key: "total_accidents", label: "Total Accidents" },
  { key: "total_fatalities", label: "Total Fatalities" },
  { key: "top_hazard_weather", label: "Top Hazard Weather" },
  { key: "top_hazard_road", label: "Top Hazard Road" },
];

function formatKpiValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return value;
}

export function KpiCards({ data = {}, isLoading = false, error = "" }) {
  if (isLoading) {
    return <div className="chart-state">Loading KPI snapshot…</div>;
  }

  if (error) {
    return <div className="chart-state chart-state--error">{error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <div className="chart-state">No KPI data available yet.</div>;
  }

  return (
    <div className="kpi-grid" aria-label="KPI cards">
      {KPI_ITEMS.map((item) => (
        <article key={item.key} className="kpi-card">
          <h3>{item.label}</h3>
          <p>{formatKpiValue(data[item.key])}</p>
        </article>
      ))}
    </div>
  );
}
