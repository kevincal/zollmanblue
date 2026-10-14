// Generates public/zollman-blue.svg — a hand-built compressed Didone wordmark.
// Run: node scripts/build-logo.mjs
//
// Each glyph is constructed from primitives on a cap-height grid (y grows down,
// cap line at 0, baseline at H). Didone traits: heavy vertical stems, hairline
// horizontals, vertical stress, and long unbracketed hairline serifs.

import { writeFileSync } from "node:fs";

const H = 300; // cap height
const S = 34; // thick stem
const T = 38; // thick diagonal (horizontal measure)
const h = 3.5; // hairline
const e = 17; // serif reach beyond the stem (the "extra elongated" serif)
const GAP = 16; // sidebearing between glyphs
const SPACE = 70; // word space
const COLOR = "#0B2A4F";

const f = (n) => +n.toFixed(2);
const poly = (pts) => "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
const rect = (x0, y0, x1, y1) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);

// Superellipse arc points; angles in degrees, 0 = right, 90 = down.
function arc(cx, cy, rx, ry, a0, a1, n = 2.6, steps = 64) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    const c = Math.cos(t), s = Math.sin(t);
    pts.push([
      cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n),
      cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n),
    ]);
  }
  return pts;
}

// Bracket: a small concave fillet filling the inside corner C where a serif meets a stem.
// u points along the serif away from the stem, v along the stem edge away from the serif.
const R = 9; // bracket radius on thick stems
const r = 6; // bracket radius on hairline stems
function bracket([cx, cy], [ux, uy], [vx, vy], rad = R) {
  const len = Math.hypot(vx, vy);
  vx /= len; vy /= len;
  const a = [cx + ux * rad, cy + uy * rad], b = [cx + vx * rad, cy + vy * rad];
  return `M${f(cx)} ${f(cy)}L${f(a[0])} ${f(a[1])}Q${f(cx)} ${f(cy)} ${f(b[0])} ${f(b[1])}Z`;
}
// Point on the line through p0→p1 at height y (for brackets on diagonal strokes).
const atY = ([x0, y0], [x1, y1], y) => x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);

// Beak: a curved Didone terminal on the end of a bar. Straight outer edge at x, running from
// the bar's outer edge (yOut) to the tip (yTip); the inner edge is a concave curve that sweeps
// from the hairline tip back into the bar's inner edge (yIn). dir = side the beak body grows toward.
function beak(x, yOut, yIn, yTip, dir, base, tip = h * 1.15) {
  const s = Math.sign(yTip - yIn);
  const L = yTip - yIn;
  const p = (px, py) => `${f(px)} ${f(py)}`;
  return (
    `M${p(x, yOut)}L${p(x, yTip)}L${p(x + dir * tip, yTip - s * 2)}` +
    `C${p(x + dir * tip * 1.3, yIn + L * 0.38)} ${p(x + dir * base * 0.28, yIn + s * 1.5)} ${p(x + dir * base, yIn)}` +
    `L${p(x + dir * base, yOut)}Z`
  );
}

const L_ = [-1, 0], R_ = [1, 0], UP = [0, -1], DN = [0, 1];

const glyphs = {
  Z: () => {
    const W = 196, tb = h * 1.6, bb = 9;
    return {
      W,
      d: [
        rect(8, 0, W - 2, tb), // top bar
        beak(8, 0, tb, 92, 1, 44), // top-left beak
        poly([[W - 2 - T * 1.15, 0], [W - 2, 0], [T * 1.15, H], [0, H]]), // diagonal
        rect(0, H - bb, W, H), // bottom bar
        beak(W, H, H - bb, H - 104, -1, 52), // bottom-right beak
      ],
    };
  },
  O: () => {
    const W = 172, cx = W / 2, cy = H / 2;
    const outer = arc(cx, cy, W / 2, H / 2 + 4, 0, 360, 2.3, 160);
    const inner = arc(cx, cy, W / 2 - S - 2, H / 2 + 4 - h * 1.4, 360, 0, 2.6, 160);
    return { W, d: [poly(outer) + poly(inner)] };
  },
  L: () => {
    const W = 150, fb = h * 1.6;
    return {
      W,
      d: [
        rect(e, 0, e + S, H),
        rect(0, 0, 2 * e + S, h),
        rect(0, H - fb, W, H),
        beak(W, H, H - fb, H - 106, -1, 50),
        bracket([e, h], L_, DN),
        bracket([e + S, h], R_, DN),
        bracket([e, H - fb], L_, UP),
        bracket([e + S, H - fb], R_, UP, R * 1.4),
      ],
    };
  },
  M: () => {
    const W = 262, vx = W / 2 + 6;
    const rs = W - e - S; // right stem left edge
    return {
      W,
      d: [
        rect(e, 0, e + h, H), // thin left stem
        rect(0, H - h, 2 * e + h, H),
        poly([[e, 0], [e + T, 0], [vx + 1, H], [vx - T + 4, H]]), // thick diagonal
        poly([[rs - h * 1.4, 0], [rs, 0], [vx + h * 0.6, H], [vx - h * 0.8, H]]), // thin diagonal
        rect(rs, 0, W - e, H), // thick right stem
        rect(0, 0, e + T, h),
        rect(rs - h * 2, 0, W, h),
        rect(rs - e, H - h, W, H),
        bracket([e, h], L_, DN, r),
        bracket([e, H - h], L_, UP, r),
        bracket([e + h, H - h], R_, UP, r),
        bracket([W - e, h], R_, DN),
        bracket([rs, H - h], L_, UP),
        bracket([W - e, H - h], R_, UP),
      ],
    };
  },
  A: () => {
    const W = 214, a = W / 2 + 4;
    const yb = H * 0.66;
    const tl = h * 1.4;
    const lx = (y) => e + 1 + ((a - 6 - (e + 1)) * (H - y)) / H; // thin diagonal, interpolated
    const rx = (y) => W - e - T + ((a - 6 - (W - e - T)) * (H - y)) / H; // thick diagonal inner edge
    // Diagonal edges (top point, foot point) for brackets at the feet.
    const thinL = [[a - 7, -4], [e, H]], thinR = [[a - 7 + tl, -4], [e + tl, H]];
    const thickL = [[a - 8, -4], [W - e - T, H]], thickR = [[a + 6, -4], [W - e, H]];
    const y = H - h;
    const foot = ([p0, p1], u, rad) => bracket([atY(p0, p1, y), y], u, [p0[0] - p1[0], p0[1] - p1[1]], rad);
    return {
      W,
      d: [
        poly([thinL[0], thinR[0], thinR[1], thinL[1]]), // thin left
        poly([thickL[0], thickR[0], thickR[1], thickL[1]]), // thick right (tapers to apex)
        rect(lx(yb), yb - h / 2, rx(yb) + 2, yb + h / 2), // hairline crossbar
        rect(0, H - h, 2 * e + tl, H),
        rect(W - 2 * e - T, H - h, W, H),
        foot(thinL, L_, r),
        foot(thinR, R_, r),
        foot(thickL, L_, R),
        foot(thickR, R_, R),
      ],
    };
  },
  N: () => {
    const W = 194, rs = W - e - h;
    return {
      W,
      d: [
        rect(e, 0, e + h, H), // thin left stem
        rect(0, H - h, 2 * e + h, H),
        poly([[e, 0], [e + T, 0], [W - e, H + 4], [W - e - T * 0.7, H + 4]]), // thick diagonal
        rect(rs, 0, W - e, H + 4), // thin right stem
        rect(0, 0, e + T, h),
        rect(rs - e, 0, W, h),
        bracket([e, h], L_, DN, r),
        bracket([e, H - h], L_, UP, r),
        bracket([e + h, H - h], R_, UP, r),
        bracket([rs, h], L_, DN, r),
        bracket([W - e, h], R_, DN, r),
      ],
    };
  },
  B: () => {
    const W = 170, sx = e + S;
    const mid = H * 0.47;
    const hb = h * 1.2;
    const bowl = (top, bot, x0, rx) => {
      const cy = (top + bot) / 2, ry = (bot - top) / 2;
      const outer = [[sx - 1, top], ...arc(x0, cy, rx, ry, -90, 90), [sx - 1, bot]];
      const inner = [[sx - 1, bot - hb], ...arc(x0 - 1, cy, rx - S, ry - hb, 90, -90), [sx - 1, top + hb]];
      return poly(outer) + poly(inner);
    };
    return {
      W,
      d: [
        rect(e, 0, sx, H),
        rect(0, 0, sx, h),
        rect(0, H - h, sx, H),
        bowl(0, mid + h / 2, 88, W - 16 - 88),
        bowl(mid - h / 2, H, 92, W - 92),
        bracket([e, h], L_, DN),
        bracket([e, H - h], L_, UP),
        bracket([sx, hb], R_, DN),
        bracket([sx, H - hb], R_, UP),
        bracket([sx, mid + h / 2 - hb], R_, UP),
        bracket([sx, mid - h / 2 + hb], R_, DN),
      ],
    };
  },
  U: () => {
    const W = 196, yb = H - 112;
    const L0 = e, L1 = e + S, R0 = W - e - h * 1.7, R1 = W - e;
    const outer = arc((L0 + R1) / 2, yb, (R1 - L0) / 2, H + 3 - yb, 180, 0, 2.5);
    const inner = arc((L1 + R0) / 2, yb, (R0 - L1) / 2, H + 3 - yb - h * 1.6, 0, 180, 2.5);
    return {
      W,
      d: [
        rect(L0, 0, L1, yb + 0.5),
        rect(R0, 0, R1, yb + 0.5),
        poly([...outer, ...inner]),
        rect(0, 0, 2 * e + S, h),
        rect(R0 - e, 0, W, h),
        bracket([L0, h], L_, DN),
        bracket([L1, h], R_, DN),
        bracket([R0, h], L_, DN, r),
        bracket([R1, h], R_, DN, r),
      ],
    };
  },
  E: () => {
    const W = 158, sx = e + S, my = H * 0.49;
    const tb = h * 1.4, fb = h * 1.6, mx = W - 34;
    return {
      W,
      d: [
        rect(e, 0, sx, H),
        rect(0, 0, W - 8, tb),
        beak(W - 8, 0, tb, 90, -1, 44),
        rect(sx, my - h / 2, mx, my + h / 2),
        beak(mx, my + h / 2, my - h / 2, my - 40, -1, 22),
        beak(mx, my - h / 2, my + h / 2, my + 40, -1, 22),
        rect(0, H - fb, W, H),
        beak(W, H, H - fb, H - 106, -1, 50),
        bracket([e, tb], L_, DN),
        bracket([sx, tb], R_, DN, R * 1.4),
        bracket([sx, my - h / 2], R_, UP),
        bracket([sx, my + h / 2], R_, DN),
        bracket([e, H - fb], L_, UP),
        bracket([sx, H - fb], R_, UP, R * 1.4),
      ],
    };
  },
};

const text = "ZOLLMAN BLUE";
let x = 0;
const paths = [];
for (const ch of text) {
  if (ch === " ") { x += SPACE; continue; }
  const { W, d } = glyphs[ch]();
  // One <path> per primitive so overlaps union instead of cancelling under evenodd.
  paths.push(`<g transform="translate(${f(x)} 0)">${d.map((p) => `<path d="${p}"/>`).join("")}</g>`);
  x += W + GAP;
}
const width = x - GAP;
const pad = 8;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${f(width + pad * 2)} ${H + pad * 2}" role="img" aria-labelledby="title">
<title id="title">Zollman Blue</title>
<g fill="${COLOR}" fill-rule="evenodd">
${paths.join("\n")}
</g>
</svg>
`;

writeFileSync(new URL("../public/zollman-blue.svg", import.meta.url), svg);
console.log(`wrote public/zollman-blue.svg (${f(width)} x ${H})`);
