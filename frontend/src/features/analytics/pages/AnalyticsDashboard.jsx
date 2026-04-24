import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/analytics.css";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { KpiCards } from "../components/KpiCards";
import { TimeSeriesTrendChart } from "../components/TimeSeriesTrendChart";
import { IndianContextCharts } from "../components/IndianContextCharts";
import { fetchAnalyticsSnapshot } from "../services/analyticsApi";

const DEFAULT_POLLING_INTERVAL_MS = 60000;
const MIN_POLLING_INTERVAL_MS = 10000;

function resolvePollingIntervalMs() {
  const configured = Number(import.meta.env.VITE_ANALYTICS_POLLING_MS);

  if (!Number.isFinite(configured)) {
    return DEFAULT_POLLING_INTERVAL_MS;
  }

  if (configured <= 0) {
    return 0;
  }

  return Math.max(MIN_POLLING_INTERVAL_MS, Math.floor(configured));
}

const POLLING_INTERVAL_MS = resolvePollingIntervalMs();
const AUTO_REFRESH_ENABLED = POLLING_INTERVAL_MS > 0;

function isPageVisible() {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState === "visible";
}

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [contextData, setContextData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [nextRefreshInSeconds, setNextRefreshInSeconds] = useState(
    AUTO_REFRESH_ENABLED ? Math.floor(POLLING_INTERVAL_MS / 1000) : 0
  );
  const [isAutoRefreshPaused, setIsAutoRefreshPaused] = useState(
    AUTO_REFRESH_ENABLED ? !isPageVisible() : false
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

      if (AUTO_REFRESH_ENABLED) {
        setNextRefreshInSeconds(Math.floor(POLLING_INTERVAL_MS / 1000));
      }
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

    if (AUTO_REFRESH_ENABLED && isMountedRef.current) {
      setIsAutoRefreshPaused(!isPageVisible());
    }

    const intervalId = AUTO_REFRESH_ENABLED
      ? setInterval(() => {
          if (!isPageVisible()) {
            return;
          }

          loadAnalytics();
        }, POLLING_INTERVAL_MS)
      : null;
    const tickerId = AUTO_REFRESH_ENABLED
      ? setInterval(() => {
          if (!isPageVisible()) {
            return;
          }

          setNextRefreshInSeconds((current) => Math.max(0, current - 1));
        }, 1000)
      : null;

    const handleVisibilityChange = () => {
      if (!AUTO_REFRESH_ENABLED || !isMountedRef.current) {
        return;
      }

      const visible = isPageVisible();
      setIsAutoRefreshPaused(!visible);

      if (!visible) {
        return;
      }

      setNextRefreshInSeconds(Math.floor(POLLING_INTERVAL_MS / 1000));
      loadAnalytics();
    };

    if (AUTO_REFRESH_ENABLED && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isMountedRef.current = false;

      if (AUTO_REFRESH_ENABLED && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }

      if (tickerId) {
        clearInterval(tickerId);
      }
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
      : isAutoRefreshPaused
        ? "Auto-refresh is paused while this tab is in the background"
      : lastUpdatedAt
        ? `Analytics updated at ${lastUpdatedAt.toLocaleTimeString()}`
        : "Waiting for initial analytics sync";

  const dashboardStatus = (() => {
    if (isLoading) {
      return {
        label: "Initial sync",
        className: "analytics-status-pill analytics-status-pill--loading",
      };
    }

    if (isRefreshing) {
      return {
        label: "Refreshing",
        className: "analytics-status-pill analytics-status-pill--loading",
      };
    }

    if (error) {
      return {
        label: "Degraded",
        className: "analytics-status-pill analytics-status-pill--error",
      };
    }

    if (warning) {
      return {
        label: "Partial data",
        className: "analytics-status-pill analytics-status-pill--warning",
      };
    }

    if (isAutoRefreshPaused) {
      return {
        label: "Paused",
        className: "analytics-status-pill analytics-status-pill--paused",
      };
    }

    return {
      label: "Healthy",
      className: "analytics-status-pill analytics-status-pill--ok",
    };
  })();

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
          <span className={dashboardStatus.className} role="status" aria-live="polite">
            Status: {dashboardStatus.label}
          </span>
          <span className="analytics-last-updated">
            {lastUpdatedAt
              ? `Last updated: ${lastUpdatedAt.toLocaleTimeString()}`
              : "Waiting for first data sync..."}
          </span>
          <span
            className={
              AUTO_REFRESH_ENABLED
                ? "analytics-next-refresh"
                : "analytics-next-refresh analytics-next-refresh--disabled"
            }
          >
            {AUTO_REFRESH_ENABLED
              ? isAutoRefreshPaused
                ? "Auto-refresh paused (background tab)"
                : `Next auto-refresh in ${formatCountdown(nextRefreshInSeconds)}`
              : "Auto-refresh is disabled (manual refresh only)"}
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
