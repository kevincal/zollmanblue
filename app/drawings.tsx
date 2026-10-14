// Onion-skin background: public-domain furniture plates (navy line art, see README credits)
// drifting slowly upward. The column is rendered twice so translateY(-50%) loops seamlessly.

const DRAWINGS = [
  { src: "01-chippendale-chairs-xiv", h: 34, x: -24 },
  { src: "07-director-construction", h: 62, x: 26 },
  { src: "02-ribband-back-chairs", h: 28, x: -14 },
  { src: "06-sheraton-chair-backs", h: 48, x: 30 },
  { src: "04-french-commode", h: 32, x: -28 },
  { src: "08-director-chair", h: 44, x: 18 },
  { src: "03-hepplewhite-designs", h: 40, x: -20 },
  { src: "05-sheraton-sofa-table", h: 26, x: 28 },
  { src: "09-darly-three-chairs", h: 30, x: -6 },
];

export default function Drawings() {
  const row = (copy: number) =>
    DRAWINGS.map(({ src, h, x }) => (
      // eslint-disable-next-line @next/next/no-img-element -- decorative, already optimized webp
      <img
        key={`${copy}-${src}`}
        src={`/drawings/${src}.webp`}
        alt=""
        decoding="async"
        style={{ "--h": `${h}vh`, "--x": `${x}vw` } as React.CSSProperties}
      />
    ));

  return (
    <div className="drawings" aria-hidden="true">
      <div className="drawings-track">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
