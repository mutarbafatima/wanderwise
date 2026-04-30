import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// ── FIX LEAFLET ICON ISSUE ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FALLBACK =
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=60";

// ── IMPORTANT: PREVENT SSR/CLIENT ISSUE ──
export default function MapView({ destinations = [], onClose }) {
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const DEST_COORDS = {
    "Bali, Indonesia": { lat: -8.3405, lng: 115.092 },
    "Santorini, Greece": { lat: 36.3932, lng: 25.4615 },
    "Kyoto, Japan": { lat: 35.0116, lng: 135.7681 },
    "Paris, France": { lat: 48.8566, lng: 2.3522 },
    "Lahore, Pakistan": { lat: 31.5497, lng: 74.3436 },
    "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  };

  const regions = [
    "All",
    ...new Set((destinations || []).map((d) => d.region).filter(Boolean)),
  ];

  const filtered =
    activeFilter === "All"
      ? destinations
      : destinations.filter((d) => d.region === activeFilter);

  const mappable = filtered.filter((d) => DEST_COORDS[d.name]);

  if (!isClient) return null; // 🔥 prevents Vercel blank crash

  return (
    <div
      className="map-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="map-modal">
        {/* HEADER */}
        <div className="map-header">
          <div className="map-title">🗺️ Map</div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MAP */}
        <div className="map-container-wrap" style={{ height: "500px" }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            zoomControl={true}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

            <ZoomControl position="bottomright" />

            {mappable.map((dest, i) => {
              const coords = DEST_COORDS[dest.name];
              if (!coords) return null;

              return (
                <Marker
                  key={dest.id || i}
                  position={[coords.lat, coords.lng]}
                  eventHandlers={{
                    click: () => setSelected(dest),
                  }}
                >
                  <Popup>
                    <div>
                      <b>{dest.name}</b>
                      <br />
                      {dest.country}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* SELECTED CARD */}
        {selected && (
          <div className="map-selected">
            <img src={selected.imageUrl || FALLBACK} alt={selected.name} />
            <div>
              <h3>{selected.name}</h3>
              <p>{selected.country}</p>
            </div>
            <button onClick={() => setSelected(null)}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
