// src/pages/MapPage.jsx
import React, { useState, useEffect } from 'react';
import BusinessMap from '../components/BusinessMap/BusinessMap';
import ControlPanel from '../components/BusinessMap/ControlPanel';
import { fetchBusinessData } from '../components/BusinessMap/mockApi'; // Correct relative path

const Map = () => {
  const [mapStyle, setMapStyle] = useState('dataviz');
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State to control layer visibility
  const [visibleLayers, setVisibleLayers] = useState({
    heatmap: true,
    competitors: true,
    pois: true,
  });

  useEffect(() => {
    setLoading(true);
    fetchBusinessData().then(data => {
      setBusinessData(data);
      setLoading(false);
    });
  }, []);

  const toggleLayer = (layerName) => {
    setVisibleLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Loading Business Insights...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <BusinessMap 
        mapStyle={mapStyle} 
        data={businessData}
        visibleLayers={visibleLayers}
      />
      <ControlPanel 
        layers={visibleLayers} 
        toggleLayer={toggleLayer}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
      />
    </div>
  );
};

export default Map;