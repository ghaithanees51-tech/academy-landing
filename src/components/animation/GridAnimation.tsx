import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GridAnimation() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      const rects = svg.querySelectorAll("rect");

      gsap.fromTo(
        rects,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: (_i, el) => el.getAttribute("opacity"),
          scale: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power2.out",
          repeat: -1,
          yoyo: true,
        }
      );
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none absolute top-0 left-0">
      <svg
        ref={svgRef}
        width="280"
        height="420"
        viewBox="0 0 280 420"
        fill="none"
      >
        {[
          [-20, 30, 0.13],
          [-20, 122, 0.11],
          [-20, 214, 0.09],
          [-20, 306, 0.07],
          [52, 76, 0.11],
          [52, 168, 0.09],
          [52, 260, 0.07],
          [52, 352, 0.05],
          [124, 30, 0.09],
          [124, 122, 0.07],
          [124, 214, 0.05],
          [124, 306, 0.03],
          [196, 76, 0.06],
          [196, 168, 0.05],
          [196, 260, 0.03],
          [248, 30, 0.04],
          [248, 122, 0.03],
        ].map(([cx, cy, op], i) => (
          <rect
            key={i}
            x={cx - 26}
            y={cy - 26}
            width="52"
            height="52"
            rx="10"
            fill="#0D4261"
            opacity={op}
          />
        ))}
      </svg>
    </div>
  );
}