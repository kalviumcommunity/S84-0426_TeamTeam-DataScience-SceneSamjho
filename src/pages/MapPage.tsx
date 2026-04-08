import { motion } from "framer-motion";
import AccidentMap from "@/components/AccidentMap";
import { sampleAccidents } from "@/data/sampleData";

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <motion.h2 className="font-display text-2xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Accident Map
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">Interactive visualization of accident locations and severity</p>
      </div>

      <div className="flex gap-4 text-xs">
        {[
          { label: "Minor", color: "#00e5a0" },
          { label: "Moderate", color: "#f5a623" },
          { label: "Severe", color: "#ff6b6b" },
          { label: "Fatal", color: "#ff0055" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      <AccidentMap data={sampleAccidents} />
    </div>
  );
}
