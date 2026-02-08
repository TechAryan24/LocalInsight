import React, { useState, useEffect } from "react";
import { Map, Source, Layer, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const MAPTILER_API_KEY = "PSKKY9Cyh2izeQTNhuac";

const DashboardMap = ({ locations = [] }) => {
  const [geoData, setGeoData] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
  });
  const [hoverInfo, setHoverInfo] = useState(null);

  // Fetch coordinates for locations that don't have them
  useEffect(() => {
    const fetchCoordinates = async () => {
      const results = [];
      const cachedCoords = {};

      for (const loc of locations) {
        if (loc.latitude && loc.longitude) {
          results.push({
            ...loc,
            latitude: parseFloat(loc.latitude),
            longitude: parseFloat(loc.longitude),
            area: loc.Area || 100,
          });
          continue;
        }

        const cityQuery = loc.City || loc.city;
        if (!cityQuery) continue;

        if (cachedCoords[cityQuery]) {
          results.push({
            ...loc,
            latitude: cachedCoords[cityQuery].lat,
            longitude: cachedCoords[cityQuery].lon,
            area: loc.Area || 100,
          });
          continue;
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityQuery)}`
          );
          const data = await res.json();

          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            cachedCoords[cityQuery] = { lat, lon };

            results.push({
              ...loc,
              latitude: lat,
              longitude: lon,
              area: loc.Area || 100,
            });
          }
        } catch (err) {
          console.error(`Error fetching coordinates for ${cityQuery}:`, err);
        }

        await new Promise(resolve => setTimeout(resolve, 1100)); // Rate limiting
      }

      setGeoData(results);

      if (results.length > 0) {
        const bounds = results.reduce((acc, curr) => {
          return {
            minLon: Math.min(acc.minLon, curr.longitude),
            maxLon: Math.max(acc.maxLon, curr.longitude),
            minLat: Math.min(acc.minLat, curr.latitude),
            maxLat: Math.max(acc.maxLat, curr.latitude)
          };
        }, { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 });

        setViewState(prev => ({
          ...prev,
          longitude: (bounds.minLon + bounds.maxLon) / 2,
          latitude: (bounds.minLat + bounds.maxLat) / 2,
          zoom: 5
        }));
      }
    };

    if (locations.length > 0) {
      fetchCoordinates();
    }
  }, [locations]);

  // --- Map Style ---
  const [mapStyle, setMapStyle] = useState('streets');

  const getMapStyleUrl = () => {
    const styles = {
      streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      dark: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_API_KEY}`,
      satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    };
    return styles[mapStyle] || styles.streets;
  };

  // --- Helper: Get Color based on Score ---
  const getMetricVisuals = (score) => {
    const s = parseFloat(score) || 0;
    if (s >= 0.6) return { color: "#4ade80", rotate: 0, label: "High" };   // Green, Up
    if (s >= 0.3) return { color: "#facc15", rotate: 45, label: "Medium" }; // Yellow, Tilted
    return { color: "#f87171", rotate: 180, label: "Low" };                 // Red, Down
  };

  return (
    <div className="w-full h-full min-h-[550px] relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
      {/* Map Style Switcher */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-1 rounded-lg flex gap-1 border border-white/20 shadow-lg z-10 transition-opacity opacity-0 group-hover:opacity-100 duration-300">
        {[
          { id: 'streets', label: 'Streets', icon: '🗺️' },
          { id: 'satellite', label: 'Satellite', icon: '🛰️' },
          { id: 'dark', label: 'Dark', icon: '🌑' },
        ].map(style => (
          <button
            key={style.id}
            onClick={() => setMapStyle(style.id)}
            className={`
                    px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all
                    ${mapStyle === style.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                `}
          >
            <span>{style.icon}</span>
            {style.label}
          </button>
        ))}
      </div>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={getMapStyleUrl()}
        style={{ width: "100%", height: "100%" }}
      >
        {geoData.map((loc, index) => {
          const visuals = getMetricVisuals(loc.opportunity_score);
          return (
            <Marker
              key={index}
              longitude={loc.longitude}
              latitude={loc.latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setHoverInfo(loc);
              }}
            >
              <div className="relative flex items-center justify-center w-12 h-12 group -translate-y-1/2">
                {/* 1. Radar Pulse Animation (The "Glowing" Ring) - Simplified for Dashboard */}
                <div
                  className="absolute bottom-0 w-8 h-8 rounded-full opacity-40 animate-ping"
                  style={{ backgroundColor: visuals.color, transform: 'translateY(50%) scale(0.5)' }}
                ></div>

                {/* 2. The Pin Icon */}
                <div className="relative z-10 transition-transform duration-200 group-hover:scale-125 group-hover:-translate-y-2">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill={visuals.color}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-xl"
                    style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))` }}
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Popup on Click */}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            anchor="top"
            onClose={() => setHoverInfo(null)}
            closeOnClick={false}
            className="text-slate-900 z-50"
            offset={10}
          >
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-lg capitalize">{hoverInfo.Area || hoverInfo.City || hoverInfo.city}</h3>
              <div className="text-sm">
                <p>Score: <strong>{hoverInfo.opportunity_score}</strong></p>
                <p className="text-gray-500 text-xs">Footfalls: {hoverInfo.FootFalls_per_month?.toLocaleString()}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white shadow-xl">
        <h3 className="font-bold text-sm mb-2 border-b border-white/20 pb-1">Opportunity Score</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>High (&gt; 0.6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Medium (0.3 - 0.6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Low (&lt; 0.3)</span>
          </div>
        </div>
      </div>
    </div >
  );
};

export default DashboardMap;
