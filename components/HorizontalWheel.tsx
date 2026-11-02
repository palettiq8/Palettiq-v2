"use client";

import { useEffect, useRef, useState } from "react";

export function HorizontalWheel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () =>
      setEdges({
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "smooth" });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      el.removeEventListener("wheel", onWheel);
      ro.disconnect();
    };
  }, []);

  const mask = `linear-gradient(to right, ${
    edges.left ? "transparent" : "#000"
  } 0, #000 40px, #000 calc(100% - 40px), ${
    edges.right ? "transparent" : "#000"
  } 100%)`;

  return (
    <div
      ref={ref}
      className="min-w-0 flex-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div className="flex w-max items-center gap-2">{children}</div>
    </div>
  );
}
