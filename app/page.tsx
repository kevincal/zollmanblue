import Drawings from "./drawings";
import TradeList from "./trade-list";
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
        <ul className="contact">
          <li>
            <a href="mailto:hello@zollmanblue.com">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5.5" width="18" height="13" rx="1" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
              hello@zollmanblue.com
            </a>
          </li>
          <li>
            <a href="tel:+15125532529">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3.5h3.5l1.75 4.5-2.25 1.5a11 11 0 0 0 6.5 6.5l1.5-2.25 4.5 1.75V19a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 3.5 5 1.5 1.5 0 0 1 5 3.5Z" />
              </svg>
              512-553-2529
            </a>
          </li>
        </ul>
        <p className="place">Johnson City, Texas</p>
      </main>
      <TradeList />
    </>
  );
}
