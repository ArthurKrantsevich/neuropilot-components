# NeuroPilot components · Компоненты из шортсов

React components from the [@NeuroP1lot](https://www.youtube.com/@NeuroP1lot) Shorts. No UI libraries — each component is one file (or one folder) you can copy into your project.

**▶ Live demo:** https://arthurkrantsevich.github.io/neuropilot-components/

| Component | Short | Code |
|---|---|---|
| Date range picker — two months, hover preview, sliding months, presets | [▶](https://youtube.com/shorts/qNPflv57UsI) | [`range-picker/`](src/components/range-picker) |
| Magnetic button — follows the cursor, springs back | [▶](https://youtube.com/shorts/38HDRVJWjA8) | [`MagneticButton.tsx`](src/components/MagneticButton.tsx) |
| 3D tilt card | [▶](https://youtube.com/shorts/_QfrxuaAH7I) | [`TiltCard.tsx`](src/components/TiltCard.tsx) |
| Password field with a face | [▶](https://youtube.com/shorts/XY2tdBYOjA0) | [`PasswordFace.tsx`](src/components/PasswordFace.tsx) |
| Day/night toggle — the sun becomes a moon with one inset shadow | [▶](https://youtube.com/shorts/HoWS3tF59pc) | [`ThemeToggle.tsx`](src/components/ThemeToggle.tsx) |
| Runaway “Subscribe” button | [▶](https://youtube.com/shorts/L5WUOrv_Ojs) | [`RunawayButton.tsx`](src/components/RunawayButton.tsx) |

![Date range picker](docs/range-picker.gif)

### Date range picker

```tsx
import { RangePicker, type Range } from "./components/range-picker/RangePicker";

const [range, setRange] = useState<Range>({ start: null, end: null });
<RangePicker lang="en" today={new Date()} value={range} onChange={setRange} onApply={save} />
```

- Two months side by side; the whole strip of months slides on ←/→, month titles slide with it.
- Hover preview: after the first click the range lights up up to the cursor, across the month boundary.
- The solid band is one `::before` per cell — it starts from the middle of the start cell and ends at the middle of the end cell, with rounded ends at week edges.
- Presets: today, 7 days, 30 days, this month, last month. One month on narrow screens.
- `lang="ru" | "en"` — month names via `Intl.DateTimeFormat`, the week starts on Monday in RU and Sunday in EN.

![Gallery](docs/gallery.png)

### Run

```bash
npm install
npm run dev     # http://localhost:5197
```

Vite + React 19 + TypeScript. MIT.

---

## По-русски

React-компоненты из шортсов канала [@NeuroP1lot](https://www.youtube.com/@NeuroP1lot) — без библиотек, каждый в одном файле или папке, можно просто скопировать. Живое демо со всеми компонентами (RU/EN): https://arthurkrantsevich.github.io/neuropilot-components/

- **Выбор диапазона дат** — два месяца рядом, подсветка диапазона при наведении через границу месяцев, лента месяцев листается целиком, пресеты, один месяц на телефоне.
- **Магнитная кнопка**, **3D-карточка**, **поле пароля с лицом**, **переключатель день/ночь**, **убегающая кнопка «Подписаться»**.

Компоненты из больших видео лежат в отдельных репозиториях: [ui-styles](https://github.com/ArthurKrantsevich/ui-styles), [ui-depth](https://github.com/ArthurKrantsevich/ui-depth), [react-auth-form](https://github.com/ArthurKrantsevich/react-auth-form) и другие.
