import "../styles/analytics.css";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

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
          <PlaceholderPanel label="KPI Cards Placeholder" minHeight={160} />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--trend"
          title="Accident Trend by Time"
          description="Line chart area for morning, afternoon, evening, and night trends"
        >
          <PlaceholderPanel label="Time-Series Chart Placeholder" minHeight={320} />
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
