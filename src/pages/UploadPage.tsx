import { useState } from "react";
import { motion } from "framer-motion";
import CsvUploader from "@/components/CsvUploader";
import { AccidentRecord, sampleAccidents } from "@/data/sampleData";

export default function UploadPage() {
  const [data, setData] = useState<AccidentRecord[]>([]);

  return (
    <div className="space-y-8">
      <div>
        <motion.h2 className="font-display text-2xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Upload Dataset
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">Import accident CSV data for analysis</p>
      </div>

      <CsvUploader onDataLoaded={setData} />

      {data.length > 0 && (
        <motion.div className="glass-card p-4 overflow-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-display text-sm font-semibold text-foreground mb-3">Preview ({data.length} records)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 px-3 text-left">ID</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Time</th>
                <th className="py-2 px-3 text-left">Weather</th>
                <th className="py-2 px-3 text-left">Road</th>
                <th className="py-2 px-3 text-left">Severity</th>
                <th className="py-2 px-3 text-left">Casualties</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-2 px-3 font-display text-primary">{row.id}</td>
                  <td className="py-2 px-3">{row.date}</td>
                  <td className="py-2 px-3">{row.time}</td>
                  <td className="py-2 px-3">{row.weather}</td>
                  <td className="py-2 px-3">{row.roadType}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.severity === 'Fatal' ? 'bg-neon-red/10 text-neon-red' :
                      row.severity === 'Severe' ? 'bg-neon-amber/10 text-neon-amber' :
                      row.severity === 'Moderate' ? 'bg-neon-blue/10 text-neon-blue' :
                      'bg-neon-green/10 text-neon-green'
                    }`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="py-2 px-3">{row.casualties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
