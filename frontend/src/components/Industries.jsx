import React from "react";
import useReveal from "./useReveal";
import "../css/industries.css";

const INDUSTRIES = [
  { name: "FinTech", desc: "Secure ledgers, payments and compliance-first platforms." },
  { name: "Healthcare", desc: "Patient-centered systems built for privacy and scale." },
  { name: "Retail & E-commerce", desc: "Storefronts and inventory tools tuned for conversion." },
  { name: "Logistics", desc: "Real-time tracking and routing across complex fleets." },
  { name: "EdTech", desc: "Learning platforms that keep students and staff engaged." },
  { name: "Real Estate", desc: "Listing, CRM and visualization tools for property teams." },
  { name: "Manufacturing", desc: "IoT dashboards and workflow automation on the floor." },
  { name: "Media & Entertainment", desc: "Streaming, content and audience platforms at scale." },
];

function Industries() {
  const ref = useReveal();

  return (
    <section className="section industries" id="industries" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Industries
          </p>
          <h2>Domain expertise across sectors</h2>
          <p>We bring pattern-recognition from dozens of builds to whatever industry you operate in.</p>
        </div>

        <div className="industries__grid">
          {INDUSTRIES.map((ind, i) => (
            <div className={`industry-tile reveal reveal-delay-${(i % 4) + 1}`} key={ind.name}>
              <h3>{ind.name}</h3>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Industries;
