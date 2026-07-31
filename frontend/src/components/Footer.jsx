import React from "react";
import { Link } from "react-router-dom";
import { MailIcon, PinIcon, PhoneIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "./Icons";
import "../css/footer.css";
import Admin from "../admin/Admin";

const FOOTER_LINKS = {
  Company: [
    { label: "About", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
    { label: "Admin", href: "admin"},
  ],
  Services: [
    { label: "Web Development", href: "#services" },
    { label: "Mobile Apps", href: "#services" },
    { label: "UI/UX Design", href: "#services" },
    { label: "Cloud Solutions", href: "#services" },
  ],
  Solutions: [
    { label: "Data Analytics", href: "#solutions" },
    { label: "AI Solutions", href: "#solutions" },
    { label: "IT Consulting", href: "#solutions" },
    { label: "Industries", href: "#industries" },
  ],
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__mark">GKT</span>
            <span>
              GKT <em>Software Solution</em>
            </span>
          </Link>
          <p>
            A full-stack technology partner designing and engineering software,
            apps and cloud platforms for growing businesses.
          </p>
          <ul className="footer__contact">
            <li><PinIcon /> Avadi, Chennai-600054, TamilNadu</li>
            <li><MailIcon /> gktsoftwaresolution@gmail.com</li>
            <li><PhoneIcon /> +91 8778341227</li>
          </ul>
          <div className="footer__socials">
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"><LinkedinIcon /></a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><TwitterIcon /></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><InstagramIcon /></a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div className="footer__col" key={heading}>
            <h4>{heading}</h4>
            <ul>
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-row">
          <p>© {year} GKT Software Solution. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
