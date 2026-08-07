import React from "react";
import useReveal from "./useReveal";
import "../css/technologies.css";

const STACK_ROWS = [
  ["React", "Node.js", "TypeScript", "Next.js", "GraphQL", "Redux", "Vue", "Angular"],
  ["Swift", "Kotlin", "Flutter", "React Native", "AWS", "Azure", "Google Cloud", "Docker"],
  ["Kubernetes", "PostgreSQL", "MongoDB", "Python", "TensorFlow", "Power BI", "Figma", "Terraform"],
];

function Technologies() {
  const ref = useReveal();

  return (
    <section className="section technologies" id="technologies" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Our Toolkit
          </p>
          <h2>Technologies we build with</h2>
          <p>
            We stay deliberately stack-agnostic and pick the right tools for your
            product, not the ones we happen to know.
          </p>
        </div>
      </div>

      <div className="technologies__marquee reveal">
        {STACK_ROWS.map((row, i) => (
          <div className={`marquee-row marquee-row--${i % 2 === 0 ? "left" : "right"}`} key={i}>
            <div className="marquee-track">
              {[...row, ...row].map((tech, idx) => (
                <span className="tech-pill" key={`${tech}-${idx}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Technologies;
