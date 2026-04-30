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

  // ✅ SAFE OBJECT (prevents undefined crash)
  const safeDest = dest || {};

  // ✅ SAFE IMAGE HANDLING
  const imgSrc = imgErr || !safeDest.imageUrl ? FALLBACK : safeDest.imageUrl;

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
          safeDest.country || "",
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
    } catch (err) {
      setWeather({ temp: "N/A", icon: "🌍" });
    } finally {
      setWeatherLoad(false);
    }
  };

  // ── MAP ──
  const openMap = (e) => {
    e.stopPropagation();

    const query = `${safeDest.name || ""}, ${safeDest.country || ""}`;

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
          <img
            src={imgSrc}
            alt={safeDest.name || "destination"}
            onError={() => setImgErr(true)}
          />

          <div className="card-badge">
            {safeDest.travelVibe || safeDest.travelType || "Explore"}
          </div>

          <div className="card-cost-badge">
            {safeDest.estimatedCost || "N/A"}
          </div>

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
              onToggleFav && onToggleFav(safeDest);
            }}
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>

        {/* BODY */}
        <div className="card-body">
          <div className="card-country">📍 {safeDest.country || "Unknown"}</div>

          <div className="card-name">{safeDest.name || "Untitled"}</div>

          <div className="card-desc">
            {safeDest.description || "No description available"}
          </div>

          <div className="card-pills">
            <span className="pill">🌤 {safeDest.bestSeason || "N/A"}</span>
            <span className="pill">⏱ {safeDest.idealDuration || "N/A"}</span>
          </div>

          <div className="card-footer">
            <div className="card-cost">
              <div className="cost-label">Est. Cost</div>
              <div className="cost-value">
                {safeDest.estimatedCost || "N/A"}
              </div>
            </div>

            <button className="btn-details" onClick={() => setModal(true)}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="modal">
            <div className="modal-img-wrap">
              <img src={imgSrc} alt={safeDest.name || "destination"} />

              <button className="modal-close" onClick={() => setModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-country">
                📍 {safeDest.country || "Unknown"}
              </p>

              <h2 className="modal-name">{safeDest.name || "Untitled"}</h2>

              <p className="modal-desc">
                {safeDest.description || "No description available"}
              </p>

              {/* DETAILS */}
              <div className="modal-grid">
                <div className="modal-detail">
                  <span>Estimated Cost</span>
                  <span>{safeDest.estimatedCost || "N/A"}</span>
                </div>

                <div className="modal-detail">
                  <span>Best Season</span>
                  <span>{safeDest.bestSeason || "N/A"}</span>
                </div>

                <div className="modal-detail">
                  <span>Duration</span>
                  <span>{safeDest.idealDuration || "N/A"}</span>
                </div>

                <div className="modal-detail">
                  <span>Travel Style</span>
                  <span>{safeDest.travelVibe || "N/A"}</span>
                </div>
              </div>

              {/* HIGHLIGHTS SAFE */}
              {Array.isArray(safeDest.highlights) &&
                safeDest.highlights.length > 0 && (
                  <div className="modal-highlights">
                    <p>Top Highlights</p>
                    <ul>
                      {safeDest.highlights.map((h, i) => (
                        <li key={i}>→ {h}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* INSIDER TIP */}
              {safeDest.insiderTip && (
                <div className="modal-tip">
                  <p>✦ Insider Tip</p>
                  <p>{safeDest.insiderTip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
