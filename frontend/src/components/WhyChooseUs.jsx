import React from "react";
import useReveal from "./useReveal";
import { CheckIcon, ConsultingIcon, CloudIcon, DataIcon, DesignIcon } from "./Icons";
import "../css/why-choose-us.css";

const REASONS = [
  {
    icon: ConsultingIcon,
    title: "Senior talent only",
    desc: "No trainee benches. Every engagement is staffed with senior engineers and designers.",
  },
  {
    icon: DesignIcon,
    title: "Design-led engineering",
    desc: "Product design and development sit in the same room, so UX never gets lost in translation.",
  },
  {
    icon: CloudIcon,
    title: "Built to scale",
    desc: "Cloud-native architecture from day one means growth never forces a rebuild.",
  },
  {
    icon: DataIcon,
    title: "Data-informed decisions",
    desc: "We instrument what we build, so your roadmap is guided by real usage, not guesses.",
  },
];

function WhyChooseUs() {
  const ref = useReveal();

  return (
    <section className="section section--navy why-us" ref={ref}>
      <div className="container why-us__grid">
        <div className="why-us__copy">
          <p className="eyebrow reveal" style={{ color: "var(--color-secondary)" }}>
            Why Choose Us
          </p>
          <h2 className="reveal reveal-delay-1">A technology partner that acts like an extension of your team</h2>
          <p className="why-us__lead reveal reveal-delay-2">
            We've built our process around the things that actually slow product
            teams down — vague scopes, silent engineers and hand-offs that lose
            context. Here's how we fix that.
          </p>
          <ul className="why-us__checklist reveal reveal-delay-3">
            <li><CheckIcon /> Weekly demos, not quarterly surprises</li>
            <li><CheckIcon /> Direct access to your engineering pod</li>
            <li><CheckIcon /> Clear, fixed-scope contracts</li>
          </ul>
        </div>

        <div className="why-us__reasons">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div className={`reason-card reveal reveal-delay-${(i % 4) + 1}`} key={reason.title}>
                <div className="reason-card__icon">
                  <Icon />
                </div>
                <h3>{reason.title}</h3>
                <p>{reason.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
