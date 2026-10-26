# NeuroPilot components · Компоненты из шортсов

React components from the [@NeuroP1lot](https://www.youtube.com/@NeuroP1lot) Shorts. No UI libraries (Material You uses Google's color utilities): each component is one file (or one folder) you can copy into your project. Every demo works in Russian and English.

**▶ Live demo:** https://arthurkrantsevich.github.io/neuropilot-components/

| Component | Short | Demo | Code |
|---|---|---|---|
| [Material You](#material-you) — one wallpaper color → 29 UI color roles | [▶](https://youtube.com/shorts/D_9AeA0thmY) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#material) | [`material-you/`](src/components/material-you) |
| [Card → page](#card--page-view-transitions) — the image and title fly into the new page | [▶](https://youtube.com/shorts/-ChwLWTUI4E) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#card) | [`card-transition/`](src/components/card-transition) |
| [Dynamic Island](#dynamic-island) — one pill becomes a timer, a player and a call | [▶](https://youtube.com/shorts/BJfNxnVbyAA) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#island) | [`dynamic-island/`](src/components/dynamic-island) |
| [Date range picker](#date-range-picker) — two months, hover preview, presets | [▶](https://youtube.com/shorts/qNPflv57UsI) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#range-picker) | [`range-picker/`](src/components/range-picker) |
| [Magnetic button](#magnetic-button) — the duel: regular vs magnetic | [▶](https://youtube.com/shorts/38HDRVJWjA8) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#magnetic) | [`MagneticButton.tsx`](src/components/MagneticButton.tsx) |
| [3D tilt card](#3d-tilt-card) — layers at different depths, glare | [▶](https://youtube.com/shorts/_QfrxuaAH7I) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#tilt) | [`TiltCard.tsx`](src/components/TiltCard.tsx) |
| [Password field with a face](#password-field-with-a-face) — panics at 1234 | [▶](https://youtube.com/shorts/XY2tdBYOjA0) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#password) | [`PasswordFace.tsx`](src/components/PasswordFace.tsx) |
| [Day/night toggle](#daynight-toggle) — the sun becomes a moon with one inset shadow | [▶](https://youtube.com/shorts/HoWS3tF59pc) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#toggle) | [`ThemeToggle.tsx`](src/components/ThemeToggle.tsx) |
| [Runaway button](#runaway-button) — the Subscribe button you can't click | [▶](https://youtube.com/shorts/L5WUOrv_Ojs) | [open](https://arthurkrantsevich.github.io/neuropilot-components/#runaway) | [`RunawayButton.tsx`](src/components/RunawayButton.tsx) |

Styles for each component live in [`src/gallery.css`](src/gallery.css) under a comment with its name (except `card-transition/`, `dynamic-island/` and `range-picker/`, which carry their own CSS).

---

### Material You

![One wallpaper, the whole UI recolors](docs/material-you.png)

```tsx
import { MaterialPlayer, rolesFromSeed, cssVars } from "./components/material-you/MaterialYou";

<MaterialPlayer seed="#6750A4" text={…} wallpaper={url} />
// or just the colors: <div style={cssVars(rolesFromSeed("#F4C430"))}>…uses var(--md-primary)…</div>
```

- `themeFromSourceColor(seed)` from Google's `@material/material-color-utilities` builds 6 tonal palettes in the HCT color space and 29 color roles: primary, onPrimary, surface, primaryContainer…
- Every role becomes a CSS variable `--md-*`; the UI is painted only with those variables, so changing one seed recolors everything.
- Contrast holds for any seed: even from yellow (#F4C430) the button becomes #755B00 with 6.5:1 text contrast. The demo shows the live ratio.
- The only dependency besides React: `@material/material-color-utilities` (Apache-2.0, by Google).

### Card → page (View Transitions)

<img src="docs/card-transition.gif" width="300" alt="Card flies into the page">

```tsx
import { CardTransition } from "./components/card-transition/CardTransition";

<CardTransition heading="Where to next?" places={places} labels={{ back: "Back", book: "Book now", nights: "7 nights" }} />
```

- The image and the title carry the same `view-transition-name` on the card and on the page. The browser snapshots both states and animates between them.
- In React the state change runs inside `document.startViewTransition(() => flushSync(update))`, so the new page is already in the DOM when the browser takes the "after" snapshot.
- Works with stable React 19: no canary `<ViewTransition>` and no libraries. Browsers without the API switch instantly.
- **Responsive via container queries.** It adapts to the width of its container, not the window: 2 columns on a phone, 3 on a tablet, 4 on desktop. On wide screens the place page splits into image and text. It is checked at 375, 393, 768, 1024, 1280, 1440 and 1920 px with no overflow.

| Phone · tablet | Desktop |
|---|---|
| <img src="docs/card-transition-sizes-mobile.png" width="420"> | <img src="docs/card-transition-sizes-desktop.png" width="420"> |

### Dynamic Island

<img src="docs/dynamic-island.gif" width="300" alt="Dynamic Island: timer, player, call">

```tsx
import { DynamicIsland, type IslandMode } from "./components/dynamic-island/DynamicIsland";

const [mode, setMode] = useState<IslandMode>("idle"); // "idle" | "timer" | "music" | "call"
<DynamicIsland mode={mode} text={{ calling: "Incoming call", caller: "Anna", song: "Northern Lights", artist: "NeuroPilot" }} onClose={() => setMode("idle")} />
```

- The whole morph is three properties on one element: `width`, `height` and `border-radius`. Each mode only sets `--w`, `--h` and `--r`.
- The spring is a CSS `linear()` easing, a damped spring sampled into 25 points. There is no JavaScript animation.
- Content remounts per mode (`key={mode}`) and fades in out of a blur, 0.18 s after the shape.
- `IslandPhone` is a 393×852 pt iPhone 15 Pro screen with the island at the camera, a status bar and the 59/34 pt safe areas.

### Date range picker

![Date range picker](docs/range-picker.gif)

```tsx
import { RangePicker, type Range } from "./components/range-picker/RangePicker";

const [range, setRange] = useState<Range>({ start: null, end: null });
<RangePicker lang="en" today={new Date()} value={range} onChange={setRange} onApply={save} />
```

- Two months side by side. The whole strip of months slides on ←/→, and the month titles slide with it.
- Hover preview: after the first click, the range lights up as far as the cursor, across the month boundary.
- The solid band is one `::before` per cell. It starts from the middle of the start cell and ends at the middle of the end cell, with rounded ends at week edges.
- Presets: today, 7 days, 30 days, this month, last month. On narrow screens it shows one month.
- `lang="ru" | "en"`: month names come from `Intl.DateTimeFormat`. The week starts on Monday in RU and on Sunday in EN.

### Magnetic button

![Regular vs magnetic button](docs/magnetic-duel.png)

```tsx
import { MagneticButton } from "./components/MagneticButton";

<MagneticButton onClick={subscribe}>Subscribe</MagneticButton>
<MagneticButton flat onClick={subscribe}>Subscribe</MagneticButton> {/* regular button, for comparison */}
```

- Within `radius` (140 px) the button moves toward the cursor by `strength` (35 %) of the distance. The label moves another 45 % on top of that, which reads as depth.
- A magnetic button catches clicks anywhere in its radius; a regular one only on itself. The demo counts both: that's the duel from the Short.
- A click sends a ring wave; leaving the field springs the button back.

### 3D tilt card

![3D tilt card at rest and tilted](docs/tilt-card.png)

```tsx
import { TiltCard } from "./components/TiltCard";

<TiltCard title="3D Card" sub="Hover and move" chip="PRO" />
```

- `perspective` on the stage and `rotateX`/`rotateY` on the card from the cursor position (±18°).
- The chip, title, subtitle and ring sit at different `translateZ` depths inside `transform-style: preserve-3d`, so they separate as the card tilts.
- A radial glare follows the cursor (`--gx`, `--gy`), and the shadow moves the opposite way.

### Password field with a face

![Password field: 1234 vs a strong password](docs/password-face.png)

```tsx
import { PasswordFace } from "./components/PasswordFace";

<PasswordFace t={{ placeholder: "Try 1234", empty: "Type a password", moods: ["Awful", "Weak", "Okay", "Strong"], checks: ["8+ characters", "12+ characters", "Aa — mixed case", "Digits", "Symbols !@#"] }} />
```

- `strength()` counts five checks: length ≥ 8, length ≥ 12, mixed case, digits and symbols. It turns them into a level from 0 to 3. `1234`, `qwerty` and `password` are always 0.
- The face is one SVG. The eyes shrink and the mouth goes from an open scream to a smile. On level 0 it shakes and sweats.
- The input border, the 4-segment meter and the label all share one `--mood` colour.

### Day/night toggle

![Day and night](docs/theme-toggle.png)

```tsx
import { ThemeToggle } from "./components/ThemeToggle";

const [night, setNight] = useState(false);
<ThemeToggle checked={night} onChange={setNight} labels={["Day", "Night"]} />
```

- The knob is a yellow circle. At night it rotates 200° and gets one `inset` shadow, `inset -22px -14px 0 3px`, which turns the circle into a crescent moon.
- The sky cross-fades to night, the clouds drift away and 22 stars light up and twinkle. All of it runs on CSS transitions toggled by one class.
- It is a real `<input type="checkbox">`, so it works with the keyboard and screen readers.

### Runaway button

![Runaway Subscribe button](docs/runaway-button.png)

```tsx
import { RunawayButton } from "./components/RunawayButton";

<RunawayButton>Subscribe</RunawayButton>
```

- When the cursor comes within `radius` (110 px), the button jumps `step` (90 px) directly away from it.
- It can't leave the card. When it hits an edge, it bounces back toward the centre.

---

![Gallery](docs/gallery.png)

### Run

```bash
npm install
npm run dev     # http://localhost:5197
```

Vite + React 19 + TypeScript. MIT.

---

## По-русски

React-компоненты из шортсов канала [@NeuroP1lot](https://www.youtube.com/@NeuroP1lot). Без библиотек: каждый лежит в одном файле или папке, можно просто скопировать. Живое демо со всеми компонентами (RU/EN): https://arthurkrantsevich.github.io/neuropilot-components/

- **[Material You](https://arthurkrantsevich.github.io/neuropilot-components/#material)**: один цвет с обоев → 29 цветов интерфейса функцией Google themeFromSourceColor; контраст держится даже у жёлтого.
- **[Карточка → страница](https://arthurkrantsevich.github.io/neuropilot-components/#card)**: картинка и заголовок перелетают на новую страницу. Это View Transitions API браузера, без библиотек.
- **[Dynamic Island](https://arthurkrantsevich.github.io/neuropilot-components/#island)**: одна чёрная капсула превращается в таймер, плеер и звонок. Меняются только ширина, высота и скругление, пружина сделана на CSS `linear()`.
- **[Выбор диапазона дат](https://arthurkrantsevich.github.io/neuropilot-components/#range-picker)**: два месяца рядом, подсветка диапазона при наведении прямо через границу месяцев, месяцы листаются лентой, есть пресеты.
- **[Магнитная кнопка](https://arthurkrantsevich.github.io/neuropilot-components/#magnetic)**: дуэль «обычная против магнитной» со счётчиком кликов.
- **[3D-карточка](https://arthurkrantsevich.github.io/neuropilot-components/#tilt)**: слои на разной глубине и блик за курсором.
- **[Поле пароля с лицом](https://arthurkrantsevich.github.io/neuropilot-components/#password)**: пугается 1234 и улыбается надёжному паролю, под полем пять проверок.
- **[Переключатель день/ночь](https://arthurkrantsevich.github.io/neuropilot-components/#toggle)**: солнце становится луной от одной внутренней тени, ночью загораются звёзды.
- **[Убегающая кнопка](https://arthurkrantsevich.github.io/neuropilot-components/#runaway)**: кнопку «Подписаться» нельзя нажать.

Компоненты из больших видео лежат в отдельных репозиториях: [ui-styles](https://github.com/ArthurKrantsevich/ui-styles), [ui-depth](https://github.com/ArthurKrantsevich/ui-depth), [react-auth-form](https://github.com/ArthurKrantsevich/react-auth-form) и другие.
