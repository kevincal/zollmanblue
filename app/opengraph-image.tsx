import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Zollman Blue — Vintage Home & Objects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The wordmark SVG on the site's cream background.
export default async function Image() {
  const svg = await readFile(join(process.cwd(), "public/zollman-blue.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f1e3",
        }}
      >
        <img src={logo} width={960} height={134} alt="" />
      </div>
    ),
    size,
  );
}
