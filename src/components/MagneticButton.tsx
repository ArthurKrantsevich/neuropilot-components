import type { ReactNode } from "react";

/** Магнитная кнопка: тянется за курсором, отпускает — пружинит обратно. Шортс «Дуэль кнопок». */
export function MagneticButton({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const leave = (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.transform = "");
  return (
    <button className={`magnetic ${className}`} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform .3s ease-out" }}>
      {children}
    </button>
  );
}
