import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export default function RecommendationCards({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {recommendations.map((rec, i) => (
        <motion.div
          key={i}
          className="glass-card p-4 group cursor-pointer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full badge-${rec.priority}`}>
                {rec.priority.toUpperCase()}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-1">{rec.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
