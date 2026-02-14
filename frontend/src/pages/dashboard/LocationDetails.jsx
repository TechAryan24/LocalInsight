import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Visual Components ---

// 1. Animated Score Gauge (Futuristic Upgrade)
const ScoreGauge = ({ score }) => {
  const percentage = Math.min(Math.max(score * 100, 0), 100);
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    high: { text: "text-indigo-400", bg: "bg-indigo-500", glow: "rgba(99, 102, 241, 0.6)" },
    mid: { text: "text-amber-400", bg: "bg-amber-500", glow: "rgba(251, 191, 36, 0.6)" },
    low: { text: "text-rose-500", bg: "bg-rose-500", glow: "rgba(244, 63, 94, 0.6)" }
  };

  const currentStatus = score >= 0.6 ? 'high' : score >= 0.4 ? 'mid' : 'low';
  const theme = colorMap[currentStatus];

  return (
    <div className="relative flex items-center justify-center py-10">
      <div className="relative w-64 h-64 group">
        {/* Dynamic Glow Background */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full blur-[60px] ${theme.bg}`}
        />

        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentStatus === 'high' ? '#6366f1' : '#f59e0b'} />
              <stop offset="100%" stopColor={currentStatus === 'high' ? '#818cf8' : '#ef4444'} />
            </linearGradient>
            <filter id="neon">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track with Notch details */}
          <circle cx="100" cy="100" r={radius} stroke="#1e293b" strokeWidth="12" fill="none" opacity="0.5" />
          <circle cx="100" cy="100" r={radius} stroke="#0f172a" strokeWidth="4" fill="none" strokeDasharray="2 6" />

          {/* Main Progress Ring */}
          <motion.circle
            cx="100" cy="100" r={radius}
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            strokeLinecap="round"
            filter="url(#neon)"
          />

          {/* Pointer/Leading Dot */}
          <motion.circle
            cx="100" cy="100" r={radius}
            stroke="#fff"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`0.1 ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            strokeLinecap="round"
            className="opacity-80"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <div className="flex items-baseline justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-6xl font-[900] ${theme.text} tracking-tighter`}
              >
                {Number(score).toFixed(2)}
              </motion.span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 drop-shadow-sm">Reliability Index</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 2. Financial Bar Chart (Advanced 3D Style)
const FinancialChart = ({ income, rent }) => {
  const max = Math.max(income, rent) * 1.5 || 10000;
  const incomeH = (income / max) * 100;
  const rentH = (rent / max) * 100;
  const profit = income - rent;
  const profitH = (profit / max) * 100;

  const dataset = [
    { label: "Gross Income", value: income, height: incomeH, color: "from-emerald-600 to-indigo-400", glow: "bg-emerald-500" },
    { label: "Operational Rent", value: rent, height: rentH, color: "from-rose-600 to-orange-400", glow: "bg-rose-500" },
    { label: "Net Margin", value: profit, height: profitH, color: "from-indigo-600 to-blue-400", glow: "bg-blue-500" }
  ];

  return (
    <div className="flex flex-col h-full w-full justify-between p-2">
      <div className="flex items-end justify-around h-48 relative pb-8 px-4">
        {/* Horizontal Background Lines */}
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} className="absolute w-full border-t border-white/[0.03] flex items-center" style={{ bottom: `${p + 15}%` }}>
            <span className="text-[7px] text-slate-700 font-bold ml-[-1rem]">{p}%</span>
          </div>
        ))}

        {dataset.map((data, i) => (
          <div key={i} className="flex flex-col items-center justify-end h-full w-1/4 group relative">
            {/* Bar Container */}
            <div className="w-full relative flex flex-col items-center justify-end h-[85%]">
              {/* Glow Highlight */}
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className={`absolute w-12 blur-xl ${data.glow} z-0`}
                style={{ height: `${data.height}%` }}
              />

              {/* Main Bar Implementation */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${data.height}%` }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                className={`w-10 rounded-t-xl bg-gradient-to-t ${data.color} relative z-10 border-t border-x border-white/20`}
              >
                {/* Glossy Cap */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-xl" />
                {/* Floating Value Tag on Hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-white/10 rounded text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{data.value.toLocaleString()}
                </div>
              </motion.div>
            </div>

            {/* Labels */}
            <div className="mt-3 text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{data.label}</span>
              <span className="text-[11px] font-black text-white font-mono">₹{(data.value / 1000).toFixed(1)}k</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center px-4 py-3 bg-white/[0.02] border-t border-white/5 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Economic Stability: High</span>
        </div>
        <span className="text-[8px] font-bold text-slate-600">SOURCE: REGIONAL AGGREGATE</span>
      </div>
    </div>
  );
};

// 3. Demographics Donut (Crazy Orbital Upgrade)
const DemographicsDonut = ({ youthRatio }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const youthOffset = circumference - (youthRatio * circumference);

  return (
    <div className="flex items-center justify-around h-full p-2 relative">
      <div className="relative w-44 h-44 flex-shrink-0 group">
        {/* Ambient background rings */}
        <div className="absolute inset-4 rounded-full border border-white/[0.03] animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-8 rounded-full border border-white/[0.02] animate-[spin_15s_linear_infinite_reverse]" />

        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <defs>
            <filter id="demogGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle cx="80" cy="80" r={radius} stroke="#1e293b" strokeWidth="10" fill="none" />

          {/* Main Youth Ring */}
          <motion.circle
            cx="80" cy="80" r={radius}
            stroke="#6366f1"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: youthOffset }}
            transition={{ duration: 2, ease: "circOut" }}
            strokeLinecap="round"
            filter="url(#demogGlow)"
          />

          {/* Tracer ring */}
          <motion.circle
            cx="80" cy="80" r={radius}
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`2 ${circumference / 4}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="opacity-40"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-black text-white"
          >
            {(youthRatio * 100).toFixed(0)}%
          </motion.span>
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Youth Base</span>
        </div>
      </div>

      {/* Visual breakdown list */}
      <div className="flex flex-col gap-6 flex-1 max-w-[180px]">
        <div className="relative">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Gen-Z</span>
            <span className="text-[14px] font-black text-indigo-400">{(youthRatio * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${youthRatio * 100}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-400"
            />
          </div>
          <div className="mt-2 text-[8px] text-slate-500 font-bold uppercase">Primary Target Demographic</div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Established</span>
            <span className="text-[14px] font-black text-slate-400">{((1 - youthRatio) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(1 - youthRatio) * 100}%` }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute inset-0 bg-slate-600"
            />
          </div>
          <div className="mt-2 text-[8px] text-slate-500 font-bold uppercase">Secondary Market Reach</div>
        </div>
      </div>
    </div>
  );
}

// 4. Metric Radar Chart (Futuristic Neural Upgrade)
const MetricRadar = ({ metrics }) => {
  const size = 180;
  const center = size / 2;
  const scale = 75;

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * scale;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  const keys = Object.keys(metrics);
  const total = keys.length;
  const polyPoints = keys.map((key, i) => getPoint(metrics[key], i, total));
  const polyString = polyPoints.map(p => p.join(',')).join(' ');
  const webs = [100, 75, 50, 25].map(level => keys.map((_, i) => getPoint(level, i, total)).map(p => p.join(',')).join(' '));

  return (
    <div className="flex h-full w-full items-center justify-between p-2">
      {/* Left Axis Labels - High Premium look */}
      <div className="flex-1 space-y-4 max-w-[200px]">
        {keys.map((key, i) => (
          <div key={key} className="relative group">
            <div className="flex justify-between items-end mb-1 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-3 rounded-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-purple-500'} opacity-60`} />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
              </div>
              <span className="text-[12px] font-black text-white font-mono">{metrics[key].toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics[key]}%` }}
                transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                className={`h-full bg-gradient-to-r ${i % 2 === 0 ? 'from-indigo-600 to-indigo-400' : 'from-purple-600 to-purple-400'}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Right: Advanced Radar Visualization */}
      <div className="relative w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center">
        {/* Decorative rotating background */}
        <div className="absolute inset-0 border border-white/[0.03] rounded-full animate-[spin_30s_linear_infinite]" />

        <svg width={size} height={size} className="overflow-visible relative z-10">
          <defs>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Neural Web Grid */}
          {webs.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray={i === 0 ? "0" : "2 2"}
            />
          ))}

          {/* Axis Lines */}
          {keys.map((_, i) => {
            const [x, y] = getPoint(100, i, total);
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
          })}

          {/* Layered Data Shape */}
          <motion.polygon
            points={polyString}
            fill="rgba(99, 102, 241, 0.1)"
            stroke="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "backOut" }}
          />

          <motion.polygon
            points={polyString}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            filter="url(#radarGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Active Points */}
          {polyPoints.map(([x, y], i) => (
            <g key={i}>
              <motion.circle
                cx={x} cy={y} r="4"
                fill="#6366f1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + (i * 0.1) }}
              />
              <circle cx={x} cy={y} r="8" fill="rgba(99, 102, 241, 0.2)" className="animate-pulse" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// 5. Saturation Meter
const SaturationMeter = ({ count }) => {
  let saturation = Math.min((count / 15) * 100, 100); // Scale to 15 max
  const color = count <= 3 ? "text-emerald-400" : count <= 7 ? "text-amber-400" : "text-rose-500";
  const status = count <= 3 ? "Blue Ocean" : count <= 7 ? "Healthy" : "Saturated";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 gap-4">
      <div className="flex justify-between w-full items-end pb-2 border-b border-white/5">
        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Market Status</span>
        <div className="text-right">
          <span className={`text-2xl font-black ${color} block leading-none`}>{status}</span>
          <span className="text-[10px] text-gray-500">{count} Nearby Shops</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="w-full relative h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600 opacity-40"></div>
          <motion.div
            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_white] z-10"
            initial={{ left: "0%" }}
            animate={{ left: `${saturation}%` }}
            transition={{ duration: 1.5, type: "spring" }}
          />
        </div>
        <div className="flex justify-between w-full text-[9px] text-gray-600 font-mono uppercase">
          <span>Low Comp</span>
          <span>High Comp</span>
        </div>
      </div>
    </div>
  );
}

// 6. Growth Trend Chart
const GrowthTrend = ({ score }) => {
  const points = [20, 35, 45, 40, 60, 75, 90].map((val, i) => `${i * 16.6},${100 - (val * score)}`).join(' ');

  return (
    <div className="flex flex-col h-full w-full p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
      </div>

      <div className="flex justify-between z-10 mb-4">
        <div>
          <h4 className="text-xs text-gray-400 uppercase font-bold">Proj. Growth</h4>
          <p className="text-xl font-bold text-emerald-400">+{(score * 25).toFixed(1)}%</p>
        </div>
        <div className="bg-emerald-500/10 px-2 py-1 rounded text-[10px] text-emerald-400 h-fit">6 Months</div>
      </div>

      <div className="flex-1 relative z-10">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.polyline
            points={points}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          <defs>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`M0,100 ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`}
            fill="url(#fillGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </svg>
      </div>
    </div>
  )
}

// --- Main Page ---

const LocationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const locationData = state?.location;

  if (!locationData) return null;

  // Data Pre-processing
  const income = parseFloat(locationData.avg_income || 0);
  const rent = parseFloat(locationData.Rent || 0);
  const footfalls = parseFloat(locationData.FootFalls_per_month || 0);
  const score = parseFloat(locationData.opportunity_score || 0);
  const youthRatio = parseFloat(locationData.Youth_Ratio || 0);
  const competition = parseInt(locationData.similar_shop || 0);

  const metrics = {
    footfall: Math.min((footfalls / 80000) * 100, 100),
    wealth: Math.min((income / 80000) * 100, 100),
    youth: youthRatio * 100,
    value: Math.max(100 - (rent / 60000) * 100, 20),
    unique: Math.max(100 - (competition * 5), 10)
  };

  // Entry Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-6 pb-20 relative overflow-x-hidden selection:bg-indigo-500/30" style={{ backgroundImage: 'linear-gradient(110deg, #1a1a2e 0%, #0a0a1a 100%)', backgroundAttachment: 'fixed' }}>
      {/* Immersive Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary Radial Depth - Aligned with Theme */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,0.5)_0%,_rgba(10,10,26,1)_100%)]"></div>

        {/* Dynamic Mesh Glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-indigo-500/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full"
        />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[initial] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-end pb-6 mb-8 gap-4"
      >
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">← Back to Dashboard</button>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 capitalize">
            {locationData.Area || locationData.City || locationData.city}
          </h1>
          <p className="text-indigo-400 opacity-80">
            {locationData.Area
              ? `${locationData.City || locationData.city}, ${locationData.District}`
              : locationData.District}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Market Assessment</span>
          <span className={`text-2xl font-bold ${locationData.predicted_category === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {locationData.predicted_category} Potential
          </span>
        </div>
      </motion.div>

      {/* Main Grid: 2x2 Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        {/* 1. Score */}
        <motion.div
          variants={itemVariants}
          className="group relative bg-[#1a1a2e]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 min-h-[340px] flex flex-col items-center justify-center p-8"
        >
          {/* Internal Mesh Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-700" />
          <h3 className="absolute top-8 left-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Opportunity Analysis</h3>
          <ScoreGauge score={score} />
        </motion.div>

        {/* 2. Financials */}
        <motion.div
          variants={itemVariants}
          className="group relative bg-[#1a1a2e]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 min-h-[340px] p-8 flex flex-col"
        >
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700" />
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Financial Intelligence</h3>
          <FinancialChart income={income} rent={rent} />
        </motion.div>

        {/* 3. Demographics */}
        <motion.div
          variants={itemVariants}
          className="group relative bg-[#1a1a2e]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 min-h-[340px] p-8 flex flex-col"
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700" />
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Consumer Demographics</h3>
          <DemographicsDonut youthRatio={youthRatio} />
        </motion.div>

        {/* 4. Radar (Holistic) */}
        <motion.div
          variants={itemVariants}
          className="group relative bg-[#1a1a2e]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 min-h-[340px] p-8 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">360° Regional Health</h3>
          <MetricRadar metrics={metrics} />
        </motion.div>

        {/* Strategic Insight (Full Width) */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="bg-gradient-to-r from-[#1a1a2e]/60 to-[#1e1b4b]/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Strategic Insight
            </h3>
            <p className="text-lg text-gray-300 font-light leading-relaxed max-w-4xl">
              {locationData.insights || `This location in ${locationData.District} shows strong potential with a score of ${score.toFixed(2)}. The alignment of high footfall and specific demographic targeting suggests a quick ROI.`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div >
  );
};

export default LocationDetails;
