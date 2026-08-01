import React, { useEffect, useState } from "react";
import "../css/scroll-to-top.css";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-top ${visible ? "scroll-top--visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
