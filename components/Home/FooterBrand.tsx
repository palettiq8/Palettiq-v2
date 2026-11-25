"use client";

import { useEffect, useId, useRef } from "react";
import { Poppins } from "next/font/google";

const brandFont = Poppins({
  subsets: ["latin"],
  weight: ["900"],
});

const FONT_SIZE = 100;
const BASELINE = 100;
const CAP_HEIGHT = 72;
const OVERSHOOT = 2;

export function FooterBrand({ text = "PALETTIQ" }: { text?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const fit = () => {
      const svg = svgRef.current;
      const label = textRef.current;
      if (!svg || !label) return;
      const { x, width } = label.getBBox();
      const top = BASELINE - CAP_HEIGHT - OVERSHOOT;
      const height = CAP_HEIGHT + OVERSHOOT * 2;
      svg.setAttribute("viewBox", `${x} ${top} ${width} ${height}`);
    };

    fit();
    document.fonts.ready.then(fit);
  }, [text]);

  return (
    <div className="pointer-events-none relative select-none">
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox="0 20 800 88"
        className="block h-auto w-full"
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={BASELINE - CAP_HEIGHT}
            x2="0"
            y2={BASELINE}
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        <text
          ref={textRef}
          x="50%"
          y={BASELINE}
          textAnchor="middle"
          fontSize={FONT_SIZE}
          fontWeight="700"
          letterSpacing="-4"
          fill={`url(#${gradientId})`}
          className={brandFont.className}
        >
          {text}
        </text>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}
