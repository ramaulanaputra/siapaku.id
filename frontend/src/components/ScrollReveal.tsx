"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — initializes IntersectionObserver for all [data-scroll] elements.
 * Adds .scroll-ready to <html> only after observer is set up, so content
 * stays visible if JS fails to load (graceful degradation).
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Small delay to ensure DOM is ready and painted
    const timer = setTimeout(() => {
      const scrollElements = document.querySelectorAll("[data-scroll]");
      if (scrollElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -20px 0px",
        }
      );

      // Observe all scroll elements
      scrollElements.forEach((el) => observer.observe(el));

      // NOW safe to hide elements — observer is watching
      document.documentElement.classList.add("scroll-ready");

      // Immediately reveal elements already in viewport
      scrollElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("revealed");
        }
      });

      // Parallax scroll tracking
      const handleScroll = () => {
        document.documentElement.style.setProperty("--scrollY", window.scrollY.toString());
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
