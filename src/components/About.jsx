import React from "react";
import useReveal from "./useReveal";
import { CheckIcon } from "./Icons";
import "../css/about.css";

const POINTS = [
  "Cross-functional pods of engineers, designers & strategists",
  "Transparent sprints with weekly demos, not black-box delivery",
  "Security and performance baked into every build",
];

function About() {
  const ref = useReveal();

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container about__grid">
        <div className="about__visual reveal">
          <div className="about__card about__card--main">
            <div className="about__card-header">
              <span className="about__badge">Est. 2026</span>
              <span className="about__badge about__badge--outline">Chennai · Remote-first</span>
            </div>
            <div className="about__metric-grid">
              <div>
                <strong>4.9/5</strong>
                <span>Average client rating</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support coverage</span>
              </div>
            </div>
          </div>
          <div className="about__card about__card--floating reveal reveal-delay-2">
            <span className="about__pulse" aria-hidden="true" />
            Actively shipping — 12 sprints in progress
          </div>
        </div>

        <div className="about__copy">
          <p className="eyebrow reveal">About GKT Technology</p>
          <h2 className="reveal reveal-delay-1">
            We turn ambitious ideas into dependable, scalable technology.
          </h2>
          <p className="about__lead reveal reveal-delay-2">
            GKT Technology is a full-stack digital partner for founders and
            enterprises alike. From the first wireframe to a global cloud
            rollout, we combine product strategy, design craft and engineering
            discipline so every release is stable, secure and built to grow.
          </p>
          <ul className="about__points reveal reveal-delay-3">
            {POINTS.map((point) => (
              <li key={point}>
                <CheckIcon /> {point}
              </li>
            ))}
          </ul>
          <a href="#services" className="btn btn-outline reveal reveal-delay-4">
            See how we work
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
