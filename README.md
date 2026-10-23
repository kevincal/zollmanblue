# Zollman Blue

"Coming soon" landing page for Zollman Blue, Johnson City, Texas. Built with Next.js and deployed on Vercel.

## Requirements

- [nvm](https://github.com/nvm-sh/nvm)
- The Node.js version pinned in `.nvmrc` (currently 22.22.3)

The Node version lives in `.nvmrc`. nvm reads that file whenever you run `nvm install` or `nvm use` in the project folder, so you never need to type a version number. Vercel builds with the matching Node 22 line, set by `engines.node` in `package.json`; keep the two in step if you upgrade.

## Run locally

```bash
nvm install      # first time only: installs the Node version from .nvmrc
nvm use          # switches this terminal to the Node version from .nvmrc
npm install      # installs dependencies
npm run dev      # starts the dev server
```

Run `nvm use` in each new terminal before the npm commands.

Then open [http://localhost:3000](http://localhost:3000). The page reloads automatically when you edit files.

To check the production build:

```bash
npm run build
npm start
```

## Project structure

| File | What it holds |
| --- | --- |
| `app/page.tsx` | Page content: the wordmark, "Coming Soon", and the location line |
| `app/layout.tsx` | Page title and description, and loading of the Bodoni Moda font from Google Fonts |
| `app/globals.css` | All styling: colors, type sizes and spacing, the custom cursor, the letter hover effect, and the background layers |
| `app/window-light.tsx` | Timing for the occasional window-light effect |

## Design notes

- **Typeface:** Bodoni Moda, loaded with its optical-size axis so large text uses the high-contrast display cut.
- **Colors:** navy `#0A2749` on a warm off-white `#F2EFE9`. Both are CSS variables (`--navy`, `--bg`) at the top of `app/globals.css`.
- **Wordmark:** set tight with `letter-spacing: -0.045em`.
- **Cursor:** a thin navy line arrow, drawn as an inline SVG in the `--cursor` variable.
- **Hover:** each letter of the wordmark turns into a 0.5px navy outline. It pops in over 0.12s and fades back over 1.6s; change these in the `.logo span` rules. The animation is turned off for visitors who have reduced motion enabled.
- **Window light:** every so often, a soft patch of afternoon window light drifts across the background (`app/window-light.tsx`, styled under `.window-light` in `app/globals.css`). The first one appears 10–20s after the page loads, then one every 45–120s at random. Each lasts 10–14s. It pauses while the tab is hidden and is off for visitors who have reduced motion enabled. Open [http://localhost:3000/?light](http://localhost:3000/?light) to see it right away, repeating every few seconds.

## Deploy

Push to GitHub and import the repository in [Vercel](https://vercel.com/new). Vercel detects Next.js automatically, so no settings are needed. To deploy straight from this folder instead:

```bash
npx vercel --prod
```

### Analytics

The site uses [Vercel Web Analytics](https://vercel.com/docs/analytics) (`<Analytics />` in `app/layout.tsx`). To start collecting visits, open the project in Vercel, go to the **Analytics** tab and click **Enable**; data appears after the next deploy. Nothing is tracked when running locally.
