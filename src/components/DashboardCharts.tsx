import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AccidentRecord, getTimeDistribution, getWeatherDistribution, getRoadTypeDistribution } from "@/data/sampleData";

const COLORS = [
  "hsl(187, 100%, 45%)",
  "hsl(230, 80%, 60%)",
  "hsl(270, 70%, 55%)",
  "hsl(150, 80%, 45%)",
  "hsl(38, 92%, 50%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 18%, 12%)",
  border: "1px solid hsl(220, 14%, 25%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 92%)",
  fontSize: "12px",
};

interface DashboardChartsProps {
  data: AccidentRecord[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const timeData = getTimeDistribution(data);
  const weatherData = getWeatherDistribution(data);
  const roadData = getRoadTypeDistribution(data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Line Chart - Accidents by Time */}
      <motion.div
        className="chart-container lg:col-span-2 xl:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Accidents by Hour</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="hour" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="accidents"
              stroke="hsl(187, 100%, 45%)"
              strokeWidth={2}
              dot={{ fill: "hsl(187, 100%, 45%)", r: 3 }}
              activeDot={{ r: 6, stroke: "hsl(187, 100%, 45%)", strokeWidth: 2, fill: "hsl(220, 18%, 10%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart - Road Types */}
      <motion.div
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">By Road Type</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={roadData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="count"
              nameKey="roadType"
            >
              {roadData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "hsl(215, 12%, 50%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar Chart - Weather */}
      <motion.div
        className="chart-container lg:col-span-2 xl:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Accidents by Weather Condition</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weatherData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="weather" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {weatherData.map((_, index) => (
                <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
