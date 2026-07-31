import React, { useEffect, useState } from "react";
import { ArrowRightIcon, CheckIcon } from "./Icons";
import "../css/hero.css";

const CODE_LINES = [
  { indent: 0, text: "const product = await gkt.build({" },
  { indent: 1, text: "stack: ['react', 'node', 'cloud']," },
  { indent: 1, text: "design: 'human-centered'," },
  { indent: 1, text: "timeline: 'weeks, not quarters'," },
  { indent: 0, text: "});" },
  { indent: 0, text: "" },
  { indent: 0, text: "product.ship(); // 🚀 live" },
];

const STATS = [
  { value: "10+", label: "Products shipped" },
  { value: "24/7", label: "Support Availablity" },
  { value: "98%", label: "Client retention" },
];

function useTypedCode(lines, speed = 22) {
  const [output, setOutput] = useState([]);

  useEffect(() => {
    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;
    const built = [];

    function tick() {
      if (cancelled) return;
      if (lineIndex >= lines.length) return;

      const currentLine = lines[lineIndex];
      charIndex += 1;
      built[lineIndex] = currentLine.text.slice(0, charIndex);
      setOutput([...built]);

      if (charIndex >= currentLine.text.length) {
        lineIndex += 1;
        charIndex = 0;
        setTimeout(tick, 160);
      } else {
        setTimeout(tick, speed);
      }
    }

    const starter = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      clearTimeout(starter);
    };
  }, [lines, speed]);

  return output;
}

function Hero() {
  const typed = useTypedCode(CODE_LINES);

  return (
    <section className="hero" id="home">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__blob hero__blob--one" />
        <div className="hero__blob hero__blob--two" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Software · Web · Mobile · Cloud · Data · AI</p>
          <h1>
            We engineer digital products that
            <span className="hero__highlight"> move your business forward.</span>
          </h1>
          <p className="hero__lead">
            GKT Technology partners with ambitious teams to design, build and scale
            software, apps and cloud platforms — backed by data and AI so every
            release compounds into real growth.
          </p>

          <div className="hero__cta-row">
            <a href="#contact" className="btn btn-primary">
              Start Your Project <ArrowRightIcon />
            </a>
            <a href="#services" className="btn btn-outline">
              Explore Services
            </a>
          </div>

          <ul className="hero__trust">
            <li>
              <CheckIcon /> Fixed-scope delivery
            </li>
            <li>
              <CheckIcon /> Dedicated engineering pod
            </li>
            <li>
              <CheckIcon /> Post-launch support
            </li>
          </ul>
        </div>

        <div className="hero__visual reveal">
          <div className="hero__panel" role="img" aria-label="Illustrative code editor showing a product build script">
            <div className="hero__panel-bar">
              <span className="hero__dot hero__dot--red" />
              <span className="hero__dot hero__dot--yellow" />
              <span className="hero__dot hero__dot--green" />
              <span className="hero__panel-title">build.js</span>
            </div>
            <pre className="hero__panel-code">
              {typed.map((line, i) => (
                <div key={i} className="hero__code-line">
                  <span className="hero__line-no">{i + 1}</span>
                  <span style={{ paddingLeft: `${(CODE_LINES[i]?.indent || 0) * 1.1}em` }}>
                    {line}
                    {i === typed.length - 1 && <span className="hero__caret" />}
                  </span>
                </div>
              ))}
            </pre>
          </div>

          <div className="hero__float hero__float--uptime">
            <strong>99.9%</strong>
            <span>Platform uptime</span>
          </div>
          <div className="hero__float hero__float--deploy">
            <strong>2.4x</strong>
            <span>Faster time-to-market</span>
          </div>
        </div>
      </div>

      <div className="hero__stats">
        <div className="container hero__stats-row">
          {STATS.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
