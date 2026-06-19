# Forge — Custom Bicycle Configurator

A premium, e-commerce-grade product configurator built in React. Customers
step through a wizard (Frame → Finish → Wheels → Drivetrain → Brakes →
Extras), see live pricing and a visual bike preview update as they go, get
warned about incompatible component combinations, and can save or compare
multiple builds.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
├── main.jsx                       Entry point
├── App.jsx                        Layout shell (header, 3-column grid, provider)
├── index.css                      Tailwind base + global styles
│
├── data/
│   └── bikeOptions.js              Single source of truth: steps, options,
│                                    prices, compatibility rules
│
├── context/
│   └── ConfiguratorContext.jsx     Global state: selections, step nav,
│                                    saved builds, compare-mode ids
│
├── hooks/
│   ├── usePricing.js               Derives price breakdown from selections
│   └── useCompatibility.js         Derives conflicts + per-option disabled state
│
├── components/
│   ├── ui/                         shadcn-style primitives (Button, Card,
│   │                                Badge, Sheet/Drawer, Tabs, Separator,
│   │                                Tooltip) — Radix UI under the hood
│   ├── Stepper.jsx                  Left-rail wizard navigation
│   ├── StepPanel.jsx                Renders option cards for the active step
│   ├── OptionCard.jsx               Visual selection card (single source for
│   │                                selected / disabled / default states)
│   ├── CompatibilityNotice.jsx      Inline conflict banner
│   ├── BikePreviewSVG.jsx           Live SVG illustration (signature element)
│   ├── SummaryPanel.jsx             Sticky right panel: preview, price, actions
│   ├── SaveConfigDrawer.jsx         Drawer to name & save the current build
│   ├── SavedConfigsList.jsx         List of saved builds (load/delete/compare)
│   └── CompareDrawer.jsx            Bonus: side-by-side comparison table
```

## How the state model works

**Selections are the only source of truth.** `ConfiguratorContext` holds a
single `selections` object keyed by step id (e.g. `{ frame: "frame-carbon-road",
wheels: "wheel-alloy-700c", extras: ["extra-rack"] }`). Everything else —
price, compatibility status, which cards are greyed out — is *derived* from
that object on every render via `usePricing` and `useCompatibility`, both
memoized with `useMemo`. There is no separate "total price" or "is valid"
state to keep in sync; it's computed fresh from selections every time,
which eliminates an entire category of state-drift bugs.

**Compatibility rules live in the data layer, not the components.** Each
option in `bikeOptions.js` can declare:
- `incompatibleWith: [optionId, ...]` — symmetric conflicts (e.g. carbon
  wheels can't be paired with rim brakes). Declared once; the module builds
  a symmetric lookup index at load time.
- `requires: { stepId: [optionId, ...] }` — directional dependencies (e.g.
  rim brakes require a frame that has rim-brake mounts).

`useCompatibility` reads these rules to produce both a list of active
conflicts (shown in the banner) and an `isOptionDisabled(stepId, optionId)`
predicate the option cards use to pre-emptively grey out choices that would
create a conflict — so users discover incompatibilities before picking them,
not just after.

**Saved configurations and compare mode** are snapshots: `saveConfiguration`
deep-copies the current `selections` plus the computed total into a list.
Compare mode just selects up to three saved snapshots and renders them
side-by-side per step in `CompareDrawer`.

## Customizing the catalog

Everything about what's sellable — steps, options, prices, specs, swatches,
and compatibility rules — lives in `src/data/bikeOptions.js`. To add a new
step (e.g. "Saddle"), add an entry to `STEPS` and a matching array under
`OPTIONS`; the wizard, pricing, and compatibility engine all pick it up
automatically with no other code changes.

## Styling

Tailwind CSS with a custom token set (see `tailwind.config.js`): a warm
paper background, espresso-black text, rust-orange and pine-green accents
evoking a frame-builder's workshop, paired with Archivo (display), Inter
(body/UI), and JetBrains Mono (prices/specs). All interactive primitives
are shadcn-style components built on Radix UI for accessibility (focus
management, keyboard nav, ARIA wiring) — no app code calls Radix directly
except through the wrapped primitives in `components/ui/`.
