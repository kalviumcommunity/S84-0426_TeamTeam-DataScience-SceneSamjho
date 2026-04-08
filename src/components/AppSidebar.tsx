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
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold gradient-text">ACCIDENT</h1>
            <p className="font-display text-xs text-primary">INSIGHT ENGINE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto pulse-dot"
                    layoutId="nav-indicator"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="pulse-dot" />
            <span className="text-xs text-neon-green">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
