import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const FALLBACK_TREND_DATA = [
  {
    timeBucket: "Morning (6AM-12PM)",
    Minor: 42,
    Major: 30,
    Fatal: 12,
    total: 84,
  },
  {
    timeBucket: "Afternoon (12PM-4PM)",
    Minor: 36,
    Major: 29,
    Fatal: 10,
    total: 75,
  },
  {
    timeBucket: "Evening (4PM-8PM)",
    Minor: 55,
    Major: 34,
    Fatal: 14,
    total: 103,
  },
  {
    timeBucket: "Night (8PM-6AM)",
    Minor: 48,
    Major: 38,
    Fatal: 16,
    total: 102,
  },
];

const LINE_STYLES = {
  total: { color: "#2563eb", width: 3 },
  Fatal: { color: "#dc2626", width: 2 },
  Major: { color: "#f59e0b", width: 2 },
  Minor: { color: "#16a34a", width: 2 },
};

const TIME_BUCKET_ORDER = [
  "Morning (6AM-12PM)",
  "Afternoon (12PM-4PM)",
  "Evening (4PM-8PM)",
  "Night (8PM-6AM)",
];

const TIME_BUCKET_INDEX = TIME_BUCKET_ORDER.reduce((acc, bucket, index) => {
  acc[bucket] = index;
  return acc;
}, {});

function normalizeTrendData(data, useFallback = false) {
  if (!Array.isArray(data) || data.length === 0) {
    if (useFallback) {
      return FALLBACK_TREND_DATA;
    }

    return [];
  }

  const normalized = data.map((entry) => ({
    ...entry,
    timeBucket: entry.timeBucket || entry.time_bucket || "Unknown",
  }));

  normalized.sort((a, b) => {
    const aIndex = TIME_BUCKET_INDEX[a.timeBucket];
    const bIndex = TIME_BUCKET_INDEX[b.timeBucket];

    const safeA = Number.isInteger(aIndex) ? aIndex : Number.MAX_SAFE_INTEGER;
    const safeB = Number.isInteger(bIndex) ? bIndex : Number.MAX_SAFE_INTEGER;

    return safeA - safeB;
  });

  return normalized;
}

export function TimeSeriesTrendChart({ data = [], isLoading = false, error = "" }) {
  if (isLoading) {
    return <div className="chart-state">Loading time-series trend…</div>;
  }

  const showFallback = Boolean(error);
  const chartData = normalizeTrendData(data, showFallback);

  if (!chartData.length) {
    return <div className="chart-state">No trend data available yet.</div>;
  }

  const availableKeys = ["total", "Fatal", "Major", "Minor"].filter((key) =>
    chartData.some((entry) => typeof entry[key] === "number")
  );

  if (!availableKeys.length) {
    return <div className="chart-state">Trend format is invalid.</div>;
  }

  return (
    <div className="time-series-chart" aria-label="Accident trend line chart">
      {showFallback ? <p className="chart-inline-note">{error}</p> : null}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeBucket" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value, name) => [`${value} accidents`, name]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          {availableKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key === "total" ? "Total Accidents" : key}
              stroke={LINE_STYLES[key]?.color || "#3b82f6"}
              strokeWidth={LINE_STYLES[key]?.width || 2}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
