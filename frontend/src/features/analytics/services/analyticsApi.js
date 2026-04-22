const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function parseResponse(response, endpointName) {
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpointName}`);
  }

  return response.json();
}

export async function fetchAnalyticsSnapshot() {
  const [kpisResponse, trendsResponse, contextResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/analytics/kpis/`),
    fetch(`${API_BASE_URL}/analytics/trends/`),
    fetch(`${API_BASE_URL}/analytics/indian-context/`),
  ]);

  const settledPayloads = await Promise.allSettled([
    parseResponse(kpisResponse, "KPI data"),
    parseResponse(trendsResponse, "trend data"),
    parseResponse(contextResponse, "Indian context data"),
  ]);

  const [kpiResult, trendResult, contextResult] = settledPayloads;

  const successCount = settledPayloads.filter((item) => item.status === "fulfilled").length;

  if (successCount === 0) {
    throw new Error("Failed to fetch all analytics endpoints");
  }

  const warning =
    successCount < 3
      ? "Some analytics panels could not be refreshed. Showing latest available fallback values."
      : "";

  return {
    kpis: kpiResult.status === "fulfilled" && kpiResult.value ? kpiResult.value : {},
    trendData:
      trendResult.status === "fulfilled" && Array.isArray(trendResult.value)
        ? trendResult.value
        : [],
    contextData:
      contextResult.status === "fulfilled" && contextResult.value ? contextResult.value : {},
    warning,
  };
}
