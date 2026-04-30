import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import DestinationCard from "./components/DestinationCard";
import { fetchRecommendations } from "./services/api";
import "./App.css";

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");

  // ✅ Tabs
  const [activeTab, setActiveTab] = useState("destinations");

  // ✅ Trip planner
  const [selectedDestination, setSelectedDestination] = useState("");
  const [days, setDays] = useState(3);
  const [tripPlan, setTripPlan] = useState(null);
  const [tripError, setTripError] = useState("");

  // ✅ Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // ── TAB HANDLER ──
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "tripplan") {
      setDarkMode((prev) => !prev);
    }
  };

  // ── LOAD DATA ──
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
      const list = Array.isArray(data) ? data : data?.destinations || [];
      setDestinations(list);
    } catch (err) {
      setError("Could not load destinations. Backend not running.");
    } finally {
      setLoading(false);
    }
  };

  // ── FILTER ──
  const filtered =
    filter === "all"
      ? destinations
      : destinations.filter(
          (d) => (d.travelType || "").toLowerCase() === filter.toLowerCase(),
        );

  // ── TRIP GENERATOR ──
  const generateTripPlan = () => {
    if (!selectedDestination) {
      setTripError("⚠️ Please select a destination first!");
      return;
    }

    setTripError("");

    const dest = destinations.find((d) => d.name === selectedDestination);

    if (!dest) return;

    const highlights = Array.isArray(dest.highlights)
      ? dest.highlights
      : ["Explore local attractions"];

    const fallbackPlaces = [
      "Visit famous landmark",
      "Explore local streets",
      "Try traditional food",
      "Visit museum",
      "Walk in old bazaar",
      "Enjoy sunset view",
      "Visit cultural site",
      "Take city tour",
      "Discover hidden spots",
      "Visit local market",
      "Relax in café",
      "Go photography tour",
      "Visit park or garden",
      "Explore nightlife",
      "Try street food",
    ];

    let pool = [...highlights, ...fallbackPlaces];
    pool = [...new Set(pool)];
    pool = pool.sort(() => Math.random() - 0.5);

    const itinerary = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      plan: pool[i] || "Free exploration day",
    }));

    setTripPlan({
      destination: dest.name,
      days,
      itinerary,
    });
  };

  return (
    <div className="app">
      <Navbar handleTabClick={handleTabClick} activeTab={activeTab} />

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">Find Your Perfect Destination</h1>
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
              onClick={() => {
                setFilter(type);
                setActiveTab("destinations"); // 🔥 instant switch fix
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN */}
      <main className={`main-content ${darkMode ? "dark" : ""}`}>
        {/* LOADING */}
        {loading && activeTab === "destinations" && (
          <div className="loading-box">
            <div className="spinner" />
            <p>Finding amazing destinations for you...</p>
          </div>
        )}

        {/* ERROR */}
        {error && activeTab === "destinations" && (
          <div className="error-box">
            <p className="error-icon">⚠️</p>
            <p className="error-text">{error}</p>
            <button className="retry-btn" onClick={loadDestinations}>
              Try Again
            </button>
          </div>
        )}

        {/* DESTINATIONS */}
        {activeTab === "destinations" && !loading && !error && (
          <>
            <p className="results-count">
              {filtered.length} destination
              {filtered.length !== 1 ? "s" : ""} found
            </p>

            <div className="cards-grid">
              {filtered.map((dest) => (
                <DestinationCard key={dest.id || dest.name} dest={dest} />
              ))}
            </div>
          </>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="about-section">
            <h2 className="about-title">About WanderWise</h2>

            <p className="about-text">
              WanderWise is a smart travel recommendation platform designed to
              help users explore the world with ease and confidence. It removes
              the stress of travel planning by suggesting personalized
              destinations based on user preferences such as adventure,
              relaxation, culture, luxury, and romance. The goal of WanderWise
              is to transform complicated travel research into a simple,
              enjoyable, and inspiring experience. It helps users discover new
              places, plan better journeys, and create unforgettable memories
              without wasting time searching across multiple platforms.
            </p>
          </div>
        )}

        {/* TRIP PLAN */}
        {activeTab === "tripplan" && (
          <div className="tripplan-section">
            <h2 className="tripplan-title">🧭 Plan Your Journey</h2>

            {tripError && <p className="trip-error">{tripError}</p>}

            <div className="trip-input-box">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="trip-select"
              >
                <option value="">Select Destination</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="trip-input"
              />

              <button className="retry-btn" onClick={generateTripPlan}>
                Generate Itinerary
              </button>
            </div>

            {tripPlan && (
              <div className="trip-timeline">
                <h3 className="trip-destination">✈️ {tripPlan.destination}</h3>

                <div className="trip-cards">
                  {tripPlan.itinerary.map((item) => (
                    <div key={item.day} className="trip-card">
                      <div className="trip-day">Day {item.day}</div>
                      <div className="trip-plan-text">{item.plan}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
