import React from "react";
import useReveal from "./useReveal";
import { ArrowRightIcon, CodeIcon, AppIcon, DesignIcon, CloudIcon, DataIcon, AiIcon } from "./Icons";
import "../css/services.css";

const SERVICES = [
  {
    icon: CodeIcon,
    title: "Software Development",
    desc: "Custom platforms, internal tools and SaaS products engineered for reliability and scale.",
  },
  {
    icon: AppIcon,
    title: "Mobile App Development",
    desc: "Native and cross-platform apps for iOS and Android with smooth, native-feeling UX.",
  },
  {
    icon: DesignIcon,
    title: "UI/UX Design",
    desc: "Research-driven interfaces that make complex products feel simple and delightful.",
  },
  {
    icon: CloudIcon,
    title: "Cloud Solutions",
    desc: "Cloud architecture, migration and DevOps that keep infrastructure fast and resilient.",
  },
  {
    icon: DataIcon,
    title: "Data Analytics",
    desc: "Pipelines and dashboards that turn scattered data into decisions you can act on.",
  },
  {
    icon: AiIcon,
    title: "AI Solutions",
    desc: "Applied AI — from copilots to automation — built around real business workflows.",
  },
];

function Services() {
  const ref = useReveal();

  return (
    <section className="section section--surface services" id="services" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            What We Do
          </p>
          <h2>Services built around your roadmap</h2>
          <p>
            Every engagement pairs a dedicated product mindset with deep technical
            expertise — so you get software that fits the business, not the other
            way around.
          </p>
        </div>

        <div className="grid-3 services__grid">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <article className={`service-card reveal reveal-delay-${(i % 4) + 1}`} key={service.title}>
                <div className="service-card__icon">
                  <Icon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <a href="#contact" className="service-card__link">
                  Learn more <ArrowRightIcon />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
