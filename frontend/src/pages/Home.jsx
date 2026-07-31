import React from "react";
import Hero from "../components/Hero";
import Admin from "../admin/Admin";
import About from "../components/About";
import Services from "../components/Services";
import Technologies from "../components/Technologies";
import Solutions from "../components/Solutions";
import Portfolio from "../components/Portfolio";
import Industries from "../components/Industries";
import WhyChooseUs from "../components/WhyChooseUs";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";

function Home() {
  return (
    <>
      <Hero />
      <Admin />
      <About />
      <Services />
      <Technologies />
      <Solutions />
      <Portfolio />
      <Industries />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

export default Home;
