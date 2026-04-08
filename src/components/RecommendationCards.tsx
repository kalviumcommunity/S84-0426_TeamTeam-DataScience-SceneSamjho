import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const priorityColors = {
  high: { bg: "hsl(var(--neon-red) / 0.1)", text: "text-neon-red", label: "HIGH" },
  medium: { bg: "hsl(var(--neon-amber) / 0.1)", text: "text-neon-amber", label: "MEDIUM" },
  low: { bg: "hsl(var(--neon-green) / 0.1)", text: "text-neon-green", label: "LOW" },
};

export default function RecommendationCards({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((rec, i) => {
        const p = priorityColors[rec.priority];
        return (
          <motion.div
            key={i}
            className="glass-card p-5 hover:neon-glow transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span
                  className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${p.text}`}
                  style={{ background: p.bg }}
                >
                  {p.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-1">{rec.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
