import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Insight {
  text: string;
  type: 'danger' | 'warning' | 'info';
}

const typeConfig = {
  danger: { icon: AlertTriangle, color: "var(--neon-red)", borderColor: "hsl(var(--neon-red) / 0.4)" },
  warning: { icon: AlertCircle, color: "var(--neon-amber)", borderColor: "hsl(var(--neon-amber) / 0.4)" },
  info: { icon: Info, color: "var(--neon-cyan)", borderColor: "hsl(var(--neon-cyan) / 0.4)" },
};

export default function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const config = typeConfig[insight.type];
        const Icon = config.icon;
        return (
          <motion.div
            key={i}
            className="insight-card"
            style={{ borderLeftColor: config.borderColor }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: `hsl(${config.color})` }} />
              <p className="text-sm text-secondary-foreground">{insight.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
