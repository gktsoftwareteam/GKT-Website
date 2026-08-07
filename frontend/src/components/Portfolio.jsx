import React, { useState } from "react";
import useReveal from "./useReveal";
import { ArrowRightIcon } from "./Icons";
import "../css/portfolio.css";

const FILTERS = ["All", "Web", "Mobile", "Cloud", "AI"];

const PROJECTS = [
  { title: "FinTrack Ledger", category: "Web", tags: ["React", "Node.js"], hue: 1, blurb: "A real-time expense platform for finance teams managing multi-entity budgets." },
  { title: "RoutePilot", category: "Mobile", tags: ["React Native"], hue: 2, blurb: "A logistics app helping fleet drivers cut delivery time with smart routing." },
  { title: "ClinicOS", category: "Cloud", tags: ["AWS", "Node.js"], hue: 3, blurb: "A HIPAA-ready cloud platform coordinating patient records across clinics." },
  { title: "InsightIQ", category: "AI", tags: ["Python", "TensorFlow"], hue: 4, blurb: "A forecasting engine that turns retail sales data into demand predictions." },
  { title: "Marketly", category: "Web", tags: ["Next.js", "GraphQL"], hue: 2, blurb: "A headless commerce storefront built for a DTC apparel brand's global launch." },
  { title: "CrewSync", category: "Mobile", tags: ["Flutter"], hue: 3, blurb: "A workforce scheduling app that reduced shift conflicts by 40% in six weeks." },
];

function Portfolio() {
  const ref = useReveal();
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <section className="section section--surface portfolio" id="portfolio" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Our Work
          </p>
          <h2>Selected projects, real outcomes</h2>
          <p>A snapshot of products we've helped design, build and launch across industries.</p>
        </div>

        <div className="portfolio__filters reveal">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`portfolio__filter ${active === f ? "portfolio__filter--active" : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid-3 portfolio__grid">
          {filtered.map((project, i) => (
            <article className={`portfolio-card portfolio-card--hue${project.hue} reveal reveal-delay-${(i % 4) + 1}`} key={project.title}>
              <div className="portfolio-card__media">
                <span className="portfolio-card__category">{project.category}</span>
              </div>
              <div className="portfolio-card__body">
                <h3>{project.title}</h3>
                <p>{project.blurb}</p>
                <div className="portfolio-card__tags">
                  {project.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a href="#contact" className="portfolio-card__link">
                  View case study <ArrowRightIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
