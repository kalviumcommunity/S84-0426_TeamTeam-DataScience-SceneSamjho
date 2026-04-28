import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, Settings, BarChart3, Database, X } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  return (
    <aside className="w-72 h-full shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
      <div className="p-6 border-b border-slate-800 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SceneSamjho</h1>
            <p className="text-[10px] text-indigo-400 mt-0.5 uppercase tracking-widest font-bold">Data Hub</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="px-3 mb-4 mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Platform
        </div>
        
        <NavLink
          to="/admin"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-indigo-500/10 text-indigo-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`
          }
        >
          <FilePlus2 className={`w-5 h-5 transition-transform group-hover:scale-110`} />
          <span>New Report</span>
        </NavLink>
        
        <NavLink
          to="/analytics"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-indigo-500/10 text-indigo-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`
          }
        >
          <BarChart3 className={`w-5 h-5 transition-transform group-hover:scale-110`} />
          <span>Analytics</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button className="flex items-center space-x-3 text-sm text-slate-400 hover:text-white px-4 py-3 w-full rounded-xl hover:bg-slate-800/50 transition-all group">
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
