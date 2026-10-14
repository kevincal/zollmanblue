"use client";

import { useEffect, useRef } from "react";

// Occasional patch of afternoon window light drifting across the background.
// First appearance 10–20s after load, then every 45–120s, never overlapping.
// Add ?light to the URL to preview it immediately and on a short loop.

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function WindowLight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const preview = new URLSearchParams(location.search).has("light");
    const firstDelay = () => (preview ? 1000 : rand(10_000, 20_000));
    const nextDelay = () => (preview ? 3000 : rand(45_000, 120_000));

    let timer: number | undefined;
    let anim: Animation | undefined;

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(play, delay);
    };

    const play = () => {
      if (document.hidden) return; // onVisibility reschedules when the tab is shown again
      // Sun comes in at an angle from one side and drifts slowly toward the other.
      const fromLeft = Math.random() < 0.5;
      const skew = (fromLeft ? -1 : 1) * rand(14, 24);
      const drift = (fromLeft ? 1 : -1) * rand(3, 6);
      el.style.left = `${fromLeft ? rand(-12, 30) : rand(40, 78)}vw`;
      el.style.top = `${rand(-15, 30)}vh`;

      const base = `skewX(${skew.toFixed(1)}deg) scaleY(1.15)`;
      anim = el.animate(
        [
          { opacity: 0, transform: `translateX(0) ${base}` },
          { opacity: rand(0.75, 0.95), offset: 0.45 },
          { opacity: 0, transform: `translateX(${drift.toFixed(1)}vw) ${base}` },
        ],
        { duration: rand(10_000, 14_000), easing: "ease-in-out" },
      );
      anim.onfinish = () => schedule(nextDelay());
    };

    // Pause while the tab is hidden; resume where it left off.
    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(timer);
        anim?.pause();
      } else if (anim?.playState === "paused") {
        anim.play();
      } else {
        schedule(firstDelay());
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    schedule(firstDelay());

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
      anim?.cancel();
    };
  }, []);

  return (
    <div className="light-layer" aria-hidden="true">
      <div ref={ref} className="window-light">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}
