import type { ReactNode } from "react";

/** 3D-карточка: наклоняется за курсором. Шортс «3D-карточка за 12 строк React». */
export function TiltCard({ children, max = 20, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
  };
  const leave = (e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = "");
  return (
    <div className={`tilt ${className}`} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform .15s ease-out", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
