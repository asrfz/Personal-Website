import { useLayoutEffect, useState } from "react";

/** Figma artboard size — keep in sync with `.canvas` in App.css */
export const DESIGN_W = 2002;
export const DESIGN_H = 1040;

function readViewportSize() {
  const vv = window.visualViewport;
  const w = vv?.width ?? window.innerWidth;
  const h = vv?.height ?? window.innerHeight;
  return { w: Math.max(1, w), h: Math.max(1, h) };
}

export function useViewportScale() {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function update() {
      const { w, h } = readViewportSize();
      setScale(Math.min(w / DESIGN_W, h / DESIGN_H));
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
