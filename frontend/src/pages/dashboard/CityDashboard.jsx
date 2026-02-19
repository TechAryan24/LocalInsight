import React, { useEffect } from "react";
import DashboardMap from "../../components/DashboardMap.jsx";
import LocationAnalysisCard from "../../components/LocationAnalysisCard.jsx";
import CollaboratedInsights from "../../components/CollaboratedInsights.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";
import { Trophy, TrendingUp, MapPin, ChevronRight, Activity, Globe } from "lucide-react";
import { motion } from "framer-motion";

function CityDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Get initial locations from either location.state or localStorage
  const storedLocations = JSON.parse(localStorage.getItem("cityLocations")) || [];
  const locations = location.state?.locations || storedLocations;

  // If new data comes from navigation (i.e., after prediction), update localStorage
  useEffect(() => {
    if (location.state?.locations && location.state.locations.length > 0) {
      localStorage.setItem("cityLocations", JSON.stringify(location.state.locations));
    }
  }, [location.state]);

  // Handle Map View if needed (now inline)

  // Sort for Top 3
  const topLocations = [...locations]
    .sort((a, b) => (parseFloat(b.opportunity_score || b.rank_score) || 0) - (parseFloat(a.opportunity_score || a.rank_score) || 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left Sidebar - Fixed on Desktop */}
      <div className="w-full lg:w-[28%] xl:w-1/4 h-full lg:overflow-y-auto p-6 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/5 no-scrollbar">

        <h1 className="text-3xl font-semibold text-white">
          Welcome {currentUser?.displayName || "User"}!
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <h2 className="text-xl font-black text-white tracking-tight">Top Opportunities</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(129,140,248,0.8)]"></div>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Live Analysis</span>
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

                      {/* Radar Pulse Effect */}
                      <div className={`absolute -inset-1.5 border-2 rounded-full opacity-30 animate-ping ${score >= 0.3 ? 'border-yellow-500' : 'border-red-500'}`}></div>
                      <div className={`absolute -inset-0.5 border-1 rounded-full opacity-10 ${score >= 0.3 ? 'border-yellow-500' : 'border-red-500'}`}></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {topLocations.length === 0 && (
              <div className="text-center py-12 bg-[#0f172a]/50 rounded-2xl border border-white/5 border-dashed">
                <Globe className="w-8 h-8 text-slate-700 mx-auto mb-3 opacity-20" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Active Targets</p>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Right Content - Scrollable on Desktop */}
      <div className="flex-1 h-full overflow-y-auto p-6 no-scrollbar">
        {/* Map Section */}
        <div className="w-full h-[550px] mb-16">
          <DashboardMap locations={locations} />
        </div>

        {/* Collaborated Insights Section */}
        <CollaboratedInsights locations={locations} />

        {/* Detailed Breakdown Header */}
        <div className="flex items-center gap-3 mb-6 mt-12">
          <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white tracking-tight text-shadow-sm">Detailed Breakdown</h2>
        </div>

        {/* Locations Grid - Horizontal Scroll for Single Row */}
        {locations.length > 0 ? (
          <div className="flex gap-6 pb-12 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2">
            {locations.map((loc, index) => (
              <div
                key={index}
                onClick={() => navigate('/dashboard/details', { state: { location: loc } })}
                className="flex-shrink-0 w-[350px] snap-start cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <LocationAnalysisCard data={loc} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-200">No location data available yet.</p>
        )}
      </div>
    </div>
  );
}

export default CityDashboard;
