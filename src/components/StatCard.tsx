import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  delay?: number;
  accentColor?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, delay = 0, accentColor }: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <motion.p
            className="text-3xl font-display font-bold mt-2 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-neon-green' : 'text-neon-red'}`}>
              <span>{trend.positive ? '↓' : '↑'} {Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: accentColor ? `hsl(${accentColor} / 0.1)` : 'hsl(var(--neon-cyan) / 0.1)' }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor ? `hsl(${accentColor})` : 'hsl(var(--neon-cyan))' }} />
        </div>
      </div>
    </motion.div>
  );
}
