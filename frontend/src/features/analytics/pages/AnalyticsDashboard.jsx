import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [nextRefreshInSeconds, setNextRefreshInSeconds] = useState(
    Math.floor(POLLING_INTERVAL_MS / 1000)
  );
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const isMountedRef = useRef(true);

  function formatCountdown(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  const loadAnalytics = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader && isMountedRef.current) {
      setIsLoading(true);
    }

    if (isMountedRef.current) {
      setError("");
      setWarning("");
    }

    try {
      const snapshot = await fetchAnalyticsSnapshot();

      if (!isMountedRef.current) {
        return;
      }

      setKpis(snapshot.kpis);
      setTrendData(snapshot.trendData);
      setContextData(snapshot.contextData);
      setWarning(snapshot.warning || "");
      setLastUpdatedAt(new Date());
      setNextRefreshInSeconds(Math.floor(POLLING_INTERVAL_MS / 1000));
    } catch (requestError) {
      if (isMountedRef.current) {
        setError("Analytics API unavailable. Showing fallback where possible.");
        setWarning("");
      }
    } finally {
      if (!isMountedRef.current) {
        return;
      }

      if (showLoader) {
        setIsLoading(false);
      }

      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadAnalytics({ showLoader: true });
    const intervalId = setInterval(loadAnalytics, POLLING_INTERVAL_MS);
    const tickerId = setInterval(() => {
      setNextRefreshInSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
      clearInterval(tickerId);
    };
  }, [loadAnalytics]);

  function handleManualRefresh() {
    if (isRefreshing || isLoading) {
      return;
    }

    setIsRefreshing(true);
    loadAnalytics();
  }

  const liveStatusText = isLoading
    ? "Loading analytics dashboard"
    : isRefreshing
      ? "Refreshing analytics dashboard"
      : lastUpdatedAt
        ? `Analytics updated at ${lastUpdatedAt.toLocaleTimeString()}`
        : "Waiting for initial analytics sync";

  return (
    <main className="analytics-page" aria-label="Analytics dashboard" aria-busy={isLoading || isRefreshing}>
      <header className="analytics-page__header">
        <h1>Traffic Analytics Dashboard</h1>
        <p>
          Business intelligence overview for accidents, risk signals, and
          localized road-context trends.
        </p>
        <div className="analytics-page__header-actions">
          <button
            type="button"
            className="analytics-refresh-btn"
            onClick={handleManualRefresh}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh now"}
          </button>
          <span className="analytics-last-updated">
            {lastUpdatedAt
              ? `Last updated: ${lastUpdatedAt.toLocaleTimeString()}`
              : "Waiting for first data sync..."}
          </span>
          <span className="analytics-next-refresh">
            Next auto-refresh in {formatCountdown(nextRefreshInSeconds)}
          </span>
        </div>
        {warning ? (
          <div className="analytics-warning-banner" role="status" aria-live="polite">
            {warning}
          </div>
        ) : null}
        <p className="sr-only" role="status" aria-live="polite">
          {liveStatusText}
        </p>
      </header>

      <section className="analytics-grid" aria-label="Analytics visualization grid">
        <AnalyticsSection
          className="analytics-section--kpi"
          title="KPI Snapshot"
          description="Top-level cards for accident totals and hazard highlights"
        >
          <KpiCards
            data={kpis}
            isLoading={isLoading}
            error={error}
            onRetry={handleManualRefresh}
            isRetrying={isRefreshing}
          />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--trend"
          title="Accident Trend by Time"
          description="Line chart area for morning, afternoon, evening, and night trends"
        >
          <TimeSeriesTrendChart
            data={trendData}
            isLoading={isLoading}
            error={error}
            onRetry={handleManualRefresh}
            isRetrying={isRefreshing}
          />
        </AnalyticsSection>

        <AnalyticsSection
          className="analytics-section--context"
          title="Indian Context Correlations"
          description="Pie and bar charts for wrong-way, potholes, and severity context"
        >
          <IndianContextCharts
            data={contextData}
            isLoading={isLoading}
            error={error}
            onRetry={handleManualRefresh}
            isRetrying={isRefreshing}
          />
        </AnalyticsSection>
      </section>
    </main>
  );
}
