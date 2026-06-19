import React from "react";

/**
 * BikePreviewSVG
 * -----------------------------------------------------------------------
 * A simplified bicycle silhouette that visually reflects the current
 * configuration: frame color, wheel style (alloy/carbon spokes vs. wider
 * gravel tires), and whether extras like a rack or fenders are active.
 * Pure presentational component — takes derived props, no internal state.
 */
export default function BikePreviewSVG({ frameColorHex, wheelType, extras = [] }) {
  const hasRack = extras.includes("extra-rack");
  const hasFenders = extras.includes("extra-fenders");
  const hasLights = extras.includes("extra-lights");
  const isWideTire = wheelType === "wheel-gravel-650b";
  const isCarbon = wheelType === "wheel-carbon-700c";

  const tireWidth = isWideTire ? 7 : 4;
  const spokeColor = isCarbon ? "#2B2B2E" : "#C9C2B5";

  return (
    <svg
      viewBox="0 0 320 180"
      className="w-full h-auto"
      role="img"
      aria-label="Preview of your custom bicycle configuration"
    >
      {/* ground line */}
      <line x1="20" y1="156" x2="300" y2="156" stroke="#E8E1D6" strokeWidth="2" />

      {/* rear wheel */}
      <g>
        <circle cx="90" cy="130" r="34" fill="none" stroke="#1C1A17" strokeWidth={tireWidth} />
        <circle cx="90" cy="130" r="34" fill="none" stroke={spokeColor} strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1="90"
              y1="130"
              x2={90 + 30 * Math.cos(angle)}
              y2={130 + 30 * Math.sin(angle)}
              stroke={spokeColor}
              strokeWidth="1"
            />
          );
        })}
        <circle cx="90" cy="130" r="4" fill="#1C1A17" />
      </g>

      {/* front wheel */}
      <g>
        <circle cx="230" cy="130" r="34" fill="none" stroke="#1C1A17" strokeWidth={tireWidth} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1="230"
              y1="130"
              x2={230 + 30 * Math.cos(angle)}
              y2={130 + 30 * Math.sin(angle)}
              stroke={spokeColor}
              strokeWidth="1"
            />
          );
        })}
        <circle cx="230" cy="130" r="4" fill="#1C1A17" />
      </g>

      {/* frame triangle (rear) */}
      <path
        d="M 90 130 L 150 70 L 160 130 Z"
        fill="none"
        stroke={frameColorHex}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* frame top tube + head tube to front wheel */}
      <path
        d="M 150 70 L 215 70 L 230 130"
        fill="none"
        stroke={frameColorHex}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 160 130 L 215 70"
        fill="none"
        stroke={frameColorHex}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* seat post + saddle */}
      <line x1="150" y1="70" x2="142" y2="48" stroke={frameColorHex} strokeWidth="5" />
      <rect x="125" y="44" width="24" height="6" rx="3" fill="#1C1A17" />

      {/* handlebar stem + bar */}
      <line x1="215" y1="70" x2="222" y2="52" stroke="#1C1A17" strokeWidth="4" />
      <path d="M 210 50 Q 222 46 234 50" fill="none" stroke="#1C1A17" strokeWidth="4" strokeLinecap="round" />

      {/* pedal crank */}
      <circle cx="160" cy="130" r="10" fill="none" stroke="#1C1A17" strokeWidth="3" />
      <line x1="160" y1="130" x2="172" y2="142" stroke="#1C1A17" strokeWidth="3" strokeLinecap="round" />

      {/* optional rack */}
      {hasRack && (
        <g>
          <line x1="90" y1="130" x2="80" y2="90" stroke="#8A8378" strokeWidth="3" />
          <line x1="150" y1="70" x2="80" y2="90" stroke="#8A8378" strokeWidth="3" />
          <line x1="68" y1="88" x2="92" y2="88" stroke="#8A8378" strokeWidth="3" />
        </g>
      )}

      {/* optional fenders */}
      {hasFenders && (
        <>
          <path
            d="M 64 130 A 34 34 0 0 1 116 130"
            fill="none"
            stroke="#3D5A4C"
            strokeWidth="3"
            opacity="0.85"
          />
          <path
            d="M 204 130 A 34 34 0 0 1 256 130"
            fill="none"
            stroke="#3D5A4C"
            strokeWidth="3"
            opacity="0.85"
          />
        </>
      )}

      {/* optional lights */}
      {hasLights && (
        <>
          <circle cx="236" cy="50" r="3.5" fill="#C4501F" />
          <circle cx="123" cy="48" r="3.5" fill="#C4501F" />
        </>
      )}
    </svg>
  );
}
