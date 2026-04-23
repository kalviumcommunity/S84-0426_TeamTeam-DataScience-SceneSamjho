import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Persistent Sidebar */}
      <div className="hidden md:flex w-64 shrink-0">
        <Sidebar h-full />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Top Navbar */}
        <Navbar />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;