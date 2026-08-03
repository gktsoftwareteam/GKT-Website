import React from "react";

/* Lightweight, dependency-free line icon set used across the site. */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const CodeIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <polyline points="9 8 4 12 9 16" />
    <polyline points="15 8 20 12 15 16" />
  </svg>
);

export const AppIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <line x1="10" y1="19" x2="14" y2="19" />
  </svg>
);

export const DesignIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <path d="M3 21c1-4 2-8 6-9l9-9 3 3-9 9c-1 4-5 5-9 6z" />
  </svg>
);

export const CloudIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.3 8.2 4 4 0 0 1 17 16H7z" />
  </svg>
);

export const DataIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);

export const AiIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17.1 17.1l2 2M19.1 4.9l-2 2M6.9 17.1l-2 2" />
  </svg>
);

export const ConsultingIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <circle cx="9" cy="9" r="3" />
    <path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" />
    <path d="M16 4.2a3 3 0 0 1 0 5.6" />
    <path d="M18 20c0-2.6-1.7-4.3-4-4.9" />
  </svg>
);

export const CheckIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ArrowRightIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);

export const ChevronDownIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6-4.9-4.5 6.6-.8z" />
  </svg>
);

export const MailIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 2 5.2 2 2 0 0 1 4 4z" />
  </svg>
);

export const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const LinkedinIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9.5 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4z" />
  </svg>
);

export const TwitterIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.7 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.3-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.4a11.4 11.4 0 0 0 6.2 1.8c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.1z" />
  </svg>
);

export const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
