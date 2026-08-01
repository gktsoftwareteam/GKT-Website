import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, CloseIcon, ArrowRightIcon } from "./Icons";
import "../css/navbar.css";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Industries", href: "#industries" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={handleLinkClick}>
          <span className="navbar__mark" aria-hidden="true">
            GKT
          </span>
          <span className="navbar__brand-text">
            GKT <em>Software Solution</em>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a href="#contact" className="btn btn-primary btn-sm">
            Start a Project <ArrowRightIcon />
          </a>
        </div>

        <button
          className="navbar__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn btn-primary" onClick={handleLinkClick}>
          Start a Project <ArrowRightIcon />
        </a>
      </div>
    </header>
  );
}

export default Navbar;
