import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const weatherOptions = ["Clear", "Rain", "Fog", "Snow", "Hail"];
const roadOptions = ["Highway", "Urban", "Rural"];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

// Simple client-side "prediction" based on weighted heuristics from sample data patterns
function predictAccidentProbability(hour: number, weather: string, roadType: string): number {
  let base = 15;
  // Time weights
  if (hour >= 22 || hour <= 5) base += 30;
  else if (hour >= 17 && hour <= 21) base += 15;
  else if (hour >= 7 && hour <= 9) base += 10;
  // Weather
  if (weather === "Rain") base += 20;
  else if (weather === "Fog") base += 25;
  else if (weather === "Snow") base += 30;
  else if (weather === "Hail") base += 15;
  // Road type
  if (roadType === "Highway") base += 15;
  else if (roadType === "Rural") base += 10;
  return Math.min(base, 95);
}

export default function PredictionForm() {
  const [hour, setHour] = useState(8);
  const [weather, setWeather] = useState("Clear");
  const [roadType, setRoadType] = useState("Urban");
  const [result, setResult] = useState<number | null>(null);

  const handlePredict = () => {
    const prob = predictAccidentProbability(hour, weather, roadType);
    setResult(prob);
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        Accident Risk Predictor
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Time of Day</label>
          <select
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value))}
          >
            {timeSlots.map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Weather Condition</label>
          <select
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          >
            {weatherOptions.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Road Type</label>
          <select
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={roadType}
            onChange={(e) => setRoadType(e.target.value)}
          >
            {roadOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={handlePredict}
        className="w-full bg-primary text-primary-foreground font-display text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Predict Risk
      </button>

      {result !== null && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xs text-muted-foreground mb-2">Estimated Accident Probability</p>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(220, 14%, 18%)" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none"
                stroke={result > 60 ? "hsl(0, 72%, 51%)" : result > 35 ? "hsl(38, 92%, 50%)" : "hsl(150, 80%, 45%)"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(result / 100) * 327} 327`}
                initial={{ strokeDasharray: "0 327" }}
                animate={{ strokeDasharray: `${(result / 100) * 327} 327` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-foreground">{result}%</span>
            </div>
          </div>
          <p className="text-xs mt-3 text-muted-foreground">
            {result > 60 ? "⚠️ High risk — deploy additional safety measures" :
             result > 35 ? "⚡ Moderate risk — exercise caution" :
             "✅ Low risk — standard protocols sufficient"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
