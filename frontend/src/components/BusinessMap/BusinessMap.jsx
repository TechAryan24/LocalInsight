// src/components/BusinessMap/BusinessMap.jsx
import React, { useState } from 'react';
import { Map, Marker, Popup, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Coffee, MapPin, BarChart2 } from 'lucide-react';

import { heatmapLayerStyle, heatmapPointLayerStyle } from './mapStyles.js';

const MAPTILER_API_KEY = 'PSKKY9Cyh2izeQTNhuac';

const BusinessMap = ({ mapStyle, data, visibleLayers }) => {
  const [viewState, setViewState] = useState({
    longitude: 72.8357, // Centered on Bandra, Mumbai for demo
    latitude: 19.063,
    zoom: 14,
    pitch: 30,
    bearing: 0,
  });

  const [selectedCompetitor, setSelectedCompetitor] = useState(null);

  const getMapStyleUrl = () => {
    const styles = {
      streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
      // A clean style for data visualization
      dataviz: `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_API_KEY}`,
    };
    return styles[mapStyle] || styles.dataviz;
  };

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={getMapStyleUrl()}
    >
      {/* Layer 1: Population Density Heatmap */}
      {visibleLayers.heatmap && data.demographicData && (
        <Source type="geojson" data={data.demographicData}>
          <Layer {...heatmapLayerStyle} />
          <Layer {...heatmapPointLayerStyle} />
        </Source>
      )}

      {/* Layer 2: Competitor Markers */}
      {visibleLayers.competitors && data.competitors.map(comp => (
        <Marker
          key={comp.id}
          longitude={comp.coordinates[0]}
          latitude={comp.coordinates[1]}
          anchor="bottom"
          onClick={() => setSelectedCompetitor(comp)}
        >
          <Coffee className="w-6 h-6 text-red-600 cursor-pointer drop-shadow-lg" />
        </Marker>
      ))}

      {/* Layer 3: Points of Interest Markers */}
      {visibleLayers.pois && data.pointsOfInterest.map(poi => (
        <Marker
            key={poi.id}
            longitude={poi.coordinates[0]}
            latitude={poi.coordinates[1]}
            anchor="bottom"
        >
            <MapPin className="w-6 h-6 text-green-600 cursor-pointer drop-shadow-lg" />
        </Marker>
      ))}

      {/* Popup for selected competitor */}
      {selectedCompetitor && (
        <Popup
          longitude={selectedCompetitor.coordinates[0]}
          latitude={selectedCompetitor.coordinates[1]}
          anchor="top"
          onClose={() => setSelectedCompetitor(null)}
          closeOnClick={false}
        >
            <div className="p-2">
                <h4 className="font-bold">{selectedCompetitor.name}</h4>
                <p className="text-sm text-gray-600">{selectedCompetitor.type}</p>
            </div>
        </Popup>
      )}
    </Map>
  );
};

export default BusinessMap;