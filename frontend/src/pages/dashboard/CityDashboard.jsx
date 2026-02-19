import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Activity, Zap, Heart, Sparkles, ShieldAlert } from "lucide-react"; // Added new icons
import { useAuth } from "../../context/auth.jsx";
import { motion } from "framer-motion";

import Sidebar from "../../components/Sidebar";
import DashboardMap from "../../components/DashboardMap.jsx";
import DemographicsCard from "../../components/DemographicsCard.jsx";
import FootfallCard from "../../components/FootfallCard.jsx";

function CityDashboard() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const navData = location.state?.predictionData;
    const savedData = JSON.parse(localStorage.getItem("lastPrediction"));

    if (navData) {
      setData(navData);
      localStorage.setItem("lastPrediction", JSON.stringify(navData));
    } else if (savedData) {
      setData(savedData);
    }
  }, [location.state]);

  // Handle Map View if needed (now inline)

  // Sort for Top 3
  const topLocations = [...locations]
    .sort((a, b) => (parseFloat(b.opportunity_score || b.rank_score) || 0) - (parseFloat(a.opportunity_score || a.rank_score) || 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-white">
      <Sidebar data={data} />

      <div className="flex-1 lg:min-h-screen overflow-y-auto p-6 no-scrollbar">
        
        {/* Map Section */}
        <div className="w-full h-[500px] mb-6 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
          <DashboardMap locations={[data]} />
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 backdrop-blur-xl">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Live Geographic Analysis
            </span>
          </div>
        </div>

          <div className="space-y-4">
            {topLocations.map((loc, i) => {
              const score = parseFloat(loc.opportunity_score) || 0;
              const scoreColor = score >= 0.3 ? 'text-yellow-400 border-yellow-500/50 shadow-yellow-500/20' : 'text-red-400 border-red-500/50 shadow-red-500/20';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                  onClick={() => navigate('/dashboard/details', { state: { location: loc } })}
                  className={`relative bg-[#1e1b4b]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:bg-[#1e1b4b]/60 transition-all cursor-pointer group overflow-hidden ${i === 0 ? 'ring-1 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : ''
                    }`}
                >
                  {/* Background Glow for Top Rank */}
                  {i === 0 && (
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                  )}

                  {/* Rank Label */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      RANK #{i + 1}
                    </span>
                    {i === 0 && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/10 rounded border border-yellow-500/20">
                        <Trophy className="w-2.5 h-2.5 text-yellow-500" />
                        <span className="text-[7px] font-bold text-yellow-500 uppercase">Top Performer</span>
                      </div>
                    )}
                  </div>

                  {/* City Name */}
                  <h3 className={`text-2xl font-black mb-3 transition-colors ${i === 0 ? 'text-indigo-400' : 'text-white'
                    } group-hover:text-indigo-300`}>
                    {loc.Area || loc.City || loc.Pincode || loc.pincode || "Unknown Location"}
                  </h3>

                  {/* Footfalls */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-300 transition-colors">
                      <span className="text-[10px] font-medium opacity-60 ml-0.5">{loc.City}</span>
                    </span>
                  </div>

                  {/* Score Circle (Top Right) */}
                  <div className="absolute top-6 right-6 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full border-2 ${scoreColor} flex items-center justify-center relative z-10 bg-[#1a1a2e]`}>
                      <div className={`text-xs font-black font-mono ${scoreColor.split(' ')[0]}`}>
                        {(parseFloat(loc.opportunity_score || loc.rank_score || 0) * 50).toFixed(0)}%
                      </div>

          {/* Brand Clusters */}
          <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md transition-hover hover:bg-indigo-500/10">
            <Sparkles className="text-indigo-400 w-5 h-5 mb-4" />
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Brand Clusters</h4>
            <p className="text-sm text-slate-300">Presence of: <span className="text-white font-medium">Starbucks, Apple, Nike Anchors.</span></p>
          </div>

          {/* Avoidance Metrics */}
          <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md transition-hover hover:bg-rose-500/10">
            <ShieldAlert className="text-rose-400 w-5 h-5 mb-4" />
            <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Avoidance Metrics</h4>
            <p className="text-sm text-slate-300">Distance from: <span className="text-white font-medium">Wine shops, High-noise zones.</span></p>
          </div>
        </div>


      </div>

      {/* Right Content - Scrollable on Desktop */}
      <div className="flex-1 h-full overflow-y-auto p-6 no-scrollbar">
        {/* Map Section */}
        <div className="w-full h-[550px] mb-16">
          <DashboardMap locations={locations} />
        </div>

        <div className="mb-10">
          <DemographicsCard data={data} />
        </div>

        <div className="pb-12">
          <FootfallCard data={data} />
        </div>
      </div>
    </div>
  );
}

export default CityDashboard;