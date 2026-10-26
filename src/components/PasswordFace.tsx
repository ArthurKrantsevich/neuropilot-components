import { useState } from "react";

/** Сила пароля 0–3: 1234 и qwerty — сразу 0. */
export const strength = (pw: string) => {
  if (!pw || /^(1234|qwerty)/i.test(pw)) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(3, Math.max(0, s - 1));
};

const COLORS = ["#ef4444", "#f59e0b", "#84cc16", "#22c55e"];

/** Рожица: рот и брови меняются по силе пароля. 0 — ужас, 3 — улыбка. */
export function Face({ mood }: { mood: number }) {
  const mouth = ["M30 70 Q50 52 70 70", "M32 68 Q50 62 68 68", "M32 64 Q50 72 68 64", "M28 60 Q50 82 72 60"][mood];
  const brow = ["M28 34 L42 40 M72 34 L58 40", "M28 38 L42 38 M58 38 L72 38", "M28 38 Q35 34 42 38 M58 38 Q65 34 72 38", "M28 36 Q35 30 42 36 M58 36 Q65 30 72 36"][mood];
  return (
    <svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill={COLORS[mood]} style={{ transition: "fill .3s" }} />
      <path d={brow} stroke="#1b1a22" strokeWidth="5" strokeLinecap="round" fill="none" style={{ transition: "d .3s" }} />
      <circle cx="36" cy="48" r={mood === 0 ? 7 : 5} fill="#1b1a22" />
      <circle cx="64" cy="48" r={mood === 0 ? 7 : 5} fill="#1b1a22" />
      <path d={mouth} stroke="#1b1a22" strokeWidth="5" strokeLinecap="round" fill="none" style={{ transition: "d .3s" }} />
    </svg>
  );
}

/** Поле пароля с лицом. Шортс «Это поле пароля боится 1234». */
export function PasswordFace({ label, hint }: { label: string; hint: string }) {
  const [value, setValue] = useState("");
  const mood = strength(value);
  return (
    <div className="pw">
      <Face mood={mood} />
      <label className="pw-field">
        <span>{label}</span>
        <input type="password" value={value} onChange={(e) => setValue(e.target.value)} placeholder={hint} />
        <i className="pw-meter" style={{ width: `${((mood + 1) / 4) * 100}%`, background: COLORS[mood] }} />
      </label>
    </div>
  );
}
