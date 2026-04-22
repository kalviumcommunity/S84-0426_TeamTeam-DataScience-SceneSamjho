import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-indigo-600">SceneSamjho</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
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
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
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
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            A
          </div>
          <span>Admin User</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
