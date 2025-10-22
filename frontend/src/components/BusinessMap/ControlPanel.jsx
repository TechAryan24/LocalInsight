// src/components/BusinessMap/ControlPanel.jsx
import React from 'react';
import { Layers, Eye, EyeOff, Coffee, MapPin, BarChart2 } from 'lucide-react';

const ControlPanel = ({ layers, toggleLayer, mapStyle, setMapStyle }) => {
  return (
    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64 border z-10">
      <h3 className="font-bold text-lg mb-4 text-[#003366]">Local Insight</h3>
      
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
          <Layers className="w-4 h-4" /> Map Style
        </label>
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="w-full text-sm border-gray-200 rounded-lg p-2 focus:outline-none focus:border-[#003366]"
        >
          <option value="streets">Streets</option>
          <option value="dataviz">Data Viz</option>
          <option value="hybrid">Hybrid (Satellite)</option>
        </select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis Layers</h4>
        <div className="space-y-2">
          <LayerToggle icon={<BarChart2 className="w-4 h-4 text-orange-500" />} label="Population Density" enabled={layers.heatmap} onToggle={() => toggleLayer('heatmap')} />
          <LayerToggle icon={<Coffee className="w-4 h-4 text-red-600" />} label="Competitors" enabled={layers.competitors} onToggle={() => toggleLayer('competitors')} />
          <LayerToggle icon={<MapPin className="w-4 h-4 text-green-600" />} label="Points of Interest" enabled={layers.pois} onToggle={() => toggleLayer('pois')} />
        </div>
      </div>
    </div>
  );
};

const LayerToggle = ({ icon, label, enabled, onToggle }) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-gray-800">{label}</span>
    </div>
    {enabled ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
  </button>
);

export default ControlPanel;