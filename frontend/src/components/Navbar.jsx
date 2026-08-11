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

  // Detect page scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu when screen becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close menu when ESC is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`navbar ${
        scrolled ? "navbar--scrolled" : ""
      } ${menuOpen ? "navbar--menu-open" : ""}`}
    >
      <div className="container navbar__inner">

        {/* Logo */}
        <Link
          to="/"
          className="navbar__brand"
          onClick={handleLinkClick}
        >
          <span
            className="navbar__mark"
            aria-hidden="true"
          >
            GKT
          </span>

          <span className="navbar__brand-text">
            GKT <em>Software Solution</em>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="navbar__links"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          <a
            href="#contact"
            className="btn btn-primary btn-sm"
            onClick={handleLinkClick}
          >
            Start a Project
            <ArrowRightIcon />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar__toggle"
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`navbar__mobile ${
          menuOpen ? "navbar__mobile--open" : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">

          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </a>
          ))}

        </nav>

        <a
          href="#contact"
          className="btn btn-primary navbar__mobile-cta"
          onClick={handleLinkClick}
          tabIndex={menuOpen ? 0 : -1}
        >
          Start a Project
          <ArrowRightIcon />
        </a>
      </div>
    </header>
  );
}

export default Navbar;