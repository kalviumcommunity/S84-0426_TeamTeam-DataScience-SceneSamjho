const KPI_ITEMS = [
  { key: "total_accidents", label: "Total Accidents", valueType: "number" },
  { key: "total_fatalities", label: "Total Fatalities", valueType: "number" },
  { key: "top_hazard_weather", label: "Top Hazard Weather", valueType: "text" },
  { key: "top_hazard_road", label: "Top Hazard Road", valueType: "text" },
  { key: "dui_percentage", label: "DUI / Alcohol %", valueType: "percent" },
];

function formatKpiValue(value, valueType) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (valueType === "percent" && typeof value === "number") {
    return `${value}%`;
  }

  if (valueType === "number" && typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  return value;
}

export function KpiCards({
  data = {},
  isLoading = false,
  error = "",
  onRetry,
  isRetrying = false,
}) {
  if (isLoading) {
    return <div className="chart-state">Loading KPI snapshot…</div>;
  }

  if (error) {
    return (
      <div className="chart-state chart-state--error">
        <p>{error}</p>
        {onRetry ? (
          <button
            type="button"
            className="chart-state__action"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        ) : null}
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return <div className="chart-state">No KPI data available yet.</div>;
  }

  return (
    <div className="kpi-grid" aria-label="KPI cards">
      {KPI_ITEMS.map((item) => (
        <article key={item.key} className="kpi-card">
          <h3>{item.label}</h3>
          <p className={item.valueType === "text" ? "kpi-card__value kpi-card__value--text" : "kpi-card__value"}>
            {formatKpiValue(data[item.key], item.valueType)}
          </p>
        </article>
      ))}
    </div>
  );
}
