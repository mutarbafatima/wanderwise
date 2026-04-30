import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({
  handleTabClick = () => {},
  activeTab = "destinations",
  search = "",
  setSearch = () => {},
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* LOGO */}
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
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="navbar-search"
        />

        {/* LINKS */}
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
