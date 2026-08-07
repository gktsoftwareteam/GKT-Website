import React, { useState } from "react";
import useReveal from "./useReveal";
import { ChevronDownIcon } from "./Icons";
import "../css/faq.css";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Most MVPs launch in 6–10 weeks, while larger platform builds run 3–6 months. We scope every project into fixed milestones so you always know what's shipping and when.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Yes — a large share of our work is with founders going from idea to first release. We can also plug into an existing in-house team as a specialist pod.",
  },
  {
    q: "What does the pricing structure look like?",
    a: "We offer fixed-scope pricing for defined projects and monthly retainers for ongoing product teams. You'll get a detailed proposal before any commitment.",
  },
  {
    q: "Who owns the code and IP after launch?",
    a: "You do, fully. Source code, designs and documentation are handed over under a standard IP assignment as part of every contract.",
  },
  {
    q: "Can you take over an existing codebase?",
    a: "Absolutely. We regularly audit and take ownership of in-progress or legacy codebases, starting with a technical review before any new work begins.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Every project includes a post-launch warranty window, and most clients move into a monthly support and iteration retainer afterward.",
  },
];

function FAQ() {
  const ref = useReveal();
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <section className="section faq" id="faq" ref={ref}>
      <div className="container faq__grid">
        <div className="faq__intro reveal">
          <p className="eyebrow">FAQ</p>
          <h2>Questions, answered</h2>
          <p className="faq__intro-copy">
            Can't find what you're looking for? Reach out and we'll get back to
            you within one business day.
          </p>
          <a href="#contact" className="btn btn-primary">
            Ask us directly
          </a>
        </div>

        <div className="faq__list">
          {FAQS.map((item, i) => (
            <div className={`faq-item reveal reveal-delay-${(i % 4) + 1} ${openIndex === i ? "faq-item--open" : ""}`} key={item.q}>
              <button
                className="faq-item__question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <ChevronDownIcon className="faq-item__chevron" />
              </button>
              <div className="faq-item__answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
