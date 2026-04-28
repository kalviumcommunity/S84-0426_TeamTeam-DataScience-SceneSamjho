import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 lg:hidden truncate">SceneSamjho</h2>
        
        <div className="hidden lg:flex items-center bg-slate-100/80 px-4 py-2.5 rounded-xl border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white focus-within:shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all min-w-[280px] w-96 max-w-full">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search reports or metrics..." 
            className="bg-transparent border-none outline-none ml-3 w-full text-sm placeholder-slate-400 text-slate-700 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 shrink-0">
        <div className="relative cursor-pointer group">
          <div className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </div>
          <button className="text-slate-400 group-hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100">
            <Bell className="w-6 h-6" />
          </button>
        </div>
        
        <div className="w-px h-8 bg-slate-200" />
        
        <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
            A
          </div>
          <div className="hidden md:flex flex-col pr-2">
            <span className="text-sm font-bold text-slate-800 leading-tight">Admin User</span>
            <span className="text-xs font-semibold text-slate-500">System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;