import { useState } from "react";
import { motion } from "framer-motion";
import CsvUploader from "@/components/CsvUploader";
import InsightCards from "@/components/InsightCards";
import DashboardCharts from "@/components/DashboardCharts";
import { AccidentRecord, sampleAccidents, generateInsights } from "@/data/sampleData";

export default function InsightsPage() {
  const [data, setData] = useState<AccidentRecord[]>(sampleAccidents);
  const [usingCustom, setUsingCustom] = useState(false);
  const insights = generateInsights(data);

  const handleDataLoaded = (newData: AccidentRecord[]) => {
    setData(newData);
    setUsingCustom(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <motion.h2 className="font-display text-2xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          AI Insights Engine
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">Upload your data or explore sample insights</p>
      </div>

      <CsvUploader onDataLoaded={handleDataLoaded} />

      {usingCustom && (
        <motion.p className="text-xs text-neon-green" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ✓ Analyzing your uploaded dataset ({data.length} records)
        </motion.p>
      )}

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Pattern Analysis</h3>
        <InsightCards insights={insights} />
      </div>

      <DashboardCharts data={data} />
    </div>
  );
}
