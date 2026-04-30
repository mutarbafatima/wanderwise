import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({
  handleTabClick,
  activeTab,
  search,
  setSearch,
}) {
  const [scrolled, setScrolled] = useState(false);

  // Add shadow to navbar when user scrolls down
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
        {/* SEARCH BAR (NEW) */}
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
            <a
              href="#"
              className={activeTab === "destinations" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("destinations");
              }}
            >
              Destination
            </a>
          </li>

          <li>
            <a
              href="#"
              className={activeTab === "about" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("about");
              }}
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#"
              className={activeTab === "tripplan" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("tripplan");
              }}
            >
              Trip Plan
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
