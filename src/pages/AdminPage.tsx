import { motion } from "framer-motion";
import { Database, Users, FileText, Settings } from "lucide-react";
import { sampleAccidents, getZoneDistribution } from "@/data/sampleData";

export default function AdminPage() {
  const zones = getZoneDistribution(sampleAccidents);

  return (
    <div className="space-y-8">
      <div>
        <motion.h2 className="font-display text-2xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Admin Panel
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">Manage datasets and system configuration</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Database, label: "Datasets", value: "1 active", desc: "20 records loaded" },
          { icon: Users, label: "Users", value: "—", desc: "Auth not configured" },
          { icon: FileText, label: "Reports", value: "0", desc: "No exports yet" },
          { icon: Settings, label: "System", value: "Online", desc: "All services running" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <item.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-display text-lg font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Zone Summary</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 text-left">Zone</th>
              <th className="py-2 text-left">Total Accidents</th>
              <th className="py-2 text-left">Severe/Fatal</th>
              <th className="py-2 text-left">Total Casualties</th>
              <th className="py-2 text-left">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(z => (
              <tr key={z.zone} className="border-b border-border/50">
                <td className="py-2 font-display text-primary">{z.zone}</td>
                <td className="py-2">{z.total}</td>
                <td className="py-2">{z.severe}</td>
                <td className="py-2">{z.casualties}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    z.casualties > 10 ? 'bg-neon-red/10 text-neon-red' :
                    z.casualties > 5 ? 'bg-neon-amber/10 text-neon-amber' :
                    'bg-neon-green/10 text-neon-green'
                  }`}>
                    {z.casualties > 10 ? 'HIGH' : z.casualties > 5 ? 'MEDIUM' : 'LOW'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
