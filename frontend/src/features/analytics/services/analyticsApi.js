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

  const [kpis, trendData, contextData] = await Promise.all([
    parseResponse(kpisResponse, "KPI data"),
    parseResponse(trendsResponse, "trend data"),
    parseResponse(contextResponse, "Indian context data"),
  ]);

  return {
    kpis: kpis || {},
    trendData: Array.isArray(trendData) ? trendData : [],
    contextData: contextData || {},
  };
}
