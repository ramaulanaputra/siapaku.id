"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — Robust IntersectionObserver for [data-scroll] elements.
 * 
 * Fixes:
 * - Elements already in viewport are revealed immediately
 * - Elements scrolled PAST (above viewport) are revealed immediately
 * - Fallback timer reveals any stuck elements after 3s
 * - Scroll listener catches fast-scrolling edge cases
 * - Graceful degradation if JS fails
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Wait for first paint
    requestAnimationFrame(() => {
      const scrollElements = document.querySelectorAll("[data-scroll]");
      if (scrollElements.length === 0) return;

      const revealElement = (el: Element) => {
        if (!el.classList.contains("revealed")) {
          el.classList.add("revealed");
        }
      };

      const isInOrAboveViewport = (el: Element): boolean => {
        const rect = el.getBoundingClientRect();
        // Element is in viewport OR has been scrolled past (above viewport)
        return rect.top < window.innerHeight + 100 && rect.bottom > -100;
      };

      // Set up IntersectionObserver with generous margins
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealElement(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.01, // Trigger very early
          rootMargin: "100px 0px 0px 0px", // Extra margin at top for scrolled-past elements
        }
      );

      // Observe all elements
      scrollElements.forEach((el) => observer.observe(el));

      // NOW safe to enable hide-before-reveal CSS
      document.documentElement.classList.add("scroll-ready");

      // Immediately reveal elements already in or above viewport
      // Use rAF to ensure CSS has been applied
      requestAnimationFrame(() => {
        scrollElements.forEach((el) => {
          if (isInOrAboveViewport(el)) {
            revealElement(el);
          }
        });
      });

      // Scroll-based fallback: catch any elements missed by observer
      let scrollTimeout: number;
      const handleScroll = () => {
        // Update CSS variable for parallax
        document.documentElement.style.setProperty("--scrollY", window.scrollY.toString());

        // Debounced check for unrevealed elements
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          scrollElements.forEach((el) => {
            if (!el.classList.contains("revealed") && isInOrAboveViewport(el)) {
              revealElement(el);
              observer.unobserve(el);
            }
          });
        }, 50);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Ultimate fallback: reveal everything after 4 seconds
      // This prevents any content from being permanently stuck invisible
      const fallbackTimer = setTimeout(() => {
        scrollElements.forEach((el) => revealElement(el));
      }, 4000);

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(fallbackTimer);
        clearTimeout(scrollTimeout);
      };
    });
  }, []);

  return null;
}
