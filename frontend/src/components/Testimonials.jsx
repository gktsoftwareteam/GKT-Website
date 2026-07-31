import React, { useState } from "react";
import useReveal from "./useReveal";
import { StarIcon, ArrowRightIcon } from "./Icons";
import "../css/testimonials.css";

const TESTIMONIALS = [
  {
    quote:
      "GKT Technology rebuilt our checkout flow in six weeks and conversion jumped almost immediately. They communicate like an internal team, not a vendor.",
    name: "Amara Ellison",
    role: "VP Product, Northline Retail",
    initials: "AE",
  },
  {
    quote:
      "We came to them with a messy legacy system and left with a cloud platform our engineers actually enjoy working in. The migration had zero downtime.",
    name: "Daniel Ruiz",
    role: "CTO, Verdant Health",
    initials: "DR",
  },
  {
    quote:
      "Their design team pushed back on our first brief in the best way — the product we shipped was sharper because of it. Genuinely collaborative partners.",
    name: "Priya Nathan",
    role: "Founder, Loopwave",
    initials: "PN",
  },
];

function Testimonials() {
  const ref = useReveal();
  const [index, setIndex] = useState(0);

  const goTo = (i) => setIndex((i + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="section section--surface testimonials" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Testimonials
          </p>
          <h2>What our partners say</h2>
        </div>

        <div className="testimonial-slider reveal">
          <div className="testimonial-card">
            <div className="testimonial-card__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="testimonial-card__quote">"{TESTIMONIALS[index].quote}"</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__avatar">{TESTIMONIALS[index].initials}</span>
              <div>
                <strong>{TESTIMONIALS[index].name}</strong>
                <span>{TESTIMONIALS[index].role}</span>
              </div>
            </div>
          </div>

          <div className="testimonial-slider__controls">
            <button aria-label="Previous testimonial" onClick={() => goTo(index - 1)}>
              <ArrowRightIcon style={{ transform: "rotate(180deg)" }} />
            </button>
            <div className="testimonial-slider__dots">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  className={`testimonial-slider__dot ${i === index ? "is-active" : ""}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button aria-label="Next testimonial" onClick={() => goTo(index + 1)}>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
