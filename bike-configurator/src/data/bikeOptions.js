/**
 * bikeOptions.js
 * -----------------------------------------------------------------------
 * Single source of truth for the configurator's catalog: every step in the
 * build wizard, every selectable option within each step, base pricing,
 * and the compatibility rules that connect options across steps.
 *
 * Compatibility model:
 *   Each option may declare `incompatibleWith: [optionId, ...]`.
 *   This is symmetric — if A excludes B, B is treated as excluding A too,
 *   so rules only need to be written once (see buildCompatibilityIndex).
 *
 *   Each option may also declare `requires: { stepId: [optionId, ...] }`
 *   meaning: this option is only valid if the named step's current
 *   selection is one of the listed options. Used for things like
 *   "Disc brakes require a frame with disc mounts."
 */

export const STEPS = [
  {
    id: "frame",
    label: "Frame",
    description: "The foundation of your build — material and geometry.",
  },
  {
    id: "frameColor",
    label: "Finish",
    description: "Paint finish for your frame.",
  },
  {
    id: "wheels",
    label: "Wheels",
    description: "Wheelset affects ride quality, weight, and terrain.",
  },
  {
    id: "drivetrain",
    label: "Drivetrain",
    description: "Gearing range for the terrain you'll ride.",
  },
  {
    id: "brakes",
    label: "Brakes",
    description: "Stopping power, matched to your frame's mounts.",
  },
  {
    id: "extras",
    label: "Extras",
    description: "Finishing touches — pick as many as you like.",
    multiSelect: true,
  },
];

export const OPTIONS = {
  frame: [
    {
      id: "frame-alu-road",
      name: "Alloy Road",
      price: 0,
      blurb: "Lightweight 6061 aluminum, race geometry.",
      specs: { weight: "1.6 kg", material: "Aluminum", mounts: "Rim + Disc" },
      swatch: "#9AA5AD",
    },
    {
      id: "frame-carbon-road",
      name: "Carbon Road",
      price: 950,
      blurb: "Full carbon monocoque, stiff and fast.",
      specs: { weight: "1.1 kg", material: "Carbon fiber", mounts: "Disc only" },
      swatch: "#2B2B2E",
    },
    {
      id: "frame-steel-tourer",
      name: "Steel Tourer",
      price: 320,
      blurb: "Chromoly steel built for comfort and cargo.",
      specs: { weight: "2.4 kg", material: "Chromoly steel", mounts: "Rim + Disc" },
      swatch: "#5C4A3D",
    },
    {
      id: "frame-alu-gravel",
      name: "Alloy Gravel",
      price: 180,
      blurb: "Wider clearance, relaxed geometry for mixed terrain.",
      specs: { weight: "1.8 kg", material: "Aluminum", mounts: "Disc only" },
      swatch: "#7C8A6E",
    },
  ],

  frameColor: [
    { id: "color-rust", name: "Rust Orange", price: 0, swatch: "#C4501F" },
    { id: "color-pine", name: "Pine Green", price: 0, swatch: "#3D5A4C" },
    { id: "color-espresso", name: "Espresso Black", price: 0, swatch: "#1C1A17" },
    { id: "color-paper", name: "Paper White", price: 45, swatch: "#F5F1E8" },
    { id: "color-custom", name: "Custom RAL Match", price: 220, swatch: "linear-gradient(135deg,#C4501F,#3D5A4C,#1C1A17)" },
  ],

  wheels: [
    {
      id: "wheel-alloy-700c",
      name: "Alloy 700c",
      price: 0,
      blurb: "Reliable double-wall alloy rims for everyday riding.",
      specs: { weight: "1.8 kg/pair", rim: "700c", braking: "Rim or Disc" },
    },
    {
      id: "wheel-carbon-700c",
      name: "Carbon 700c",
      price: 780,
      blurb: "Aero carbon rims, stiffer and lighter for speed.",
      specs: { weight: "1.4 kg/pair", rim: "700c", braking: "Disc only" },
      incompatibleWith: ["brake-rim"],
    },
    {
      id: "wheel-gravel-650b",
      name: "Gravel 650b",
      price: 240,
      blurb: "Wider profile for off-road traction and comfort.",
      specs: { weight: "1.9 kg/pair", rim: "650b", braking: "Disc only" },
      incompatibleWith: ["brake-rim"],
    },
  ],

  drivetrain: [
    {
      id: "drive-2x9",
      name: "2×9 Sport",
      price: 0,
      blurb: "18-speed mechanical, dependable and easy to service.",
      specs: { speeds: "18", shifting: "Mechanical", range: "Road" },
    },
    {
      id: "drive-1x12",
      name: "1×12 Wide Range",
      price: 410,
      blurb: "Simplified single-ring setup with huge gear range.",
      specs: { speeds: "12", shifting: "Mechanical", range: "Gravel/MTB" },
    },
    {
      id: "drive-2x12-electronic",
      name: "2×12 Electronic",
      price: 1450,
      blurb: "Wireless electronic shifting, precise under load.",
      specs: { speeds: "24", shifting: "Electronic", range: "Road/Race" },
    },
  ],

  brakes: [
    {
      id: "brake-rim",
      name: "Rim Brakes",
      price: 0,
      blurb: "Light and simple, best for dry-climate road riding.",
      specs: { type: "Caliper", requires: "Rim-compatible frame" },
      requires: { frame: ["frame-alu-road", "frame-steel-tourer"] },
    },
    {
      id: "brake-disc-mech",
      name: "Mechanical Disc",
      price: 95,
      blurb: "Cable-actuated discs — strong stopping, easy to maintain.",
      specs: { type: "Disc, mechanical", requires: "Disc mounts" },
    },
    {
      id: "brake-disc-hydraulic",
      name: "Hydraulic Disc",
      price: 280,
      blurb: "Self-adjusting hydraulic discs for maximum control.",
      specs: { type: "Disc, hydraulic", requires: "Disc mounts" },
    },
  ],

  extras: [
    { id: "extra-rack", name: "Rear Rack", price: 65, blurb: "Mounts for panniers and cargo." },
    { id: "extra-fenders", name: "Fenders", price: 40, blurb: "Keep road spray off your back." },
    { id: "extra-lights", name: "Integrated Lights", price: 85, blurb: "Front and rear USB-rechargeable." },
    { id: "extra-computer", name: "GPS Computer", price: 220, blurb: "Mapping, power, and ride tracking." },
    { id: "extra-kickstand", name: "Kickstand", price: 25, blurb: "Folding alloy kickstand." },
  ],
};

/**
 * Build a symmetric incompatibility index once, at module load, so the
 * compatibility hook doesn't need to scan every option on every render.
 * Result shape: { [optionId]: Set(optionId, optionId, ...) }
 */
function buildCompatibilityIndex() {
  const index = {};
  const ensure = (id) => (index[id] ??= new Set());

  Object.values(OPTIONS)
    .flat()
    .forEach((opt) => {
      (opt.incompatibleWith || []).forEach((otherId) => {
        ensure(opt.id).add(otherId);
        ensure(otherId).add(opt.id); // symmetric
      });
    });

  return index;
}

export const COMPATIBILITY_INDEX = buildCompatibilityIndex();

/** Flat lookup map: optionId -> option object (with its stepId attached) */
export const OPTION_LOOKUP = Object.entries(OPTIONS).reduce((acc, [stepId, opts]) => {
  opts.forEach((opt) => {
    acc[opt.id] = { ...opt, stepId };
  });
  return acc;
}, {});

/** Default starting configuration — the "stock build" */
export const DEFAULT_SELECTIONS = {
  frame: "frame-alu-road",
  frameColor: "color-rust",
  wheels: "wheel-alloy-700c",
  drivetrain: "drive-2x9",
  brakes: "brake-rim",
  extras: [],
};

export const BASE_PRICE = 480; // base bike assembly price before component deltas
