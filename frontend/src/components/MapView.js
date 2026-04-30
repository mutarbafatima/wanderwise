// FILE: components/MapView.js

import React, { useState } from "react";
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

// ── fix leaflet marker icons ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FALLBACK =
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=60";

// ── real GPS coordinates for every destination ──
const DEST_COORDS = {
  "Bali, Indonesia": { lat: -8.3405, lng: 115.092 },
  "Santorini, Greece": { lat: 36.3932, lng: 25.4615 },
  "Kyoto, Japan": { lat: 35.0116, lng: 135.7681 },
  "Patagonia, Argentina": { lat: -51.623, lng: -69.2168 },
  Maldives: { lat: 3.2028, lng: 73.2207 },
  "Marrakech, Morocco": { lat: 31.6295, lng: -7.9811 },
  "Amalfi Coast, Italy": { lat: 40.634, lng: 14.6027 },
  "Queenstown, New Zealand": { lat: -45.0312, lng: 168.6626 },
  "Dubai, UAE": { lat: 25.2048, lng: 55.2708 },
  "Banff, Canada": { lat: 51.1784, lng: -115.571 },
  "Lahore, Pakistan": { lat: 31.5497, lng: 74.3436 },
  "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241 },
  "Barcelona, Spain": { lat: 41.3851, lng: 2.1734 },
  "Phuket, Thailand": { lat: 7.8804, lng: 98.3923 },
  "Istanbul, Turkey": { lat: 41.0082, lng: 28.9784 },
  "Paris, France": { lat: 48.8566, lng: 2.3522 },
  "New York City, USA": { lat: 40.7128, lng: -74.006 },
  "Rio de Janeiro, Brazil": { lat: -22.9068, lng: -43.1729 },
  "Prague, Czech Republic": { lat: 50.0755, lng: 14.4378 },
  "Petra, Jordan": { lat: 30.3285, lng: 35.4444 },
  "Serengeti, Tanzania": { lat: -2.3333, lng: 34.8333 },
  "Reykjavik, Iceland": { lat: 64.1355, lng: -21.8954 },
  "Ha Long Bay, Vietnam": { lat: 20.9101, lng: 107.1839 },
  "Machu Picchu, Peru": { lat: -13.1631, lng: -72.545 },
  "Amsterdam, Netherlands": { lat: 52.3676, lng: 4.9041 },
  "Mecca, Saudi Arabia": { lat: 21.3891, lng: 39.8579 },
  "Hunza Valley, Pakistan": { lat: 36.3167, lng: 74.65 },
  "Swiss Alps, Switzerland": { lat: 46.8182, lng: 8.2275 },
  "Angkor Wat, Cambodia": { lat: 13.4125, lng: 103.867 },
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  "Rome, Italy": { lat: 41.9028, lng: 12.4964 },
  "Lisbon, Portugal": { lat: 38.7223, lng: -9.1393 },
  "Cappadocia, Turkey": { lat: 38.6431, lng: 34.8289 },
  "Zanzibar, Tanzania": { lat: -6.1659, lng: 39.2026 },
  "Bora Bora, French Polynesia": { lat: -16.5004, lng: -151.741 },
  "Havana, Cuba": { lat: 23.1136, lng: -82.3666 },
  Bhutan: { lat: 27.5142, lng: 90.4336 },
  "Nairobi, Kenya": { lat: -1.2921, lng: 36.8219 },
  "Vienna, Austria": { lat: 48.2082, lng: 16.3738 },
  "Galapagos Islands, Ecuador": { lat: -0.9538, lng: -90.9656 },
  "Seoul, South Korea": { lat: 37.5665, lng: 126.978 },
  "Fiji Islands": { lat: -17.7134, lng: 178.065 },
  "Medina, Saudi Arabia": { lat: 24.5247, lng: 39.5692 },
  "Colombo, Sri Lanka": { lat: 6.9271, lng: 79.8612 },
  "Cairo, Egypt": { lat: 30.0444, lng: 31.2357 },
  "Luang Prabang, Laos": { lat: 19.8833, lng: 102.135 },
  "Cinque Terre, Italy": { lat: 44.1461, lng: 9.6439 },
  "Muscat, Oman": { lat: 23.588, lng: 58.3829 },
  "Buenos Aires, Argentina": { lat: -34.6037, lng: -58.3816 },
  "Chiang Mai, Thailand": { lat: 18.7883, lng: 98.9853 },
  "Dubrovnik, Croatia": { lat: 42.6507, lng: 18.0944 },
  "Tbilisi, Georgia": { lat: 41.6938, lng: 44.8015 },
  "Kathmandu, Nepal": { lat: 27.7172, lng: 85.324 },
  "Cartagena, Colombia": { lat: 10.391, lng: -75.4794 },
  "Melbourne, Australia": { lat: -37.8136, lng: 144.9631 },
  "Marrakech Sahara, Morocco": { lat: 31.0, lng: -4.0 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  "Bruges, Belgium": { lat: 51.2093, lng: 3.2247 },
  "Socotra Island, Yemen": { lat: 12.4634, lng: 53.8237 },
  "Vancouver, Canada": { lat: 49.2827, lng: -123.12 },
  "Taipei, Taiwan": { lat: 25.033, lng: 121.5654 },
  "Lagos, Nigeria": { lat: 6.5244, lng: 3.3792 },
  "Seville, Spain": { lat: 37.3891, lng: -5.9845 },
  "Paro, Bhutan": { lat: 27.4287, lng: 89.4164 },
  "Addis Ababa, Ethiopia": { lat: 9.032, lng: 38.7469 },
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093 },
  "Kotor, Montenegro": { lat: 42.4247, lng: 18.7712 },
  "Oaxaca, Mexico": { lat: 17.06, lng: -96.7222 },
  "Tallinn, Estonia": { lat: 59.437, lng: 24.7536 },
  "Luxor, Egypt": { lat: 25.6872, lng: 32.6396 },
  "Kochi, India": { lat: 9.9312, lng: 76.2673 },
  "Tulum, Mexico": { lat: 20.2114, lng: -87.4654 },
  Mozambique: { lat: -18.6657, lng: 35.5296 },
  "Sarajevo, Bosnia": { lat: 43.8476, lng: 18.3564 },
  "Mendoza, Argentina": { lat: -32.8908, lng: -68.8272 },
  "Taipei Night Markets": { lat: 25.084, lng: 121.5222 },
  "Bandar Seri Begawan, Brunei": { lat: 4.9031, lng: 114.9398 },
  "Almaty, Kazakhstan": { lat: 43.222, lng: 76.8512 },
};

// ── custom orange pin ──
const createPin = (isSelected) =>
  L.divIcon({
    className: "",
    html: `
      <div class="map-pin ${isSelected ? "map-pin-selected" : ""}">
        <div class="map-pin-dot"></div>
        <div class="map-pin-tail"></div>
      </div>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  });

export default function MapView({ destinations, onClose }) {
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const regions = [
    "All",
    ...new Set(destinations.map((d) => d.region).filter(Boolean)),
  ];

  const filtered =
    activeFilter === "All"
      ? destinations
      : destinations.filter((d) => d.region === activeFilter);

  const mappable = filtered.filter((d) => DEST_COORDS[d.name]);

  return (
    <div
      className="map-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="map-modal">
        {/* ── HEADER ── */}
        <div className="map-header">
          <div className="map-header-left">
            <div className="map-title">🗺️ Destination Map</div>
            <div className="map-sub">
              {mappable.length} destinations · click a pin to explore
            </div>
          </div>
          <button className="map-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ── REGION FILTER CHIPS ── */}
        <div className="map-chips-wrap">
          {regions.map((r) => (
            <button
              key={r}
              className={`map-chip ${activeFilter === r ? "active" : ""}`}
              onClick={() => {
                setActiveFilter(r);
                setSelected(null);
              }}
            >
              {r}
              {r !== "All" && (
                <span className="map-chip-count">
                  {destinations.filter((d) => d.region === r).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── REAL MAP ── */}
        <div className="map-container-wrap">
          <MapContainer
            center={[20, 15]}
            zoom={2}
            minZoom={2}
            zoomControl={false}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Google Maps lookalike tile */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
            <ZoomControl position="bottomright" />

            {mappable.map((dest) => {
              const coords = DEST_COORDS[dest.name];
              if (!coords) return null;
              const isSel = selected?.id === dest.id;

              return (
                <Marker
                  key={dest.id}
                  position={[coords.lat, coords.lng]}
                  icon={createPin(isSel)}
                  eventHandlers={{
                    click: () => setSelected(isSel ? null : dest),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="popup-inner">
                      <img
                        src={dest.imageUrl || FALLBACK}
                        alt={dest.name}
                        onError={(e) => (e.target.src = FALLBACK)}
                      />
                      <div className="popup-body">
                        <div className="popup-country">{dest.country}</div>
                        <div className="popup-name">{dest.name}</div>
                        <div className="popup-pills">
                          <span className="popup-pill">
                            💰 {dest.estimatedCost}
                          </span>
                          <span className="popup-pill">
                            🌤 {dest.bestSeason}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* ── SELECTED DESTINATION CARD ── */}
        {selected && (
          <div className="map-selected">
            <img
              src={selected.imageUrl || FALLBACK}
              alt={selected.name}
              onError={(e) => (e.target.src = FALLBACK)}
            />
            <div className="map-selected-body">
              <div className="map-selected-country">
                📍 {selected.country} · {selected.region}
              </div>
              <div className="map-selected-name">{selected.name}</div>
              <div className="map-selected-meta">
                <span>💰 {selected.estimatedCost}</span>
                <span>🌤 {selected.bestSeason}</span>
                <span>⏱ {selected.idealDuration}</span>
              </div>
              {selected.insiderTip && (
                <div className="map-selected-tip">✦ {selected.insiderTip}</div>
              )}
            </div>
            <button
              className="map-selected-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
