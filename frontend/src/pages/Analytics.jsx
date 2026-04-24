import React from 'react';
import { LineChart, Activity, TrendingUp, AlertOctagon, Car, ActivitySquare, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl shadow-lg shadow-emerald-200">
            <LineChart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Command Center</h2>
            <p className="text-slate-500 mt-1 font-medium text-lg">Real-time macro insights and model predictions.</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-white/60 border border-slate-200 px-6 py-3 rounded-2xl backdrop-blur-md shadow-sm">
          <ActivitySquare className="w-5 h-5 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-700 tracking-wider uppercase">Live Sync: Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Incidents', value: '1,248', trend: '+14%', color: 'from-blue-500 to-indigo-500', icon: AlertOctagon },
          { label: 'Severe Cases', value: '312', trend: '-2%', color: 'from-red-500 to-orange-500', icon: Activity },
          { label: 'Vehicles Involved', value: '2,940', trend: '+21%', color: 'from-purple-500 to-violet-500', icon: Car },
          { label: 'Injuries Reported', value: '845', trend: '+5%', color: 'from-pink-500 to-rose-500', icon: Users },
        ].map((kpi, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-full transition-opacity pointer-events-none`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                {kpi.trend}
              </div>
            </div>
            <div>
              <h4 className="text-slate-400 font-bold text-sm tracking-wider uppercase mb-1">{kpi.label}</h4>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 min-h-[400px] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="relative z-10 flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
              <h3 className="text-xl font-bold text-slate-800">Incident Frequency (YTD)</h3>
              <select className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-600 rounded-lg px-4 py-2 outline-none hover:border-indigo-300 transition-colors cursor-pointer">
                <option>This Year</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 opacity-70">
              <Activity className="w-16 h-16 text-indigo-200 mb-4 animate-pulse" />
              <p className="text-slate-500 font-medium text-lg max-w-md">Timeseries visualization node integrating with ML backend...</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Secondary Stats */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/10 text-white relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 relative z-10">Severity Breakdown</h3>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Critical', percent: 12, color: 'bg-red-500' },
                { label: 'Severe', percent: 24, color: 'bg-orange-500' },
                { label: 'Moderate', percent: 45, color: 'bg-blue-500' },
                { label: 'Minor', percent: 19, color: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-300 tracking-wide uppercase">{item.label}</span>
                    <span className="text-white">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`${item.color} h-2.5 rounded-full relative overflow-hidden`} style={{ width: `${item.percent}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
