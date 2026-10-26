import { useState, type ReactNode } from "react";
import { day, norm, type D } from "./components/range-picker/dates";
import { RangePicker, type Range } from "./components/range-picker/RangePicker";
import { MagneticButton } from "./components/MagneticButton";
import { PasswordFace } from "./components/PasswordFace";
import { RunawayButton } from "./components/RunawayButton";
import { ThemeToggle } from "./components/ThemeToggle";
import { TiltCard } from "./components/TiltCard";
import { Battery, IslandPhone, Signal, type PhoneText } from "./components/dynamic-island/IslandPhone";
import { CardTransition, type Place } from "./components/card-transition/CardTransition";
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

const PLACES: Record<Lang, { title: string; places: Place[]; labels: { back: string; book: string; nights: string } }> = {
  ru: {
    title: "Куда поедем?",
    labels: { back: "Назад", book: "Забронировать", nights: "7 ночей" },
    places: [
      { id: "iceland", title: "Исландия", sub: "Ледники и гейзеры", hue: 200, text: "Чёрные пляжи, водопады и северное сияние прямо над домиком." },
      { id: "japan", title: "Япония", sub: "Киото осенью", hue: 350, text: "Красные клёны, храмы и тишина садов камней." },
      { id: "morocco", title: "Марокко", sub: "Сахара и Марракеш", hue: 25, text: "Ночь в пустыне под звёздами и рынки, где пахнет специями." },
      { id: "norway", title: "Норвегия", sub: "Фьорды", hue: 160, text: "Скалы над водой, паромы и домики рыбаков на сваях." },
    ],
  },
  en: {
    title: "Where to next?",
    labels: { back: "Back", book: "Book now", nights: "7 nights" },
    places: [
      { id: "iceland", title: "Iceland", sub: "Glaciers and geysers", hue: 200, text: "Black beaches, waterfalls and the northern lights right above your cabin." },
      { id: "japan", title: "Japan", sub: "Kyoto in autumn", hue: 350, text: "Red maples, temples and the quiet of rock gardens." },
      { id: "morocco", title: "Morocco", sub: "Sahara and Marrakesh", hue: 25, text: "A night in the desert under the stars and markets that smell of spices." },
      { id: "norway", title: "Norway", sub: "Fjords", hue: 160, text: "Cliffs over water, ferries and fishermen's huts on stilts." },
    ],
  },
};

const CardsDemo = ({ lang, animate = true }: { lang: Lang; animate?: boolean }) => (
  <div className="ct-phone">
    <CardTransition heading={PLACES[lang].title} places={PLACES[lang].places} labels={PLACES[lang].labels} animate={animate} />
  </div>
);

const ITEMS: { id: string; name: L; about: L; short: string; file: string; demo: (lang: Lang) => ReactNode }[] = [
  { id: "card", name: { ru: "Карточка → страница", en: "Card → page" }, about: { ru: "Картинка и заголовок перелетают на новую страницу. View Transitions API, без библиотек.", en: "The image and title fly into the new page. View Transitions API, no libraries." }, short: "jIj0fpT2fFY", file: "card-transition", demo: (lang) => <Phone><CardsDemo lang={lang} /></Phone> },
  { id: "island", name: { ru: "Dynamic Island", en: "Dynamic Island" }, about: { ru: "Капсула превращается в таймер, плеер и звонок. Пружина — CSS linear().", en: "The pill morphs into a timer, a player and a call. The spring is CSS linear()." }, short: "BJfNxnVbyAA", file: "dynamic-island", demo: (lang) => <div className="iphone-frame island-scale"><IslandPhone text={ISLAND[lang]} /></div> },
  { id: "range-picker", name: { ru: "Выбор диапазона дат", en: "Date range picker" }, about: { ru: "Два месяца, подсветка при наведении, лента месяцев, пресеты.", en: "Two months, hover preview, sliding months, presets." }, short: "qNPflv57UsI", file: "range-picker", demo: (lang) => <RangeDemo lang={lang} /> },
  { id: "magnetic", name: { ru: "Магнитная кнопка", en: "Magnetic button" }, about: { ru: "Тянется за курсором и пружинит обратно.", en: "Follows the cursor and springs back." }, short: "38HDRVJWjA8", file: "MagneticButton.tsx", demo: (lang) => <Duel lang={lang} /> },
  { id: "tilt", name: { ru: "3D-карточка", en: "3D tilt card" }, about: { ru: "Наклоняется за курсором, perspective + rotate.", en: "Tilts after the cursor with perspective and rotate." }, short: "_QfrxuaAH7I", file: "TiltCard.tsx", demo: (lang) => <TiltCard title="3D Card" sub={lang === "ru" ? "Наведи и поводи" : "Hover and move"} /> },
  { id: "password", name: { ru: "Поле пароля с лицом", en: "Password field with a face" }, about: { ru: "Лицо пугается слабого пароля и улыбается надёжному.", en: "The face panics at weak passwords and smiles at strong ones." }, short: "XY2tdBYOjA0", file: "PasswordFace.tsx", demo: (lang) => <PasswordFace t={PW[lang]} /> },
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
  return <ThemeToggle checked={night} onChange={setNight} labels={lang === "ru" ? ["День", "Ночь"] : ["Day", "Night"]} />;
}

const PW: Record<Lang, { placeholder: string; empty: string; moods: string[]; checks: string[] }> = {
  ru: { placeholder: "Попробуй 1234", empty: "Введи пароль", moods: ["Ужас", "Слабо", "Сойдёт", "Надёжно"], checks: ["Длина от 8", "Длина от 12", "Aa — разный регистр", "Цифры", "Символы !@#"] },
  en: { placeholder: "Try 1234", empty: "Type a password", moods: ["Awful", "Weak", "Okay", "Strong"], checks: ["8+ characters", "12+ characters", "Aa — mixed case", "Digits", "Symbols !@#"] },
};

/** Дуэль из шортса: обычная кнопка против магнитной, считаем попадания. */
function Duel({ lang }: { lang: Lang }) {
  const [n, setN] = useState([0, 0]);
  const hit = (i: number) => setN((v) => v.map((x, j) => (j === i ? x + 1 : x)));
  const L = lang === "ru" ? { label: "Подписаться", tags: ["обычная", "магнитная"], hint: "Жми быстро в обе" } : { label: "Subscribe", tags: ["regular", "magnetic"], hint: "Click both fast" };
  return (
    <div className="duel">
      {[0, 1].map((i) => (
        <div key={i} className="duel-side" style={{ order: i * 2 }}>
          <div className="duel-head">
            <span className={`duel-tag ${i ? "hot" : ""}`}>{L.tags[i]}</span>
            <b className="duel-count">{n[i]}</b>
          </div>
          <MagneticButton flat={i === 0} onClick={() => hit(i)}>{L.label}</MagneticButton>
        </div>
      ))}
      <span className="duel-vs" style={{ order: 1 }}>VS</span>
    </div>
  );
}

/** Корпус iPhone 15 Pro: остров, строка статуса и полоска «домой»; контент — только в безопасной зоне. */
const Phone = ({ children }: { children: ReactNode }) => (
  <div className="phone-scale">
    <div className="phone">
      <div className="phone-status" aria-hidden="true"><span>9:41</span><span className="phone-icons"><Signal /><Battery /></span></div>
      <div className="phone-island" aria-hidden="true" />
      <div className="phone-safe">{children}</div>
      <i className="phone-home" aria-hidden="true" />
    </div>
  </div>
);

export function App() {
  const [lang, setLang] = useLang();
  // ?rec=island — экран телефона во всё окно для записи шортса
  // &z=2 — увеличение для чёткой записи (скринкаст пишет в CSS-пикселях)
  // &slowvt — переход в 3 раза медленнее (для slow-mo в ролике)
  if (q.get("rec") === "card") return <div style={{ zoom: Number(q.get("z") ?? 1) }}>{q.has("slowvt") && <style>{"::view-transition-group(*){animation-duration:1.65s}"}</style>}<CardsDemo lang={lang} animate={!q.has("jump")} /></div>;
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
