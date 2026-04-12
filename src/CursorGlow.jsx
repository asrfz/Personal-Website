import { useEffect, useRef, useState } from "react";

const GLOW_SIZE = 280;
const HALF = GLOW_SIZE / 2;

/**
 * Soft gradient spotlight that follows the pointer (fine pointer only in CSS).
 */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);
  const raf = useRef(0);
  const latest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const flush = () => {
      raf.current = 0;
      const { x, y } = latest.current;
      setPos({ x, y });
    };

    const onMove = (e) => {
      latest.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) {
        raf.current = requestAnimationFrame(flush);
      }
      setActive(true);
    };

    const onHide = () => setActive(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onHide);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onHide);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      className="cursor-glow"
      style={{
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        transform: `translate3d(${pos.x - HALF}px, ${pos.y - HALF}px, 0)`,
        opacity: active ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
}
