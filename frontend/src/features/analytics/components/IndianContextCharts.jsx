import { memo, useMemo } from "react";
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

const CHART_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6"];
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

function getVehicleTypeData(data) {
  const source = data.vehicle_types || {};
  return Object.keys(source)
    .map((type) => ({ name: String(type).trim(), value: Number(source[type]) || 0 }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
}

function getAgeDistributionData(data) {
  const source = data.age_distribution || {};
  return Object.keys(source)
    .map((ageGroup) => ({ ageGroup: String(ageGroup), count: Number(source[ageGroup]) || 0 }))
    .filter((entry) => entry.count > 0);
}

function getSafetyGearData(data) {
  const source = data.safety_gear_impact || {};
  return Object.keys(source)
    .map((gearStatus) => {
      const severities = source[gearStatus];
      return {
        gearStatus: String(gearStatus),
        Fatal: Number(severities.Fatal) || 0,
        Major: Number(severities.Major) || 0,
        Minor: Number(severities.Minor) || 0,
      };
    });
}

function getAmbulanceEtaData(data) {
  const source = data.ambulance_eta_dist || {};
  return Object.keys(source)
    .map((eta) => ({ name: String(eta).trim(), value: Number(source[eta]) || 0 }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
}

function getTopHazard(hazardData) {
  return hazardData.reduce(
    (top, item) => (item.value > top.value ? item : top),
    { name: "N/A", value: 0 }
  );
}

export const IndianContextCharts = memo(function IndianContextCharts({
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

  const hazardData = useMemo(() => getHazardBreakdown(data), [data]);
  const severityData = useMemo(() => getWrongWaySeverityData(data), [data]);
  const weatherData = useMemo(() => getWeatherImpactData(data), [data]);
  
  const vehicleData = useMemo(() => getVehicleTypeData(data), [data]);
  const ageData = useMemo(() => getAgeDistributionData(data), [data]);
  const safetyData = useMemo(() => getSafetyGearData(data), [data]);
  const ambulanceData = useMemo(() => getAmbulanceEtaData(data), [data]);

  const hasHazardData = hazardData.some((item) => item.value > 0);
  const hasSeverityData = severityData.length > 0;
  const hasWeatherData = weatherData.length > 0;
  const hasVehicleData = vehicleData.length > 0;
  const hasAgeData = ageData.length > 0;
  const hasSafetyData = safetyData.length > 0;
  const hasAmbulanceData = ambulanceData.length > 0;

  const topHazard = useMemo(() => getTopHazard(hazardData), [hazardData]);
  const totalHazardIncidents = useMemo(() => hazardData.reduce((sum, item) => sum + item.value, 0), [hazardData]);
  const totalWrongWayIncidents = useMemo(() => severityData.reduce((sum, item) => sum + item.count, 0), [severityData]);

  if (!hasHazardData && !hasSeverityData && !hasWeatherData && !hasVehicleData) {
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
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
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
              <Bar 
                dataKey="count" 
                name="Wrong-way Cases" 
                fill="#7c3aed" 
                radius={[8, 8, 0, 0]} 
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No wrong-way severity data available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Weather impact bar chart">
        <h3 className="context-chart-panel__title">Weather Impact</h3>
        <p className="chart-context-note">
          {hasWeatherData
            ? `Breakdown of accidents by weather condition.`
            : "No weather impact data available yet."}
        </p>
        {hasWeatherData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weatherData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weather" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Weather Conditions" 
                fill="#2dd4bf" 
                radius={[8, 8, 0, 0]} 
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No weather data available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Vehicle type distribution pie chart">
        <h3 className="context-chart-panel__title">Vehicle Types Involved</h3>
        <p className="chart-context-note">
          {hasVehicleData ? "Percentage of accidents by specific vehicle type." : "No vehicle data available."}
        </p>
        {hasVehicleData ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={vehicleData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={82} 
                label
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {vehicleData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No vehicle distribution available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Driver Age Demographics bar chart">
        <h3 className="context-chart-panel__title">Driver Age Groups</h3>
        <p className="chart-context-note">
          {hasAgeData ? "Number of incidents categorized by age bracket." : "No age data available."}
        </p>
        {hasAgeData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ageData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Drivers" 
                fill="#f59e0b" 
                radius={[8, 8, 0, 0]} 
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No demographic data available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Safety gear vs severity stacked bar chart">
        <h3 className="context-chart-panel__title">Safety Gear vs Severity</h3>
        <p className="chart-context-note">
          {hasSafetyData ? "Difference in severity whether helmets/seatbelts were worn or ignored." : "No safety gear impact data available."}
        </p>
        {hasSafetyData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={safetyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gearStatus" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Fatal" stackId="a" fill="#dc2626" animationBegin={0} animationDuration={1000} />
              <Bar dataKey="Major" stackId="a" fill="#f59e0b" animationBegin={0} animationDuration={1000} />
              <Bar dataKey="Minor" stackId="a" fill="#22c55e" animationBegin={0} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No safety comparison available.</div>
        )}
      </div>

      <div className="context-chart-panel" aria-label="Emergency response donut chart">
        <h3 className="context-chart-panel__title">Emergency ETA</h3>
        <p className="chart-context-note">
          {hasAmbulanceData ? "Ambulance arrival times across all incidents." : "No ambulance ETA data available."}
        </p>
        {hasAmbulanceData ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={ambulanceData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={50} 
                outerRadius={82} 
                label
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {ambulanceData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${formatCount(value)} incidents`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="context-chart-panel__empty">No emergency eta data available.</div>
        )}
      </div>

    </div>
  );
});
