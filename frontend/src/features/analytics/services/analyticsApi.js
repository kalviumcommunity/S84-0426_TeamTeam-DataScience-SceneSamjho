const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const DEFAULT_ANALYTICS_REQUEST_TIMEOUT_MS = 12000;
const EMPTY_ANALYTICS_SNAPSHOT = {
  kpis: {},
  trendData: [],
  contextData: {},
};

function resolvePreviousSnapshot(previousSnapshot) {
  if (!previousSnapshot || typeof previousSnapshot !== "object") {
    return EMPTY_ANALYTICS_SNAPSHOT;
  }

  return {
    kpis:
      previousSnapshot.kpis && typeof previousSnapshot.kpis === "object"
        ? previousSnapshot.kpis
        : {},
    trendData: Array.isArray(previousSnapshot.trendData)
      ? previousSnapshot.trendData
      : [],
    contextData:
      previousSnapshot.contextData && typeof previousSnapshot.contextData === "object"
        ? previousSnapshot.contextData
        : {},
  };
}

function resolveTimeoutMs() {
  const configured = Number(import.meta.env.VITE_ANALYTICS_REQUEST_TIMEOUT_MS);

  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_ANALYTICS_REQUEST_TIMEOUT_MS;
  }

  return Math.floor(configured);
}

const ANALYTICS_REQUEST_TIMEOUT_MS = resolveTimeoutMs();

function getRequestTimeoutError(endpointName) {
  return new Error(`Timed out while fetching ${endpointName}`);
}

async function fetchWithTimeout(url, endpointName) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(getRequestTimeoutError(endpointName)), ANALYTICS_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseResponse(response, endpointName) {
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpointName}`);
  }

  return response.json();
}

export async function fetchAnalyticsSnapshot(previousSnapshot = EMPTY_ANALYTICS_SNAPSHOT) {
  const previous = resolvePreviousSnapshot(previousSnapshot);

  const endpointRequests = [
    {
      key: "kpis",
      label: "KPI data",
      panelName: "KPI cards",
      request: () => fetchWithTimeout(`${API_BASE_URL}/analytics/kpis`, "KPI data"),
      fallback: previous.kpis,
      normalize: (value) => (value && typeof value === "object" ? value : {}),
    },
    {
      key: "trendData",
      label: "trend data",
      panelName: "trend chart",
      request: () => fetchWithTimeout(`${API_BASE_URL}/analytics/trends`, "trend data"),
      fallback: previous.trendData,
      normalize: (value) => (Array.isArray(value) ? value : []),
    },
    {
      key: "contextData",
      label: "Indian context data",
      panelName: "context charts",
      request: () => fetchWithTimeout(`${API_BASE_URL}/analytics/indian-context`, "Indian context data"),
      fallback: previous.contextData,
      normalize: (value) => (value && typeof value === "object" ? value : {}),
    },
  ];

  const settledPayloads = await Promise.allSettled(
    endpointRequests.map(async (endpoint) => {
      const response = await endpoint.request();
      return parseResponse(response, endpoint.label);
    })
  );

  const successCount = settledPayloads.filter((item) => item.status === "fulfilled").length;

  if (successCount === 0) {
    throw new Error("Failed to fetch all analytics endpoints");
  }

  const failedPanels = settledPayloads.reduce((acc, result, index) => {
    if (result.status === "rejected") {
      acc.push(endpointRequests[index].panelName);
    }

    return acc;
  }, []);

  const warning =
    successCount < 3
      ? `Some analytics panels could not be refreshed (${failedPanels.join(", "
      )}). Showing latest available fallback values.`
      : "";

  const snapshot = endpointRequests.reduce((acc, endpoint, index) => {
    const result = settledPayloads[index];

    acc[endpoint.key] =
      result.status === "fulfilled"
        ? endpoint.normalize(result.value)
        : endpoint.fallback;

    return acc;
  }, {});

  return {
    kpis: snapshot.kpis,
    trendData: snapshot.trendData,
    contextData: snapshot.contextData,
    warning,
  };
}
