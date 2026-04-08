import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Insight {
  text: string;
  type: 'danger' | 'warning' | 'info';
}

const typeConfig = {
  danger: { icon: AlertTriangle, badge: "badge-danger" },
  warning: { icon: AlertCircle, badge: "badge-warning" },
  info: { icon: Info, badge: "badge-info" },
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
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${config.badge}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{insight.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
