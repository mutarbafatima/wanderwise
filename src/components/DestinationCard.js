// FILE: components/DestinationCard.js

import React, { useState, useRef } from "react";
import "./DestinationCard.css";

const FALLBACK =
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80";

export default function DestinationCard({ dest, isFav, onToggleFav }) {
  const [imgErr, setImgErr] = useState(false);
  const [modal, setModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoad, setWeatherLoad] = useState(false);

  const cardRef = useRef(null);

  const imgSrc = imgErr || !dest.imageUrl ? FALLBACK : dest.imageUrl;

  // ── 3D TILT EFFECT ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    card.style.transition = "transform 0.15s ease, box-shadow 0.15s ease";
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(196,98,58,0.18)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.boxShadow = "";
  };

  // ── WEATHER ──
  const fetchWeather = async (e) => {
    e.stopPropagation();

    if (weather) {
      setWeather(null);
      return;
    }

    setWeatherLoad(true);

    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          dest.country,
        )}&count=1`,
      ).then((r) => r.json());

      const loc = geo.results?.[0];
      if (!loc) throw new Error("Location not found");

      const wx = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`,
      ).then((r) => r.json());

      const code = wx.current_weather?.weathercode;
      const temp = wx.current_weather?.temperature;

      const getIcon = (c) => {
        if (c === 0) return "☀️";
        if (c <= 3) return "🌤️";
        if (c <= 48) return "🌫️";
        if (c <= 67) return "🌧️";
        if (c <= 77) return "❄️";
        if (c <= 82) return "🌦️";
        return "⛈️";
      };

      setWeather({ temp, icon: getIcon(code) });
    } catch {
      setWeather({ temp: "N/A", icon: "🌍" });
    } finally {
      setWeatherLoad(false);
    }
  };

  // ── MAP ──
  const openMap = (e) => {
    e.stopPropagation();
    const query = `${dest.name}, ${dest.country}`;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query,
      )}`,
      "_blank",
    );
  };

  return (
    <>
      {/* ── CARD ── */}
      <div
        className="dest-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* IMAGE */}
        <div className="card-img-wrap">
          <img src={imgSrc} alt={dest.name} onError={() => setImgErr(true)} />

          <div className="card-badge">{dest.travelVibe || dest.travelType}</div>
          <div className="card-cost-badge">{dest.estimatedCost}</div>

          {/* WEATHER */}
          <button
            className={`weather-btn ${weather ? "active" : ""}`}
            onClick={fetchWeather}
          >
            {weatherLoad ? (
              <span className="weather-spin" />
            ) : weather ? (
              `${weather.icon} ${weather.temp}°C`
            ) : (
              "🌡️"
            )}
          </button>

          {/* MAP */}
          <button className="map-btn" onClick={openMap}>
            🌍
          </button>

          {/* FAVORITE */}
          <button
            className={`fav-btn ${isFav ? "saved" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav && onToggleFav(dest);
            }}
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>

        {/* BODY */}
        <div className="card-body">
          <div className="card-country">📍 {dest.country}</div>
          <div className="card-name">{dest.name}</div>
          <div className="card-desc">{dest.description}</div>

          <div className="card-pills">
            <span className="pill">🌤 {dest.bestSeason}</span>
            <span className="pill">⏱ {dest.idealDuration}</span>
          </div>

          <div className="card-footer">
            <div className="card-cost">
              <div className="cost-label">Est. Cost</div>
              <div className="cost-value">{dest.estimatedCost}</div>
            </div>

            <button className="btn-details" onClick={() => setModal(true)}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL (ENHANCED VERSION) ── */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="modal">
            {/* IMAGE HEADER */}
            <div className="modal-img-wrap">
              <img src={imgSrc} alt={dest.name} />

              <button className="modal-close" onClick={() => setModal(false)}>
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="modal-body">
              <p className="modal-country">
                📍 {dest.country} {dest.region ? `· ${dest.region}` : ""}
              </p>

              <h2 className="modal-name">{dest.name}</h2>
              <p className="modal-desc">{dest.description}</p>

              {/* DETAILS GRID */}
              <div className="modal-grid">
                <div className="modal-detail">
                  <span className="detail-label">Estimated Cost</span>
                  <span className="detail-value">{dest.estimatedCost}</span>
                </div>

                <div className="modal-detail">
                  <span className="detail-label">Best Season</span>
                  <span className="detail-value">{dest.bestSeason}</span>
                </div>

                <div className="modal-detail">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{dest.idealDuration}</span>
                </div>

                <div className="modal-detail">
                  <span className="detail-label">Travel Style</span>
                  <span className="detail-value">{dest.travelVibe}</span>
                </div>
              </div>

              {/* HIGHLIGHTS */}
              {dest.highlights?.length > 0 && (
                <div className="modal-highlights">
                  <p className="highlights-title">Top Highlights</p>
                  <ul className="highlights-list">
                    {dest.highlights.map((h, i) => (
                      <li key={i}>→ {h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* INSIDER TIP */}
              {dest.insiderTip && (
                <div className="modal-tip">
                  <p className="tip-title">✦ Insider Tip</p>
                  <p className="tip-text">{dest.insiderTip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
