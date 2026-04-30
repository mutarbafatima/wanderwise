// FILE: App.js

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import DestinationCard from "./components/DestinationCard";
import { fetchRecommendations } from "./services/api";
import "./App.css";
import ParticleBackground from "./components/ParticleBackground";
import MapView from "./components/MapView";

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [tripPlan, setTripPlan] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("destinations");
  const [darkMode, setDarkMode] = useState(false);
  const [tripError, setTripError] = useState("");
  const [search, setSearch] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "tripplan") {
      setDarkMode((prev) => !prev);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    setActiveTab("destinations");
  };

  // FIXED TRIP PLAN
  const generateTripPlan = () => {
    if (!selectedDestination) {
      setTripError("Please select a destination first");
      return;
    }

    setTripError("");

    const dest = destinations.find((d) => d.name === selectedDestination);
    if (!dest) return;

    const highlights = Array.isArray(dest.highlights) ? dest.highlights : [];

    let fallbackPlaces = [
      "Visit famous landmark",
      "Explore city center streets",
      "Try local traditional food",
      "Visit historical museum",
      "Walk in old bazaar/market",
      "Enjoy sunset viewpoint",
      "Explore nearby park or garden",
      "Visit cultural heritage site",
      "Take city walking tour",
      "Discover hidden local streets",
      "Visit local religious site",
      "Try street food spots",
      "Go to river/lake view",
      "Visit art gallery",
      "Explore shopping district",
      "Visit famous monument",
      "Relax in local café area",
      "Take photography tour",
      "Visit amusement park",
      "Explore nearby village",
      "Go hiking or nature walk",
      "Visit zoo or wildlife park",
      "Try local breakfast spot",
      "Explore night market",
      "Visit rooftop viewpoint",
      "Take cultural walking tour",
      "Explore downtown area",
      "Visit historical fort/castle",
      "Go boating or lake activity",
      "Relax at scenic spot",
      "Explore street art district",
      "Visit panoramic viewpoint",
      "Try local dessert shops",
      "Visit heritage walking route",
      "Explore coastal area",
    ];

    let pool = [...highlights, ...fallbackPlaces];
    pool = [...new Set(pool)];
    pool = pool.sort(() => Math.random() - 0.5);

    while (pool.length < days) {
      pool = pool.concat(fallbackPlaces);
      pool = [...new Set(pool)];
    }

    const itinerary = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      plan: pool[i] || "Explore local attractions",
    }));

    setTripPlan({
      destination: dest.name,
      days,
      itinerary,
    });
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadDestinations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecommendations();

      // SAFE FIX (prevents blank page crash)
      setDestinations(data?.destinations || []);
    } catch (err) {
      setError(
        "Could not load destinations. Make sure your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED FILTER (this was your blank page bug)
  const filtered = (destinations || []).filter((d) => {
    const matchType = filter === "all" || d.travelType === filter;

    const matchSearch =
      !search ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.country?.toLowerCase().includes(search.toLowerCase());

    return matchType && matchSearch;
  });

  return (
    <div className="app">
      <ParticleBackground />

      {/* MAP BUTTON */}
      <button
        className="map-fab"
        onClick={() => setShowMap(true)}
        title="View destination map"
      >
        🗺️ Map
      </button>

      {showMap && (
        <MapView
          destinations={destinations}
          onClose={() => setShowMap(false)}
        />
      )}

      <Navbar
        handleTabClick={handleTabClick}
        activeTab={activeTab}
        search={search}
        setSearch={setSearch}
      />

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          Find Your Perfect <span>Destination</span>
        </h1>
        <p className="hero-sub">
          Let WanderWise guide you to the world's most beautiful places
        </p>
      </section>

      {/* FILTER */}
      <section className="filter-section">
        <p className="filter-label">Filter by vibe:</p>
        <div className="filter-buttons">
          {[
            "all",
            "relaxing",
            "adventure",
            "cultural",
            "romantic",
            "luxury",
          ].map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN */}
      <main className={`main-content ${darkMode ? "dark" : ""}`}>
        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && filtered.length > 0 && (
          <div className="cards-grid">
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p>No destinations found.</p>
        )}
      </main>
    </div>
  );
}
