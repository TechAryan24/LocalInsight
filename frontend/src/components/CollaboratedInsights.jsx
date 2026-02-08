import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Wallet,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';

const CollaboratedInsights = ({ locations }) => {
  if (!locations || locations.length === 0) return null;

  // Group by City for metadata
  const cityCounts = locations.reduce((acc, loc) => {
    const city = loc.City || loc.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Group by District
  const districtCounts = locations.reduce((acc, loc) => {
    const dist = loc.District || 'Unknown';
    acc[dist] = (acc[dist] || 0) + 1;
    return acc;
  }, {});

  const cities = Object.keys(cityCounts);
  const districts = Object.keys(districtCounts).filter(d => d !== 'Unknown');

  const isSingleCity = cities.length === 1;
  const isSingleDistrict = districts.length === 1;
  const primaryDistrict = isSingleDistrict ? districts[0] : null;

  let displayTitle = "Comparative Regional Analysis";
  let displaySubtitle = `Aggregate insights for ${cities.length} Cities • ${locations.length} Strategic Zones`;

  if (isSingleCity) {
    displayTitle = `${cities[0]} Market Overview`;
    displaySubtitle = `Regional Intelligence Report for ${cities[0]} • ${locations.length} Zones`;
  } else if (isSingleDistrict) {
    displayTitle = `${primaryDistrict} District Intelligence`;
    displaySubtitle = `Combined analysis for ${cities.length} Cities across ${primaryDistrict}`;
  }

  // Aggregated Stats (All locations)
  const avgScore = locations.reduce((acc, l) => acc + (parseFloat(l.opportunity_score) || 0), 0) / (locations.length || 1);
  const totalFootfall = locations.reduce((acc, l) => acc + (parseInt(l.FootFalls_per_month) || 0), 0);
  const avgRent = locations.reduce((acc, l) => acc + (parseInt(l.Rent) || 0), 0) / (locations.length || 1);
  const avgIncome = locations.reduce((acc, l) => acc + (parseInt(l.avg_income) || 0), 0) / (locations.length || 1);

  return (
    <div className="mt-12 space-y-8 pb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">
              {displayTitle}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {displaySubtitle}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 uppercase text-[10px] font-bold tracking-widest text-slate-400">
          <BarChart3 className="w-3 h-3 text-indigo-500" />
          Real-time Intelligence
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="Market Potential"
          value={(avgScore).toFixed(3)}
          subValue="Avg. Opportunity Score"
          color="emerald"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-indigo-400" />}
          label="Regional Traffic"
          value={totalFootfall.toLocaleString()}
          subValue="Total Monthly Footfall"
          color="indigo"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          label="Economic Level"
          value={`₹${Math.round(avgIncome / 1000)}k`}
          subValue="Avg. Household Income"
          color="purple"
        />
        <StatCard
          icon={<LayoutGrid className="w-5 h-5 text-amber-400" />}
          label="Space Value"
          value={`₹${Math.round(avgRent).toLocaleString()}`}
          subValue="Average Monthly Rent"
          color="amber"
        />
      </div>

      {/* Main Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Footfall Comparison Chart */}
        <div className="lg:col-span-2 bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center justify-between">
              Zone Footfall Comparison
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">Normalized Units</span>
            </h3>

            <div className="space-y-6">
              {[...locations].sort((a, b) => (b.FootFalls_per_month || 0) - (a.FootFalls_per_month || 0)).slice(0, 5).map((loc, i) => {
                const maxFootfall = Math.max(...locations.map(l => l.FootFalls_per_month || 1));
                const percentage = ((loc.FootFalls_per_month || 0) / maxFootfall) * 100;

                return (
                  <motion.div
                    key={i}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors capitalize">
                        {loc.Area || loc.City || 'Main Zone'}
                        {!isSingleCity && loc.City && <span className="text-[10px] text-slate-600 block">{loc.City}</span>}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">{parseInt(loc.FootFalls_per_month).toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden flex items-center px-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        className={`h-1.5 rounded-full bg-gradient-to-r ${i === 0 ? 'from-indigo-600 to-purple-400' :
                          i === 1 ? 'from-purple-600 to-indigo-400' :
                            'from-slate-700 to-slate-500'
                          }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Score Distribution (Pie/Radial alternative) */}
        <div className="bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-6">Market Health Index</h3>

            <div className="relative flex flex-col items-center py-4">
              <div className="w-48 h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none" stroke="currentColor" strokeWidth="8"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * Math.min(avgScore, 1)) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                  />
                </svg>
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-black text-white"
                  >
                    {Math.round(avgScore * 100)}%
                  </motion.div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Viability</div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <HealthMetric label="Saturation" value="Low Risk" color="emerald" />
              <HealthMetric label="Competition" value="Balanced" color="amber" />
              <HealthMetric label="Growth Rate" value="Positive" color="indigo" />
            </div>
          </div>

          <button className="mt-8 w-full py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all">
            Unlock Full Depth Metrics
          </button>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }) => (
  <div className="bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:translate-y-[-4px] transition-all duration-300">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</h4>
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{subValue}</p>
    </div>
  </div>
);

const HealthMetric = ({ label, value, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
    <span className="text-xs font-bold text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
      <span className={`text-xs font-black text-${color}-400 uppercase tracking-tighter`}>{value}</span>
    </div>
  </div>
);

export default CollaboratedInsights;
