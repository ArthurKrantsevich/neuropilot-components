/** Переключатель день/ночь: солнце становится луной одной внутренней тенью. Шортс «Солнце → луна одной тенью». */
export function ThemeToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={`toggle ${checked ? "night" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="stars" aria-hidden="true" />
      <span className="knob" aria-hidden="true" />
    </label>
  );
}
