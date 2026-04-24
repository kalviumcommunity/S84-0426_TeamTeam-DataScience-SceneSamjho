import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];
const SEVERITY_ORDER = ["Fatal", "Major", "Minor"];

function normalizeSeverityLabel(value) {
  const asString = String(value || "").trim();

  if (!asString) {
    return "Unknown";
  }

  return asString.charAt(0).toUpperCase() + asString.slice(1).toLowerCase();
}

function severitySortValue(severityLabel) {
  const index = SEVERITY_ORDER.indexOf(severityLabel);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function formatCount(value) {
  if (typeof value !== "number") {
    return "0";
  }

  return value.toLocaleString("en-IN");
}

function getHazardBreakdown(data) {
  return [
    { name: "Stray Animals", value: data.stray_animals_accidents || 0 },
    { name: "Wrong Way", value: data.wrong_way_accidents || 0 },
    { name: "Potholes", value: data.pothole_related || 0 },
  ];
}

function getWrongWaySeverityData(data) {
  const source = data.severity_distribution_wrong_way || {};

  return Object.keys(source)
    .map((severity) => ({
      severity: normalizeSeverityLabel(severity),
      count: Number(source[severity]) || 0,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => severitySortValue(a.severity) - severitySortValue(b.severity));
}

function getWeatherImpactData(data) {
  const source = data.weather_impact || {};

  return Object.keys(source)
    .map((weather) => ({
      weather: String(weather).trim(),
      count: Number(source[weather]) || 0,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);
}

function getTopHazard(hazardData) {
  return hazardData.reduce(
    (top, item) => (item.value > top.value ? item : top),
    { name: "N/A", value: 0 }
  );
}

export function IndianContextCharts({
  data = {},
  isLoading = false,
  error = "",
  onRetry,
  isRetrying = false,
}) {
  if (isLoading) {
    return <div className="chart-state">Loading context charts…</div>;
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

  const hazardData = getHazardBreakdown(data);
  const severityData = getWrongWaySeverityData(data);
  const hasHazardData = hazardData.some((item) => item.value > 0);
  const hasSeverityData = severityData.length > 0;
  const topHazard = getTopHazard(hazardData);
  const totalHazardIncidents = hazardData.reduce((sum, item) => sum + item.value, 0);
  const totalWrongWayIncidents = severityData.reduce((sum, item) => sum + item.count, 0);

  if (!hasHazardData && !hasSeverityData) {
    return <div className="chart-state">No context data available yet.</div>;
  }

  return (
    <div className="analytics-grid__split" aria-label="Indian context charts">
      <div className="context-chart-panel" aria-label="Hazard distribution pie chart">
        <h3 className="context-chart-panel__title">Hazard Distribution</h3>
        <p className="chart-context-note">
          {hasHazardData
            ? `${formatCount(totalHazardIncidents)} incidents tracked. Top hazard: ${topHazard.name} (${formatCount(topHazard.value)}).`
            : "No hazard incidents available yet."}
        </p>
        {hasHazardData ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={hazardData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={82}
                label
              >
                {hazardData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No hazard breakdown available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Wrong-way severity bar chart">
        <h3 className="context-chart-panel__title">Wrong-Way Severity</h3>
        <p className="chart-context-note">
          {hasSeverityData
            ? `${formatCount(totalWrongWayIncidents)} wrong-way incidents distributed by severity.`
            : "No wrong-way severity distribution available yet."}
        </p>
        {hasSeverityData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={severityData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
              <Bar dataKey="count" name="Wrong-way Cases" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No wrong-way severity data available.</div>
        )}
      </div>
    </div>
  );
}
