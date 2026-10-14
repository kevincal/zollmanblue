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
| `app/drawings.tsx` | The scrolling background drawings: which ones appear, in what order, and at what size and height |
| `app/window-light.tsx` | Timing for the occasional window-light effect |
| `public/drawings/` | The processed drawings: navy line art on transparent backgrounds |
| `scripts/process-drawings.py` | Converts the original scans into the files in `public/drawings/` |

## Design notes

- **Typeface:** Bodoni Moda, loaded with its optical-size axis so large text uses the high-contrast display cut.
- **Colors:** navy `#0A2749` on a warm off-white `#F2EFE9`. Both are CSS variables (`--navy`, `--bg`) at the top of `app/globals.css`.
- **Wordmark:** set tight with `letter-spacing: -0.045em`.
- **Cursor:** a thin navy line arrow, drawn as an inline SVG in the `--cursor` variable.
- **Hover:** each letter of the wordmark turns into a 0.5px navy outline. It pops in over 0.12s and fades back over 1.6s; change these in the `.logo span` rules. The animation is turned off for visitors who have reduced motion enabled.
- **Window light:** every so often, a soft patch of afternoon window light drifts across the background (`app/window-light.tsx`, styled under `.window-light` in `app/globals.css`). The first one appears 10–20s after the page loads, then one every 45–120s at random. Each lasts 10–14s. It pauses while the tab is hidden and is off for visitors who have reduced motion enabled. Open [http://localhost:3000/?light](http://localhost:3000/?light) to see it right away, repeating every few seconds.

- **Background drawings:** antique furniture plates, converted to navy line art, drift slowly upward behind everything at 4.5% opacity, like onion-skin paper, alternating left and right of center. One loop takes 5 minutes. The opacity and speed are set in the `.drawings` and `.drawings-track` rules in `app/globals.css`. The motion stops (the drawings stay visible) for visitors who have reduced motion enabled.

## Drawing credits

All plates are in the public domain or released under CC0, via Wikimedia Commons:

| File | Source |
| --- | --- |
| `01-chippendale-chairs-xiv` | Thomas Chippendale, [Chairs, No. XIV](https://commons.wikimedia.org/wiki/File:Print,_Chairs,_No._XIV,_1755_(CH_18282717).jpg), 1755 (Cooper Hewitt) |
| `02-ribband-back-chairs` | Thomas Chippendale, [Ribband Back Chairs](https://commons.wikimedia.org/wiki/File:Ribband_Back_Chairs_MET_DP800957.jpg) (The Met, CC0) |
| `03-hepplewhite-designs` | George Hepplewhite, [Designs of Furniture](https://commons.wikimedia.org/wiki/File:Designs_of_Furniture_From_Hepplewhite%27s_Guide.jpg), *The Cabinet-Maker and Upholsterer's Guide* |
| `04-french-commode` | Thomas Chippendale, [French Commode and Lamp Stands](https://commons.wikimedia.org/wiki/File:French_Commode_and_Lamp_Stands.jpg) |
| `05-sheraton-sofa-table` | Thomas Sheraton, [Sofa Table](https://commons.wikimedia.org/wiki/File:Sofa_Table_(Sheraton).jpg) |
| `06-sheraton-chair-backs` | Thomas Sheraton, [*The Cabinet-Maker and Upholsterer's Drawing-Book*](https://commons.wikimedia.org/wiki/File:The_Cabinet-Maker_and_Upholsterer%27s_Drawing-Book._In_Four_Parts_MET_DP223237.jpg), 1802 (The Met, CC0) |
| `07-director-construction` | Thomas Chippendale, [*The Gentleman and Cabinet-Maker's Director*](https://commons.wikimedia.org/wiki/File:The_gentleman_and_cabinet-maker%27s_director_Fleuron_T129806-18.png), 1754 |
| `08-director-chair` | Thomas Chippendale, [*The Gentleman and Cabinet-Maker's Director*](https://commons.wikimedia.org/wiki/File:The_gentleman_and_cabinet-maker%27s_director_Fleuron_T129806-26.png), 1754 |
| `09-darly-three-chairs` | Matthias Darly, [Three Chippendale chairs](https://commons.wikimedia.org/wiki/File:Three_Chippendale_chairs)_-_M._Darly_LCCN93515119.jpg), 1754 (Library of Congress) |

To regenerate the drawings, for example with different contrast or crops: download the originals from the links above, name them `1.img` to `9.img` in the order of the table, and run:

```bash
python3 -I scripts/process-drawings.py path/to/originals public/drawings
```

The script needs Python with Pillow and NumPy installed. Crops and the contrast curve are set at the top of the script.

## Deploy

Push to GitHub and import the repository in [Vercel](https://vercel.com/new). Vercel detects Next.js automatically, so no settings are needed. To deploy straight from this folder instead:

```bash
npx vercel --prod
```

### Analytics

The site uses [Vercel Web Analytics](https://vercel.com/docs/analytics) (`<Analytics />` in `app/layout.tsx`). To start collecting visits, open the project in Vercel, go to the **Analytics** tab and click **Enable**; data appears after the next deploy. Nothing is tracked when running locally.
