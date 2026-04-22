import "../styles/analytics.css";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { PlaceholderPanel } from "../components/PlaceholderPanel";
import { KpiCards } from "../components/KpiCards";
import { TimeSeriesTrendChart } from "../components/TimeSeriesTrendChart";

const KPI_SAMPLE_DATA = {
  total_accidents: 1384,
  total_fatalities: 212,
  top_hazard_weather: "Heavy Rain",
  top_hazard_road: "Potholes",
};

const TREND_SAMPLE_DATA = [
  { timeBucket: "Morning (6AM-12PM)", Minor: 42, Major: 30, Fatal: 12, total: 84 },
  { timeBucket: "Afternoon (12PM-4PM)", Minor: 36, Major: 29, Fatal: 10, total: 75 },
  { timeBucket: "Evening (4PM-8PM)", Minor: 55, Major: 34, Fatal: 14, total: 103 },
  { timeBucket: "Night (8PM-6AM)", Minor: 48, Major: 38, Fatal: 16, total: 102 },
];

export function AnalyticsDashboard() {
  return (
    <main className="analytics-page" aria-label="Analytics dashboard">
      <header className="analytics-page__header">
        <h1>Traffic Analytics Dashboard</h1>
        <p>
          Business intelligence overview for accidents, risk signals, and
          localized road-context trends.
        </p>
      </header>

      <section className="analytics-grid" aria-label="Analytics visualization grid">
        <AnalyticsSection
          className="analytics-section--kpi"
          title="KPI Snapshot"
          description="Top-level cards for accident totals and hazard highlights"
        >
          <KpiCards data={KPI_SAMPLE_DATA} />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--trend"
          title="Accident Trend by Time"
          description="Line chart area for morning, afternoon, evening, and night trends"
        >
          <TimeSeriesTrendChart data={TREND_SAMPLE_DATA} />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--context"
          title="Indian Context Correlations"
          description="Pie and bar charts for wrong-way, potholes, and severity context"
        >
          <div className="analytics-grid__split">
            <PlaceholderPanel label="Pie Chart Placeholder" minHeight={280} />
            <PlaceholderPanel label="Bar Chart Placeholder" minHeight={280} />
          </div>
        </AnalyticsSection>
      </section>
    </main>
  );
}
