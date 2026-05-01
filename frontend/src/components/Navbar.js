import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({
  handleTabClick,
  activeTab,
  search,
  setSearch,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Logo */}
      <div
        className="navbar-logo"
        onClick={() => handleTabClick("destinations")}
        style={{ cursor: "pointer" }}
      >
        <span className="logo-icon">✦</span>
        Wander<span className="logo-accent">Wise</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="navbar-search"
        />

        {/* Links */}
        <ul className="navbar-links">
          <li>
            <button
              className={activeTab === "destinations" ? "active" : ""}
              onClick={() => handleTabClick("destinations")}
            >
              Destination
            </button>
          </li>

          <li>
            <button
              className={activeTab === "about" ? "active" : ""}
              onClick={() => handleTabClick("about")}
            >
              About
            </button>
          </li>

          <li>
            <button
              className={activeTab === "tripplan" ? "active" : ""}
              onClick={() => handleTabClick("tripplan")}
            >
              Trip Plan
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
