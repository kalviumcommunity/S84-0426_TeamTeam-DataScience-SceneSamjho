import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Brain, Map, Upload, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: BarChart3, label: "Dashboard" },
  { to: "/insights", icon: Brain, label: "AI Insights" },
  { to: "/map", icon: Map, label: "Map View" },
  { to: "/upload", icon: Upload, label: "Upload Data" },
  { to: "/predictions", icon: Activity, label: "Predictions" },
  { to: "/admin", icon: Shield, label: "Admin Panel" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold text-foreground tracking-tight">Accident</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Insight Engine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3">
          <div className="pulse-dot" />
          <span className="text-xs text-muted-foreground">System operational</span>
        </div>
      </div>
    </aside>
  );
}
