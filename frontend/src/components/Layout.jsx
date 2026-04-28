import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-500/30 relative relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Persistent Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-72 shrink-0 z-50 shadow-xl shadow-slate-900/5 flex flex-col bg-slate-900 h-full`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Persistent Top Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full flex flex-col relative max-w-full">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none z-0"></div>
          <div className="flex-1 relative z-10 w-full p-3 sm:p-5 md:p-8">
            <Outlet />
          </div>
          <div className="relative z-10">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;