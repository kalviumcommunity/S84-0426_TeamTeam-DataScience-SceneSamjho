import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  delay?: number;
  color?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, delay = 0, color = "var(--primary)" }: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-display font-bold mt-1.5 text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? 'text-emerald' : 'text-rose'}`}>
              {trend.positive ? '↓' : '↑'} {Math.abs(trend.value)}% vs last month
            </p>
          )}
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `hsl(${color} / 0.1)` }}
        >
          <Icon className="w-4 h-4" style={{ color: `hsl(${color})` }} />
        </div>
      </div>
    </motion.div>
  );
}
