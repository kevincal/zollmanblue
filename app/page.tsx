import Drawings from "./drawings";
import WindowLight from "./window-light";

const WORDMARK = "Zollman Blue";

export default function Home() {
  return (
    <>
      <Drawings />
      <WindowLight />
      <main className="page">
        <h1 className="logo" aria-label={WORDMARK}>
          {[...WORDMARK].map((ch, i) =>
            ch === " " ? (
              " "
            ) : (
              <span key={i} aria-hidden="true">
                {ch}
              </span>
            ),
          )}
        </h1>
        <p className="tagline">Vintage Home &amp; Objects</p>
        <p className="soon">Coming Soon</p>
        <p className="place">Johnson City, Texas</p>
      </main>
    </>
  );
}
