import React from "react";
import useReveal from "./useReveal";
import "../css/process.css";

const STEPS = [
  { title: "Discover", desc: "We map your goals, users and constraints to define a scope worth building." },
  { title: "Design", desc: "Wireframes and prototypes turn requirements into a validated user experience." },
  { title: "Develop", desc: "Agile sprints with weekly demos, code review and continuous integration." },
  { title: "Deploy", desc: "Staged rollouts, automated testing and monitored cloud releases." },
  { title: "Support", desc: "Post-launch monitoring, iteration and scaling as your usage grows." },
];

function Process() {
  const ref = useReveal();

  return (
    <section className="section process" id="process" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            How We Work
          </p>
          <h2>A development process built for clarity</h2>
          <p>Five stages, one continuous feedback loop — so nothing gets lost between kickoff and launch.</p>
        </div>

        <div className="process__timeline">
          {STEPS.map((step, i) => (
            <div className={`process-step reveal reveal-delay-${(i % 4) + 1}`} key={step.title}>
              <div className="process-step__marker">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
