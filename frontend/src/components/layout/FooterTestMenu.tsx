"use client";

import { useState } from "react";
import Link from "next/link";

export function FooterTestMenu() {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200 flex items-center gap-1.5"
      >
        <span>Tes SIAPA AKU</span>
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-2 pl-3 border-l border-white/10">
          <li>
            <Link
              href="/test"
              className="text-white/40 hover:text-white/70 text-xs transition-colors duration-200"
            >
              Tes MBTI
            </Link>
          </li>
          <li>
            <span className="text-white/25 text-xs flex items-center gap-1.5 cursor-not-allowed">
              Tes Big Five
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </span>
          </li>
          <li>
            <span className="text-white/25 text-xs flex items-center gap-1.5 cursor-not-allowed">
              Tes Enneagram
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </li>
  );
}
