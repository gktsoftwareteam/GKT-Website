# GKT Technology — Corporate Website

A production-ready, fully responsive marketing website for **GKT Technology**, a
software development, web & mobile app development, UI/UX design, cloud,
data analytics, AI and IT consulting company.

Built with **React.js**, **React Router**, plain **CSS** (no CSS frameworks),
functional components and hooks only.

## ✨ Features

- Sticky, blur-backdrop navbar with animated mobile menu
- Hero section with a typing-effect code panel and floating stat cards
- About, Services, Technologies (infinite marquee), Solutions, Portfolio
  (filterable grid), Industries, Why Choose Us, Development Process (timeline),
  Testimonials (slider), FAQ (accordion) and a validated Contact form
- Scroll-triggered reveal animations via `IntersectionObserver`
- Hover micro-interactions across cards, buttons and links
- Fully responsive from 320px to large desktop screens
- Semantic, SEO-friendly HTML with meta tags, `robots.txt` and manifest
- Reduced-motion support and visible keyboard focus states
- Clean, reusable component structure — no UI kits, no TypeScript

## 🗂 Project Structure

```
gkt-technology/
├── public/
│   ├── index.html
│   ├── favicon.svg
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/                 # reserved for future static assets
│   ├── components/             # all reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Technologies.jsx
│   │   ├── Solutions.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Industries.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── Process.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTopButton.jsx
│   │   ├── Icons.jsx            # inline SVG icon set
│   │   └── useReveal.js         # scroll-reveal custom hook
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── NotFound.jsx
│   ├── css/
│   │   ├── variables.css        # design tokens (colors, type, spacing)
│   │   ├── global.css           # resets, utilities, buttons, animations
│   │   └── *.css                # one stylesheet per component/section
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🎨 Design Tokens

| Token | Value |
| --- | --- |
| `--color-primary` | `#0D6EFD` |
| `--color-secondary` | `#4F9DFF` |
| `--color-bg` | `#FFFFFF` |
| `--color-text` | `#1F2937` |

All colors, spacing, typography and radii live in `src/css/variables.css`
as CSS custom properties, so the whole theme can be re-skinned from one file.

Fonts: **Sora** (display/headings), **Inter** (body), **JetBrains Mono**
(code panel & eyebrows) — loaded via Google Fonts in `public/index.html`.

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm start
# App runs at http://localhost:3000

# 3. Build for production
npm run build
# Outputs an optimized build/ folder ready to deploy
```

## 🧱 Tech Stack

- React.js (functional components + hooks: `useState`, `useEffect`, `useRef`)
- React Router DOM (client-side routing)
- Plain CSS with CSS variables (no Tailwind / Bootstrap / MUI)
- JavaScript only (no TypeScript)

## 📌 Notes

- All content (copy, testimonials, project names, team stats) is original
  placeholder content written for GKT Technology — nothing is copied from
  any reference site.
- All visuals are built with CSS (gradients, blobs, cards) and inline SVG
  icons — no external image assets are required to run the project.
- Update contact details, social links and copy in `Contact.jsx` and
  `Footer.jsx` before deploying to production.

## 📄 License

This starter project is provided as-is for GKT Technology's use.
