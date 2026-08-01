import { useEffect, useRef } from "react";

/**
 * useReveal - attaches an IntersectionObserver to a container ref and
 * toggles the "is-visible" class on any descendant carrying the
 * "reveal" class once it scrolls into the viewport.
 */
export default function useReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const targets = root.classList.contains("reveal")
      ? [root, ...root.querySelectorAll(".reveal")]
      : Array.from(root.querySelectorAll(".reveal"));

    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
