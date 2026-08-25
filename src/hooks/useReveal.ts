import { useEffect } from "react";

/**
 * Adds the `is-in` class to every `.reveal` element as it scrolls into view.
 * One observer for the whole page; respects prefers-reduced-motion via CSS.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Safety net: if the observer never fires (e.g. inside a preview iframe),
    // reveal everything so no section is ever left blank.
    const fallback = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("is-in"));
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}
