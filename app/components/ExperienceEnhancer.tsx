"use client";

import { useEffect } from "react";

export default function ExperienceEnhancer() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    root.classList.add("motion-ready");

    const updateScrollState = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollRatio = Math.min(window.scrollY / maxScroll, 1);
      header?.classList.toggle("is-condensed", window.scrollY > 28);
      progress?.style.setProperty("transform", `scaleX(${scrollRatio})`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    revealTargets.forEach((target) => observer.observe(target));
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollState);
      root.classList.remove("motion-ready");
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
