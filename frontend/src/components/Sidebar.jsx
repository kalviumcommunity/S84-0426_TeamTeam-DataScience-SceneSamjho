import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">SceneSamjho</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Data Science Portal</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main Menu
        </div>
        
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <FilePlus2 className="w-5 h-5" />
          <span>New Report</span>
        </NavLink>
        
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-100 shrink-0">
        <button className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 px-3 py-2.5 w-full rounded-lg hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
