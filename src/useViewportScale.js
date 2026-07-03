import { useLayoutEffect, useState } from "react";

/** Figma artboard size — keep in sync with `.canvas` in App.css */
export const DESIGN_W = 2002;
export const DESIGN_H = 1040;

const MOBILE_LAYOUT_MAX_WIDTH = 896;
const MOBILE_MIN_SCALE = 0.26;

function readViewportSize() {
  const vv = window.visualViewport;
  const w = Math.max(1, vv?.width ?? window.innerWidth);
  const h = Math.max(1, vv?.height ?? window.innerHeight);
  return { w, h };
}

export function useViewportScale() {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function update() {
      const { w, h } = readViewportSize();
      const raw = Math.min(w / DESIGN_W, h / DESIGN_H);
      const isMobileLayout = w <= MOBILE_LAYOUT_MAX_WIDTH;
      let next = raw;
      if (isMobileLayout && raw < MOBILE_MIN_SCALE) {
        const floored = MOBILE_MIN_SCALE;
        if (DESIGN_W * floored <= w && DESIGN_H * floored <= h) next = floored;
      }
      setScale(next);
    }

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  return scale;
}
