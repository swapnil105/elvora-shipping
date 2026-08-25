import { useMemo, useState } from "react";

const W = 1000;
const H = 500;

// Simple equirectangular projection into the viewBox.
function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

const DUBAI = { name: "Dubai", lat: 25.2, lon: 55.3 };

// Coarse continent outlines ([lat, lon] vertices) — a stylized world map, not survey-accurate.
const CONTINENTS: [number, number][][] = [
  // North America
  [
    [71, -156], [70, -128], [60, -95], [52, -80], [45, -66], [40, -74], [30, -81], [25, -80],
    [18, -95], [15, -92], [22, -105], [30, -116], [40, -124], [48, -125], [55, -130], [60, -140], [65, -166], [71, -156],
  ],
  // South America
  [
    [11, -74], [10, -61], [0, -50], [-8, -35], [-23, -41], [-34, -54], [-46, -66], [-53, -70],
    [-40, -73], [-25, -71], [-15, -76], [-5, -81], [2, -79], [8, -77], [11, -74],
  ],
  // Eurasia
  [
    [70, 10], [66, 30], [72, 60], [76, 100], [72, 140], [66, 178], [58, 158], [50, 140], [42, 131],
    [35, 122], [30, 122], [22, 110], [10, 105], [8, 98], [16, 90], [22, 88], [8, 78], [20, 70],
    [24, 60], [28, 50], [30, 48], [36, 36], [40, 28], [45, 14], [43, -9], [50, -4], [58, 6], [64, 10], [70, 10],
  ],
  // Africa
  [
    [36, -6], [33, 10], [31, 25], [15, 40], [11, 51], [-2, 42], [-16, 40], [-26, 33], [-34, 20],
    [-28, 16], [-12, 13], [0, 9], [5, -4], [10, -13], [15, -17], [21, -17], [30, -10], [36, -6],
  ],
  // Australia
  [
    [-11, 131], [-11, 143], [-20, 149], [-28, 153], [-38, 146], [-39, 141], [-34, 123], [-32, 115],
    [-22, 114], [-16, 123], [-11, 131],
  ],
];

type Corridor = {
  id: string;
  city: string;
  region: string;
  group: "Asia" | "Europe" | "Americas" | "Africa" | "Gulf";
  lat: number;
  lon: number;
  mode: string;
  transit: string;
};

const GROUP_COLOR: Record<Corridor["group"], string> = {
  Asia: "var(--teal)",
  Europe: "var(--sky)",
  Americas: "var(--coral)",
  Africa: "var(--sand)",
  Gulf: "var(--accent)",
};

const GROUPS: Corridor["group"][] = ["Asia", "Europe", "Americas", "Africa", "Gulf"];

const CORRIDORS: Corridor[] = [
  { id: "cn", city: "Shanghai", region: "East Asia", group: "Asia", lat: 31.2, lon: 121.5, mode: "Ocean FCL / LCL", transit: "≈ 18 days" },
  { id: "sg", city: "Singapore", region: "Southeast Asia", group: "Asia", lat: 1.35, lon: 103.8, mode: "Ocean transhipment", transit: "≈ 12 days" },
  { id: "in", city: "Mumbai", region: "South Asia", group: "Asia", lat: 19.0, lon: 72.8, mode: "Ocean / Air", transit: "≈ 6 days" },
  { id: "nl", city: "Rotterdam", region: "Northern Europe", group: "Europe", lat: 51.9, lon: 4.5, mode: "Ocean FCL", transit: "≈ 22 days" },
  { id: "uk", city: "Felixstowe", region: "United Kingdom", group: "Europe", lat: 52.0, lon: 1.3, mode: "Ocean / Freight fwd", transit: "≈ 24 days" },
  { id: "us", city: "New York", region: "US East Coast", group: "Americas", lat: 40.7, lon: -74.0, mode: "Ocean / Air", transit: "≈ 28 days" },
  { id: "usw", city: "Los Angeles", region: "US West Coast", group: "Americas", lat: 34.0, lon: -118.2, mode: "Ocean FCL", transit: "≈ 30 days" },
  { id: "br", city: "Santos", region: "South America", group: "Americas", lat: -23.9, lon: -46.3, mode: "Ocean FCL", transit: "≈ 32 days" },
  { id: "ke", city: "Mombasa", region: "East Africa", group: "Africa", lat: -4.0, lon: 39.6, mode: "Ocean / Land", transit: "≈ 10 days" },
  { id: "sa", city: "Jeddah", region: "Red Sea", group: "Gulf", lat: 21.5, lon: 39.2, mode: "Ocean / Land haul", transit: "≈ 4 days" },
];

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(dist * 0.22, 130);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const cx = mx + nx * lift;
  const cy = my + ny * lift - 10;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export default function NetworkMap() {
  const hub = useMemo(() => project(DUBAI.lat, DUBAI.lon), []);
  const nodes = useMemo(
    () =>
      CORRIDORS.map((c) => ({
        ...c,
        pt: project(c.lat, c.lon),
        d: arcPath(project(DUBAI.lat, DUBAI.lon), project(c.lat, c.lon)),
      })),
    [],
  );
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<Corridor["group"] | "All">("All");
  const activeC = nodes.find((n) => n.id === active);

  const inFilter = (g: Corridor["group"]) => filter === "All" || filter === g;

  // latitude / longitude grid lines to imply the globe (command-centre feel)
  const parallels = useMemo(() => [-60, -30, 0, 30, 60].map((lat) => project(lat, 0).y), []);
  const meridians = useMemo(() => [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => project(0, lon).x), []);

  const landPaths = useMemo(
    () =>
      CONTINENTS.map(
        (poly) =>
          poly
            .map(([lat, lon], i) => {
              const p = project(lat, lon);
              return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            })
            .join(" ") + " Z",
      ),
    [],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {/* -------- map -------- */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Illustrative map of ELVORA trade corridors radiating from Dubai"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--sand)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--sand)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ocean" cx="62%" cy="55%" r="75%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
              <stop offset="55%" stopColor="var(--primary)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </radialGradient>
            <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dbe9f2" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8fb3c9" stopOpacity="0.14" />
            </linearGradient>
            <filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--accent)" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ocean depth wash */}
          <rect x={0} y={0} width={W} height={H} fill="url(#ocean)" />

          {/* graticule grid lines (under land) */}
          {parallels.map((y, i) => (
            <line key={`p${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />
          ))}
          {meridians.map((x, i) => (
            <line key={`m${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />
          ))}

          {/* world map — continent silhouettes */}
          <g filter="url(#landGlow)">
            {landPaths.map((d, i) => (
              <path
                key={`land${i}`}
                d={d}
                fill="url(#land)"
                stroke="#cfe3f0"
                strokeOpacity={0.45}
                strokeWidth={0.9}
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* corridors */}
          {nodes.map((n) => {
            const dim = !inFilter(n.group) || (active !== null && active !== n.id);
            const hot = active === n.id;
            const col = GROUP_COLOR[n.group];
            return (
              <g key={n.id} style={{ opacity: dim ? 0.12 : 1, transition: "opacity .4s" }}>
                <path
                  d={n.d}
                  fill="none"
                  stroke={col}
                  strokeWidth={hot ? 2.2 : 1.3}
                  strokeOpacity={hot ? 1 : 0.55}
                  strokeDasharray="5 7"
                  className="route-line"
                  style={{ animation: "dash-flow 22s linear infinite" }}
                />
                <circle
                  className="cargo-dot"
                  r={hot ? 4 : 2.8}
                  fill={col}
                  style={{
                    offsetPath: `path("${n.d}")`,
                    animation: `cargo-move ${9 + (n.city.length % 5)}s linear infinite`,
                    filter: "drop-shadow(0 0 3px currentColor)",
                  }}
                />
              </g>
            );
          })}

          {/* destination ports */}
          {nodes.map((n) => {
            const dim = !inFilter(n.group);
            return (
              <g
                key={`p-${n.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="button"
                aria-label={`${n.city} corridor — ${n.mode}, ${n.transit}`}
                style={{ opacity: dim ? 0.15 : 1, transition: "opacity .4s" }}
              >
                <circle cx={n.pt.x} cy={n.pt.y} r={12} fill="transparent" />
                {active === n.id && (
                  <circle cx={n.pt.x} cy={n.pt.y} r={3} fill="none" stroke={GROUP_COLOR[n.group]} strokeWidth={1}>
                    <animate attributeName="r" values="4;16" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={n.pt.x}
                  cy={n.pt.y}
                  r={active === n.id ? 4.5 : 3.2}
                  fill={GROUP_COLOR[n.group]}
                  style={{ transition: "all .3s", filter: "drop-shadow(0 0 3px currentColor)", color: GROUP_COLOR[n.group] }}
                />
                {active === n.id && (
                  <text
                    x={n.pt.x + (n.pt.x > W - 160 ? -8 : 8)}
                    y={n.pt.y - 8}
                    fill="#ffffff"
                    fontSize={13}
                    fontFamily="var(--font-mono)"
                    textAnchor={n.pt.x > W - 160 ? "end" : "start"}
                  >
                    {n.city}
                  </text>
                )}
              </g>
            );
          })}

          {/* Dubai hub */}
          <circle cx={hub.x} cy={hub.y} r={64} fill="url(#hubGlow)" />
          <circle cx={hub.x} cy={hub.y} r={5.5} fill="var(--sand)" style={{ filter: "drop-shadow(0 0 5px var(--sand))" }} />
          <circle cx={hub.x} cy={hub.y} r={3} fill="none" stroke="var(--sand)" strokeWidth={1.2}>
            <animate attributeName="r" values="5;34" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <text x={hub.x + 10} y={hub.y + 4} fill="var(--sand)" fontSize={14} fontFamily="var(--font-mono)" letterSpacing="0.15em">
            DUBAI · HUB
          </text>
        </svg>

        {/* filter chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["All", ...GROUPS] as const).map((g) => {
            const on = filter === g;
            const col = g === "All" ? "var(--sand)" : GROUP_COLOR[g];
            return (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className="flex items-center gap-2 border px-3 py-1.5 font-mono text-xs tracking-wider transition-colors"
                style={{
                  borderColor: on ? col : "rgba(255,255,255,0.18)",
                  color: on ? col : "rgba(255,255,255,0.7)",
                  background: on ? "rgba(255,255,255,0.06)" : "transparent",
                }}
              >
                {g !== "All" && <span className="h-2 w-2 rounded-full" style={{ background: col }} />}
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* -------- side panel -------- */}
      <aside className="flex flex-col">
        <div className="border border-white/10 bg-white/5 p-5">
          <div className="label mb-1 !text-[var(--sand)]">Selected corridor</div>
          <div className="font-display text-2xl text-white">
            {activeC ? `Dubai → ${activeC.city}` : "Global network"}
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Region</dt>
              <dd className="text-white/85">{activeC ? activeC.region : "6 continents"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Primary mode</dt>
              <dd className="text-white/85">{activeC ? activeC.mode : "Ocean · Air · Land"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Est. transit</dt>
              <dd className="text-white/85">{activeC ? activeC.transit : `${CORRIDORS.length} active lanes`}</dd>
            </div>
          </dl>
        </div>

        {/* port list */}
        <div className="mt-4 max-h-[280px] flex-1 overflow-y-auto border border-white/10">
          {nodes
            .filter((n) => inFilter(n.group))
            .map((n) => (
              <button
                key={n.id}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/5"
                style={{ background: active === n.id ? "rgba(255,255,255,0.06)" : "transparent" }}
              >
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: GROUP_COLOR[n.group] }} />
                  <span className="text-sm text-white/90">{n.city}</span>
                </span>
                <span className="font-mono text-xs text-white/45">{n.transit}</span>
              </button>
            ))}
        </div>
      </aside>

      <p className="text-xs text-white/45 lg:col-span-2">
        Hover a port, chip or list row to trace its corridor. Lanes, transit times and partner carriers shown are
        illustrative — confirm ELVORA&apos;s live routings before publishing.
      </p>
    </div>
  );
}
