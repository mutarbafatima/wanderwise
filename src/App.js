import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import DestinationCard from "./components/DestinationCard";
import { fetchRecommendations } from "./services/api";
import "./App.css";
import ParticleBackground from "./components/ParticleBackground";
import MapView from "./components/MapView";

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMap, setShowMap] = useState(false);

  // ✅ SAFE LOAD
  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchRecommendations();

      if (!data || !Array.isArray(data.destinations)) {
        throw new Error("Invalid API response");
      }

      setDestinations(data.destinations);
    } catch (err) {
      console.log("ERROR:", err);
      setError("Failed to load destinations. Backend or API issue.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  // SAFE FILTER
  const filtered = (destinations || []).filter((d) => {
    if (!d) return false;

    const matchType = filter === "all" || d.travelType === filter;

    const matchSearch =
      !search ||
      (d.name && d.name.toLowerCase().includes(search.toLowerCase())) ||
      (d.country && d.country.toLowerCase().includes(search.toLowerCase()));

    return matchType && matchSearch;
  });

  return (
    <div className="app">
      <ParticleBackground />

      {/* MAP BUTTON */}
      <button className="map-fab" onClick={() => setShowMap(true)}>
        🗺️ Map
      </button>

      {showMap && (
        <MapView
          destinations={destinations}
          onClose={() => setShowMap(false)}
        />
      )}

      <Navbar activeTab="destinations" search={search} setSearch={setSearch} />

      {/* HERO */}
      <section className="hero">
        <h1>
          Find Your Perfect <span>Destination</span>
        </h1>
      </section>

      {/* FILTER */}
      <div>
        {["all", "relaxing", "adventure", "cultural", "romantic", "luxury"].map(
          (type) => (
            <button key={type} onClick={() => setFilter(type)}>
              {type}
            </button>
          ),
        )}
      </div>

      {/* MAIN */}
      <main>
        {loading && <h3>Loading...</h3>}

        {error && <h3 style={{ color: "red" }}>{error}</h3>}

        {!loading && !error && filtered.length > 0 && (
          <div>
            {filtered.map((dest, i) => (
              <DestinationCard key={dest?.id || i} dest={dest} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <h3>No destinations found</h3>
        )}
      </main>
    </div>
  );
}
