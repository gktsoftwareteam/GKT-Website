import React from "react";
import useReveal from "./useReveal";
import { ArrowRightIcon } from "./Icons";
import "../css/solutions.css";

const SOLUTIONS = [
  {
    tag: "For Startups",
    title: "MVP to Market",
    desc: "Validate faster with a lean, production-ready MVP built to evolve into a full platform without a rewrite.",
    points: ["Rapid prototyping", "Investor-ready demos", "Scalable foundation"],
  },
  {
    tag: "For Enterprise",
    title: "Modernize & Scale",
    desc: "Replace legacy systems with modular, cloud-native architecture that scales with demand and stays secure.",
    points: ["Legacy migration", "Microservices", "Compliance-ready"],
  },
  {
    tag: "For Retail & Commerce",
    title: "Commerce Platforms",
    desc: "Headless storefronts, inventory systems and checkout flows tuned for conversion across every device.",
    points: ["Headless storefronts", "Payments & logistics", "Personalization"],
  },
];

function Solutions() {
  const ref = useReveal();

  return (
    <section className="section solutions" id="solutions" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Solutions</p>
          <h2>Purpose-built solutions for where you are now</h2>
          <p>Not every business needs the same playbook. We shape our approach to your stage, sector and goals.</p>
        </div>

        <div className="solutions__list">
          {SOLUTIONS.map((s, i) => (
            <article className={`solution-row reveal reveal-delay-${(i % 3) + 1}`} key={s.title}>
              <div className="solution-row__index">{String(i + 1).padStart(2, "0")}</div>
              <div className="solution-row__body">
                <span className="solution-row__tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="solution-row__cta" aria-label={`Talk to us about ${s.title}`}>
                <ArrowRightIcon />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Solutions;
