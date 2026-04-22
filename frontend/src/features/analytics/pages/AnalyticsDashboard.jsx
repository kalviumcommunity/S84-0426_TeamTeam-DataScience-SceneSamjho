import { useEffect, useState } from "react";
import "../styles/analytics.css";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { KpiCards } from "../components/KpiCards";
import { TimeSeriesTrendChart } from "../components/TimeSeriesTrendChart";
import { IndianContextCharts } from "../components/IndianContextCharts";
import { fetchAnalyticsSnapshot } from "../services/analyticsApi";

const POLLING_INTERVAL_MS = 60000;

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [contextData, setContextData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadAnalytics() {
      try {
        if (isActive) {
          setError("");
        }

        const snapshot = await fetchAnalyticsSnapshot();

        if (!isActive) {
          return;
        }

        setKpis(snapshot.kpis);
        setTrendData(snapshot.trendData);
        setContextData(snapshot.contextData);
      } catch (requestError) {
        if (isActive) {
          setError("Analytics API unavailable. Showing fallback where possible.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();
    const intervalId = setInterval(loadAnalytics, POLLING_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, []);

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
          <KpiCards data={kpis} isLoading={isLoading} error={error} />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--trend"
          title="Accident Trend by Time"
          description="Line chart area for morning, afternoon, evening, and night trends"
        >
          <TimeSeriesTrendChart data={trendData} isLoading={isLoading} error={error} />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--context"
          title="Indian Context Correlations"
          description="Pie and bar charts for wrong-way, potholes, and severity context"
        >
          <IndianContextCharts data={contextData} isLoading={isLoading} error={error} />
        </AnalyticsSection>
      </section>
    </main>
  );
}
