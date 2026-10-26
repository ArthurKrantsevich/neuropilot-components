import { useRef, useState, type ReactNode } from "react";

/** Кнопка, которая убегает от курсора. Шортс «Кнопку «Подписаться» нельзя нажать». */
export function RunawayButton({ children, radius = 120, step = 80 }: { children: ReactNode; radius?: number; step?: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = r.x + r.width / 2 - e.clientX;
    const dy = r.y + r.height / 2 - e.clientY;
    const d = Math.hypot(dx, dy) || 1;
    if (d < radius) setPos((p) => ({ x: p.x + (dx / d) * step, y: p.y + (dy / d) * step }));
  };
  return (
    <div className="runaway-area" onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}>
      <button ref={ref} className="runaway" style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform .25s cubic-bezier(.2,.9,.3,1.4)" }}>
        {children}
      </button>
    </div>
  );
}
