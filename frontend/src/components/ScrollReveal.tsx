"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — initializes IntersectionObserver for all [data-scroll] elements.
 * Drop this component once in your layout and every element with data-scroll
 * will animate when it enters the viewport.
 *
 * Usage in any component:
 *   <div data-scroll="up">...</div>
 *   <div data-scroll="left" data-delay="200">...</div>
 *
 * Directions: up, down, left, right, zoom-in, zoom-out, fade, blur, rotate-in, slide-up-blur
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Only reveal once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const scrollElements = document.querySelectorAll("[data-scroll]");
    scrollElements.forEach((el) => observer.observe(el));

    // Parallax scroll tracking (updates CSS custom property)
    const handleScroll = () => {
      document.documentElement.style.setProperty("--scrollY", window.scrollY.toString());
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
