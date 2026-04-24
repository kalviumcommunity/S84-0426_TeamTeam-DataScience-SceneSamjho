import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-500/30">
      {/* Persistent Sidebar */}
      <div className="hidden lg:flex w-72 shrink-0 relative z-20 shadow-xl shadow-slate-900/5">
        <Sidebar h-full />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Persistent Top Navbar */}
        <Navbar />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto w-full flex flex-col relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none z-0"></div>
          <div className="flex-1 relative z-10 p-4 md:p-6 lg:p-8">
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