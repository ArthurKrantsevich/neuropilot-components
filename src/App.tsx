import { useRef, useEffect, useState, type ReactNode } from "react";
import { day, norm, type D } from "./components/range-picker/dates";
import { RangePicker, type Range } from "./components/range-picker/RangePicker";
import { MagneticButton } from "./components/MagneticButton";
import { PasswordFace } from "./components/PasswordFace";
import { RunawayButton } from "./components/RunawayButton";
import { ThemeToggle } from "./components/ThemeToggle";
import { TiltCard } from "./components/TiltCard";
import { Battery, IslandPhone, Signal, type PhoneText } from "./components/dynamic-island/IslandPhone";
import { CardTransition, type Place } from "./components/card-transition/CardTransition";
import { contrast, cssVars, MaterialPlayer, rolesFromSeed, type PlayerText } from "./components/material-you/MaterialYou";
import { WALLS } from "./components/material-you/wallpapers";
import { Bento } from "./components/bento/Bento";
import { areasCss, LAYOUTS } from "./components/bento/bento";
import { NEU_LAYOUT, NeuScreen } from "./components/neu/Neu";
import { BRUTAL, BrutalShop, SOFT, TWO_COLORS, type BrutalState } from "./components/brutal/Brutal";
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

const CardsDemo = ({ lang, animate = true, full = false }: { lang: Lang; animate?: boolean; full?: boolean }) => (
  <div className={`ct-phone ${full ? "full" : ""}`}>
    <CardTransition heading={PLACES[lang].title} places={PLACES[lang].places} labels={PLACES[lang].labels} animate={animate} />
  </div>
);

const PLAYER: Record<Lang, PlayerText & { pick: string; own: string; ratio: string; palette: string }> = {
  ru: { app: "Музыка", title: "Северное сияние", artist: "NeuroPilot", chips: ["Для вас", "Новое", "Чарт"], nav: ["Главная", "Плеер", "Медиатека"], pick: "Обои", own: "Свой цвет", ratio: "Контраст текста на кнопке", palette: "29 ролей из одного цвета" },
  en: { app: "Music", title: "Northern Lights", artist: "NeuroPilot", chips: ["For you", "New", "Charts"], nav: ["Home", "Player", "Library"], pick: "Wallpaper", own: "Your color", ratio: "Text contrast on the button", palette: "29 roles from one color" },
};

/** Демо Material You: обои → цвет-семя → вся палитра; живой контраст и 29 ролей. */
function MaterialDemo({ lang }: { lang: Lang }) {
  const [wall, setWall] = useState(WALLS[0]);
  const [seed, setSeed] = useState(WALLS[0].seed);
  const roles = rolesFromSeed(seed);
  const t = PLAYER[lang];
  return (
    <div className="my-demo">
      <div className="my-phone"><MaterialPlayer seed={seed} text={t} wallpaper={wall.src} /></div>
      <div className="my-side">
        <b>{t.pick}</b>
        <div className="my-walls">
          {WALLS.map((w) => (
            <button key={w.id} aria-label={w.name[lang]} aria-pressed={wall.id === w.id} style={{ backgroundImage: `url("${w.src}")` }} onClick={() => { setWall(w); setSeed(w.seed); }} />
          ))}
        </div>
        <label className="my-own">
          <input type="color" value={seed} onChange={(e) => setSeed(e.target.value)} /> {t.own}
        </label>
        <div className="my-ratio">{t.ratio}: <b>{contrast(roles.primary, roles.onPrimary).toFixed(1)}:1</b></div>
        <div className="my-ratio">{t.palette}</div>
        <div className="my-swatches">{Object.values(roles).map((c, i) => <i key={i} style={{ background: c }} />)}</div>
      </div>
    </div>
  );
}

/** Запись для шортса: экран Android 412×915; ?seed=N — статично, ?cycle=мс — смена обоев по кругу. */
function MaterialRec({ lang }: { lang: Lang }) {
  const start = Number(q.get("seed") ?? 0);
  const cycle = Number(q.get("cycle") ?? 0);
  const [i, setI] = useState(start);
  useEffect(() => {
    if (!cycle) return;
    const id = setInterval(() => setI((v) => (v + 1) % WALLS.length), cycle);
    return () => clearInterval(id);
  }, [cycle]);
  const w = WALLS[i];
  return (
    <div className="my-rec" style={cssVars(rolesFromSeed(w.seed))}>
      <MaterialPlayer seed={w.seed} text={PLAYER[lang]} wallpaper={w.src} />
    </div>
  );
}


/** Необрутализм: мягкий SaaS → плоский цвет, рамка и жёсткая тень → два ярких цвета вместо пяти. Счётчики — по настоящему DOM. */
function BrutalDemo({ lang }: { lang: Lang }) {
  const MODES = [SOFT, BRUTAL, TWO_COLORS];
  const [mode, setMode] = useState(0);
  const [st, setSt] = useState<BrutalState>(SOFT);
  const [press, setPress] = useState(0);
  const [n, setN] = useState({ blur: 0, grad: 0 });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const to = MODES[mode];
    const tick = () => setSt((f) => {
      const k = 0.16;
      const nx = { g: f.g + (to.g - f.g) * k, s: f.s + (to.s - f.s) * k, b: f.b + (to.b - f.b) * k, c: f.c + (to.c - f.c) * k };
      const done = Math.abs(nx.g - to.g) + Math.abs(nx.s - to.s) + Math.abs(nx.b - to.b) + Math.abs(nx.c - to.c) < 0.004;
      if (!done) raf = requestAnimationFrame(tick);
      return done ? { ...to } : nx;
    });
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  // считаем по готовой странице: тени с размытием > 0 и фоны-градиенты
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let blur = 0, grad = 0;
    el.querySelectorAll<HTMLElement>("*").forEach((x) => {
      const cs = getComputedStyle(x);
      if (cs.boxShadow !== "none") for (const part of cs.boxShadow.split(/,(?![^(]*\))/)) { const px = part.match(/(-?[\d.]+)px/g) ?? []; if (parseFloat(px[2] ?? "0") > 0.05) blur++; }
      if (cs.backgroundImage.includes("gradient") && parseFloat(cs.opacity) > 0.01) grad++;
    });
    setN({ blur, grad });
  }, [st]);
  const L = lang === "ru"
    ? { modes: ["Мягко", "Необрутализм", "Два цвета"], blur: "размытий", grad: "градиентов" }
    : { modes: ["Soft", "Neubrutalism", "Two colors"], blur: "blurs", grad: "gradients" };
  return (
    <div className="brutal-demo">
      <div className="bento-tools">
        <div className="seg">
          {L.modes.map((m, i) => <button key={m} className={mode === i ? "on" : ""} onClick={() => setMode(i)}>{m}</button>)}
        </div>
        <p className="brutal-count"><b>{n.blur}</b> {L.blur} · <b>{n.grad}</b> {L.grad}</p>
      </div>
      <div className="brutal-stage" ref={ref} onPointerDown={() => setPress(1)} onPointerUp={() => setPress(0)} onPointerLeave={() => setPress(0)}>
        <BrutalShop lang={lang} st={{ ...st, press }} />
      </div>
    </div>
  );
}

/** Неоморфизм: «найди кнопки». Мягкий экран ↔ исправленный (fix плавно 0 → 1), подсветка кнопок и плиток-обманок. */
function NeuDemo({ lang }: { lang: Lang }) {
  const [on, setOn] = useState(false);
  const [fix, setFix] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const tick = () => setFix((f) => {
      const n = f + ((on ? 1 : 0) - f) * 0.18;
      if (Math.abs(n - (on ? 1 : 0)) > 0.005) raf = requestAnimationFrame(tick);
      return Math.abs(n - (on ? 1 : 0)) > 0.005 ? n : on ? 1 : 0;
    });
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  const L = lang === "ru"
    ? { soft: "Как на Dribbble", fixed: "Исправлено", show: "Показать кнопки", edge: "Край кнопки", not: "не кнопка" }
    : { soft: "Dribbble style", fixed: "Fixed", show: "Show the buttons", edge: "Button edge", not: "not a button" };
  let n = 0;
  return (
    <div className="neu-demo">
      <div className="bento-tools">
        <div className="seg">
          <button className={!on ? "on" : ""} onClick={() => setOn(false)}>{L.soft}</button>
          <button className={on ? "on" : ""} onClick={() => setOn(true)}>{L.fixed}</button>
        </div>
        <label className="bento-check"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> {L.show}</label>
      </div>
      <div className="neu-phone">
        <div className="neu-frame">
          <NeuScreen lang={lang} fix={fix} />
          <div className="neu-bars" aria-hidden="true"><span>9:41</span><i /><em /></div>
          {show && NEU_LAYOUT.map((e) => (
            <div key={e.id} className={`neu-mark ${e.kind}`} style={{ left: e.x - 6, top: e.y - 6, width: e.w + 12, height: e.h + 12, borderRadius: e.r + 6 }}>
              {e.kind === "button" ? <b>{++n}</b> : <span>{L.not}</span>}
            </div>
          ))}
        </div>
      </div>
      <p className="neu-meter">{L.edge}: <b className={on ? "ok" : "bad"}>{on ? "3,45 : 1" : "1,7 : 1"}</b> · WCAG 1.4.11 — 3 : 1</p>
    </div>
  );
}

/** Бенто: одна разметка, карта grid-template-areas меняет раскладку. На узком экране — карта для телефона. */
function BentoDemo({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<"collage" | "bento">("bento");
  const [letters, setLetters] = useState(true);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const f = () => setNarrow(innerWidth < 640);
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, []);
  const layout = mode === "collage" ? LAYOUTS.collage : narrow ? LAYOUTS.phone : LAYOUTS.bento;
  const L = lang === "ru" ? { collage: "Коллаж", bento: "Бенто", letters: "Карта буквами" } : { collage: "Collage", bento: "Bento", letters: "Show the map" };
  return (
    <div className="bento-demo">
      <div className="bento-tools">
        <div className="seg">
          <button className={mode === "collage" ? "on" : ""} onClick={() => setMode("collage")}>{L.collage}</button>
          <button className={mode === "bento" ? "on" : ""} onClick={() => setMode("bento")}>{L.bento}</button>
        </div>
        <label className="bento-check"><input type="checkbox" checked={letters} onChange={(e) => setLetters(e.target.checked)} /> {L.letters}</label>
      </div>
      <div className="bento-stage" style={{ aspectRatio: narrow ? "3 / 5" : "4 / 3" }}>
        <Bento layout={layout} lang={lang} letters={letters} />
      </div>
      <pre className="bento-code">{`.grid { grid-template-areas: ${areasCss(layout)}; }\n.hero { grid-area: a; }`}</pre>
    </div>
  );
}

const ITEMS: { id: string; name: L; about: L; short: string; file: string; demo: (lang: Lang) => ReactNode }[] = [
  { id: "brutal", name: { ru: "Необрутализм: 0 размытий, 0 градиентов", en: "Neubrutalism: 0 blurs, 0 gradients" }, about: { ru: "Плоский цвет, рамка 3 px и жёсткая тень 6px 6px 0. Нажатие — кнопка садится в свою тень. Ярких цветов — два, а не пять.", en: "Flat color, a 3px border and a hard 6px 6px 0 shadow. On press the button sits into its shadow. Two bright colors, not five." }, short: "1uBXlyDk0-I", file: "brutal", demo: (lang) => <BrutalDemo lang={lang} /> },
  { id: "neu", name: { ru: "Неоморфизм: найди кнопки", en: "Neumorphism: find the buttons" }, about: { ru: "Кнопки того же цвета, что фон, и две тени: край 1,7 : 1. Рамка в 1 px, цвет главной кнопки и плитки без тени — и мягкость остаётся.", en: "Buttons in the background color with two shadows: the edge is 1.7:1. A 1px border, a colored main button and flat cards keep the softness." }, short: "q1_Kw0J78jM", file: "neu", demo: (lang) => <NeuDemo lang={lang} /> },
  { id: "bento", name: { ru: "Бенто-сетка: 2 строки CSS", en: "Bento grid: 2 lines of CSS" }, about: { ru: "Карта раскладки буквами в grid-template-areas: коллаж, бенто и телефон — одна разметка.", en: "The layout map in grid-template-areas: collage, bento and phone from one markup." }, short: "6o7kNb_TJIA", file: "bento", demo: (lang) => <BentoDemo lang={lang} /> },
  { id: "material", name: { ru: "Material You: палитра из обоев", en: "Material You: palette from wallpaper" }, about: { ru: "Один цвет → 29 ролей интерфейса. Функция Google themeFromSourceColor, контраст считается сам.", en: "One color → 29 UI roles. Google's themeFromSourceColor, contrast handled for you." }, short: "D_9AeA0thmY", file: "material-you", demo: (lang) => <MaterialDemo lang={lang} /> },
  { id: "card", name: { ru: "Карточка → страница", en: "Card → page" }, about: { ru: "Картинка и заголовок перелетают на новую страницу. View Transitions API, без библиотек.", en: "The image and title fly into the new page. View Transitions API, no libraries." }, short: "-ChwLWTUI4E", file: "card-transition", demo: (lang) => <Phone><CardsDemo lang={lang} /></Phone> },
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
  if (q.get("rec") === "my") return <div style={{ zoom: Number(q.get("z") ?? 1) }}><MaterialRec lang={lang} /></div>;
  if (q.get("rec") === "card") return <div style={{ zoom: Number(q.get("z") ?? 1) }}>{q.has("slowvt") && <style>{"::view-transition-group(*){animation-duration:1.65s}"}</style>}<CardsDemo lang={lang} animate={!q.has("jump")} full={q.has("full")} /></div>;
  // ?view=card — компонент во всё окно (проверка адаптива и скриншоты для README)
  if (q.get("view") === "card") return <div style={{ minHeight: "100vh", background: "#f4f2f8" }}><CardTransition heading={PLACES[lang].title} places={PLACES[lang].places} labels={PLACES[lang].labels} /></div>;
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
