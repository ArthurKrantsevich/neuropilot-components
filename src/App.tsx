import { useState, type ReactNode } from "react";
import { day, norm, type D } from "./components/range-picker/dates";
import { RangePicker, type Range } from "./components/range-picker/RangePicker";
import { MagneticButton } from "./components/MagneticButton";
import { PasswordFace } from "./components/PasswordFace";
import { RunawayButton } from "./components/RunawayButton";
import { ThemeToggle } from "./components/ThemeToggle";
import { TiltCard } from "./components/TiltCard";
import { IslandPhone, type PhoneText } from "./components/dynamic-island/IslandPhone";
import { locale, useLang, type Lang } from "./i18n";
import "./gallery.css";

// ?today=2026-10-26 — фиксированная «сегодня» для записи
const q = new URLSearchParams(location.search);
const TODAY: D = (() => {
  const s = q.get("today");
  if (!s) return norm(new Date());
  const [y, m, d] = s.split("-").map(Number);
  return day(y, m - 1, d);
})();

type L = Record<Lang, string>;
const G = {
  title: { ru: "Компоненты из шортсов", en: "Components from the Shorts" },
  lead: { ru: "React-компоненты из коротких роликов @NeuroP1lot. Без библиотек, код в папке src/components.", en: "React components from @NeuroP1lot Shorts. No libraries; the code lives in src/components." },
  watch: { ru: "Смотреть шортс", en: "Watch the Short" },
  code: { ru: "Код", en: "Code" },
} satisfies Record<string, L>;

const ISLAND: Record<Lang, PhoneText> = {
  ru: { title: "Dynamic Island", lead: "Одна капсула: ширина, высота и скругление на пружине.", modes: { timer: "Таймер", music: "Музыка", call: "Звонок" }, hint: "Нажми на остров, чтобы свернуть", calling: "Входящий вызов", caller: "Аня", song: "Северное сияние", artist: "NeuroPilot" },
  en: { title: "Dynamic Island", lead: "One pill: width, height and radius on a spring.", modes: { timer: "Timer", music: "Music", call: "Call" }, hint: "Tap the island to collapse", calling: "Incoming call", caller: "Anna", song: "Northern Lights", artist: "NeuroPilot" },
};

const ITEMS: { id: string; name: L; about: L; short: string; file: string; demo: (lang: Lang) => ReactNode }[] = [
  { id: "island", name: { ru: "Dynamic Island", en: "Dynamic Island" }, about: { ru: "Капсула превращается в таймер, плеер и звонок. Пружина — CSS linear().", en: "The pill morphs into a timer, a player and a call. The spring is CSS linear()." }, short: "BJfNxnVbyAA", file: "dynamic-island", demo: (lang) => <div className="iphone-frame island-scale"><IslandPhone text={ISLAND[lang]} /></div> },
  { id: "range-picker", name: { ru: "Выбор диапазона дат", en: "Date range picker" }, about: { ru: "Два месяца, подсветка при наведении, лента месяцев, пресеты.", en: "Two months, hover preview, sliding months, presets." }, short: "qNPflv57UsI", file: "range-picker", demo: (lang) => <RangeDemo lang={lang} /> },
  { id: "magnetic", name: { ru: "Магнитная кнопка", en: "Magnetic button" }, about: { ru: "Тянется за курсором и пружинит обратно.", en: "Follows the cursor and springs back." }, short: "38HDRVJWjA8", file: "MagneticButton.tsx", demo: (lang) => <MagneticButton>{lang === "ru" ? "Наведи на меня" : "Hover me"}</MagneticButton> },
  { id: "tilt", name: { ru: "3D-карточка", en: "3D tilt card" }, about: { ru: "Наклоняется за курсором, perspective + rotate.", en: "Tilts after the cursor with perspective and rotate." }, short: "_QfrxuaAH7I", file: "TiltCard.tsx", demo: (lang) => <TiltCard><div className="tilt-face"><b>NeuroPilot</b><span>{lang === "ru" ? "Наведи и поводи" : "Hover and move"}</span></div></TiltCard> },
  { id: "password", name: { ru: "Поле пароля с лицом", en: "Password field with a face" }, about: { ru: "Лицо пугается слабого пароля и улыбается надёжному.", en: "The face panics at weak passwords and smiles at strong ones." }, short: "XY2tdBYOjA0", file: "PasswordFace.tsx", demo: (lang) => <PasswordFace label={lang === "ru" ? "Пароль" : "Password"} hint={lang === "ru" ? "Попробуй 1234" : "Try 1234"} /> },
  { id: "toggle", name: { ru: "Переключатель день/ночь", en: "Day/night toggle" }, about: { ru: "Солнце становится луной одной внутренней тенью.", en: "The sun becomes a moon with one inset shadow." }, short: "HoWS3tF59pc", file: "ThemeToggle.tsx", demo: (lang) => <ToggleDemo lang={lang} /> },
  { id: "runaway", name: { ru: "Убегающая кнопка", en: "Runaway button" }, about: { ru: "Кнопка «Подписаться», которую нельзя нажать.", en: "A Subscribe button you can't click." }, short: "L5WUOrv_Ojs", file: "RunawayButton.tsx", demo: (lang) => <RunawayButton>{lang === "ru" ? "Подписаться" : "Subscribe"}</RunawayButton> },
];

function RangeDemo({ lang }: { lang: Lang }) {
  const [range, setRange] = useState<Range>({ start: null, end: null });
  const fmt = new Intl.DateTimeFormat(locale(lang), { weekday: "short", day: "numeric", month: "short" });
  const L = lang === "ru" ? ["Заезд", "Выезд", "Выберите дату"] : ["Check-in", "Check-out", "Add date"];
  return (
    <div className="rp-card">
      <div className="fields">
        {[range.start, range.end].map((v, i) => (
          <div key={i} className={`field ${(i === 0 && !range.start) || (i === 1 && range.start && !range.end) ? "active" : ""}`}>
            <small>{L[i]}</small>
            <b className={v ? "" : "muted"}>{v ? fmt.format(v) : L[2]}</b>
          </div>
        ))}
      </div>
      <RangePicker lang={lang} today={TODAY} value={range} onChange={setRange} />
    </div>
  );
}

function ToggleDemo({ lang }: { lang: Lang }) {
  const [night, setNight] = useState(false);
  return (
    <div className={`toggle-stage ${night ? "night" : ""}`}>
      <ThemeToggle checked={night} onChange={setNight} label={lang === "ru" ? "Тёмная тема" : "Dark mode"} />
    </div>
  );
}

export function App() {
  const [lang, setLang] = useLang();
  // ?rec=island — экран телефона во всё окно для записи шортса
  // &z=2 — увеличение для чёткой записи (скринкаст пишет в CSS-пикселях)
  if (q.get("rec") === "island") return <div style={{ zoom: Number(q.get("z") ?? 1) }}><IslandPhone text={ISLAND[lang]} /></div>;
  const repo = "https://github.com/ArthurKrantsevich/neuropilot-components/tree/main/src/components/";
  return (
    <div className="page">
      <header className="top">
        <div>
          <h1>{G.title[lang]}</h1>
          <p>{G.lead[lang]}</p>
        </div>
        <div className="seg" role="radiogroup" aria-label="Language">
          {(["ru", "en"] as const).map((l) => (
            <button key={l} role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <nav className="chips" aria-label="Components">
        {ITEMS.map((it) => <a key={it.id} href={`#${it.id}`}>{it.name[lang]}</a>)}
      </nav>
      {ITEMS.map((it) => (
        <section key={it.id} id={it.id} className={`item ${it.id === "range-picker" ? "wide" : ""}`}>
          <div className="item-head">
            <div>
              <h2>{it.name[lang]}</h2>
              <p>{it.about[lang]}</p>
            </div>
            <div className="links">
              {it.short && <a href={`https://youtube.com/shorts/${it.short}`}>▶ {G.watch[lang]}</a>}
              <a href={repo + it.file}>{G.code[lang]} →</a>
            </div>
          </div>
          <div className="demo">{it.demo(lang)}</div>
        </section>
      ))}
    </div>
  );
}
