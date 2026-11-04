# SelfInsight

Know yourself through the **Western zodiac, Chinese zodiac, numerology, planet positions,
the Yi King (I Ching) and luck numbers**. Symbolic tools for reflection, not predictions.

Angular 22, standalone components, signals, no UI framework. Everything runs in the browser
(profile kept in `localStorage`); no backend and no scraping.

## Where the knowledge comes from

The zodiac, Chinese zodiac, numerology and lucky-number logic is ported from the sibling
project `06-lotokarma` (`src/app/services/`), kept as pure TypeScript in `src/app/engine/`:

| Engine file | Ported from LotoKarma | Notes |
| --- | --- | --- |
| `zodiac.ts` | `zodiac.ts` | English labels; added modality/ruler; sign comes from the Sun's ecliptic longitude |
| `solar-position.ts`, `ascendant.ts` | same | Meeus closed-form formulas, no ephemeris |
| `chinese-zodiac.ts` | same | Real Chinese New Year table 1920–2035, sexagenary cycle |
| `numerology.ts` | same | Added master numbers (11/22/33), soul urge, personal year |
| `lucky-numbers.ts` | `zodiac-numbers.ts` | Chaldean planet numbers + Wu Xing |
| `planets.ts` | `planetary-generator.ts` | `astronomy-engine`, now also Pluto |
| `iching.ts` | new | Three-coin casting, King Wen table, changing lines → relating hexagram |

## Interchangeable components

Every technique implements `InsightMethod` (`src/app/core/insight.ts`) and returns a generic
`InsightResult`. One component, `<si-insight-card>`, renders any result, so methods and views
are swappable:

- **Add a method**: write `methods/foo.method.ts`, add it to `methods/index.ts`.
- **Remove a method**: delete its line in `methods/index.ts`.
- **Reuse the card elsewhere**: it only needs `[method]` and `[result]` inputs.

## Commands

```bash
npm install     # .npmrc sets legacy-peer-deps (npm 10 + vitest peer-resolution bug)
npm start       # http://localhost:4200
npm test        # engine unit tests (vitest)
npm run build
```

## Next ideas

Yi King interpretation texts, transit view (today's planets vs. birth chart), BaZi / Four
Pillars, Mayan or Celtic zodiac as extra `InsightMethod`s, saving readings as a journal.
