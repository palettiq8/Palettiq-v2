import type { DownloadablePalette } from "@/lib/types";

const WIDTH = 1200;
const HEIGHT = 1800;

function normalizeHex(hex: string) {
  const value = hex.replace("#", "");

  if (value.length === 3) {
    return `#${value
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }

  return `#${value}`;
}

function getLuminance(hex: string) {
  const normalized = normalizeHex(hex);

  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(normalized.slice(index, index + 2), 16) / 255;

    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getContrastText(hex: string) {
  return getLuminance(hex) > 0.179 ? "#151525" : "#FFFFFF";
}

function lightenColor(hex: string, amount: number) {
  const normalized = normalizeHex(hex);

  const channels = [1, 3, 5].map((index) =>
    parseInt(normalized.slice(index, index + 2), 16),
  );

  const result = channels.map((channel) =>
    Math.round(channel + (255 - channel) * amount)
      .toString(16)
      .padStart(2, "0"),
  );

  return `#${result.join("")}`;
}

function getPaletteData(palette: DownloadablePalette) {
  const name = palette.identity?.name?.trim() || "Untitled Palette";

  const tagline = palette.identity?.tagline?.trim() || "";

  const colors = palette.colors
    .map((color) => color.hex?.trim())
    .filter((hex): hex is string => Boolean(hex))
    .map(normalizeHex);

  if (!colors.length) {
    throw new Error("This palette has no colors to download.");
  }

  for (const color of colors) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) {
      throw new Error(`Invalid color value: ${color}`);
    }
  }

  // Darkest color first, lightest color last.
  colors.sort((a, b) => getLuminance(a) - getLuminance(b));

  const background = colors[colors.length - 1];

  return {
    name,
    tagline,
    colors,
    background,
    backgroundText: getContrastText(background),
  };
}

function createFileName(name: string, extension: "png" | "svg") {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "palette"}.${extension}`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createSvg(
  name: string,
  tagline: string,
  colors: string[],
  background: string,
) {
  const backgroundText = getContrastText(background);

  const safeName = escapeXml(name);
  const safeTagline = escapeXml(tagline);

  const cardX = 180;
  const cardY = 230;
  const cardWidth = 840;
  const cardHeight = 1040;

  const rowHeight = cardHeight / colors.length;

  const swatches = colors
    .map((color, index) => {
      const y = cardY + index * rowHeight;
      const textColor = getContrastText(color);

      return `
        <rect
          x="${cardX}"
          y="${y}"
          width="${cardWidth}"
          height="${rowHeight + 1}"
          fill="${color}"
        />

        <text
          x="${cardX + 135}"
          y="${y + rowHeight / 2 + 12}"
          fill="${textColor}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="34"
          font-weight="700"
          letter-spacing="0.5"
        >${color.toUpperCase()}</text>
      `;
    })
    .join("");

  const titleLength =
    name.length > 25 ? 'textLength="900" lengthAdjust="spacingAndGlyphs"' : "";

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${WIDTH}"
      height="${HEIGHT}"
      viewBox="0 0 ${WIDTH} ${HEIGHT}"
    >
      <defs>
        <linearGradient
          id="background"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="${background}"
          />
          <stop
            offset="100%"
            stop-color="${lightenColor(background, 0.22)}"
          />
        </linearGradient>

        <clipPath id="paletteClip">
          <rect
            x="${cardX}"
            y="${cardY}"
            width="${cardWidth}"
            height="${cardHeight}"
            rx="36"
          />
        </clipPath>

        <filter
          id="shadow"
          x="-20%"
          y="-10%"
          width="140%"
          height="130%"
        >
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="24"
            flood-color="#000000"
            flood-opacity="0.12"
          />
        </filter>
      </defs>

      <!-- Background -->
      <rect
        width="${WIDTH}"
        height="${HEIGHT}"
        fill="url(#background)"
      />

      <!-- Top heading -->
      <text
        x="600"
        y="145"
        text-anchor="middle"
        fill="${backgroundText}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="46"
        font-weight="800"
        letter-spacing="13"
      >PALETTE</text>

      <!-- Palette shadow -->
      <rect
        x="${cardX}"
        y="${cardY}"
        width="${cardWidth}"
        height="${cardHeight}"
        rx="36"
        fill="#000000"
        opacity="0.08"
        filter="url(#shadow)"
      />

      <!-- Vertical color stack: darkest to lightest -->
      <g clip-path="url(#paletteClip)">
        ${swatches}
      </g>

      <!-- Subtle gray palette border -->
      <rect
        x="${cardX}"
        y="${cardY}"
        width="${cardWidth}"
        height="${cardHeight}"
        rx="36"
        fill="none"
        stroke="#A3A3A3"
        stroke-opacity="0.35"
        stroke-width="2"
      />

      <!-- Palette name -->
      <text
        x="600"
        y="1455"
        text-anchor="middle"
        fill="${backgroundText}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="58"
        font-weight="800"
        ${titleLength}
      >${safeName}</text>

      <!-- Actual palette tagline -->
      ${
        safeTagline
          ? `
            <text
              x="600"
              y="1545"
              text-anchor="middle"
              fill="${backgroundText}"
              fill-opacity="0.85"
              font-family="Arial, Helvetica, sans-serif"
              font-size="25"
            >${safeTagline}</text>
          `
          : ""
      }

      <!-- Branding -->
      <text
        x="600"
        y="1680"
        text-anchor="middle"
        fill="${backgroundText}"
        fill-opacity="0.65"
        font-family="Arial, Helvetica, sans-serif"
        font-size="18"
        font-weight="700"
        letter-spacing="4"
      >PALETTIQ.NET</text>
    </svg>
  `;
}

export function downloadPaletteAsSvg(palette: DownloadablePalette) {
  const { name, tagline, colors, background } = getPaletteData(palette);

  const svg = createSvg(name, tagline, colors, background);

  const blob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });

  downloadBlob(blob, createFileName(name, "svg"));
}

export async function downloadPaletteAsPng(palette: DownloadablePalette) {
  const { name, tagline, colors, background } = getPaletteData(palette);

  const svg = createSvg(name, tagline, colors, background);

  const svgBlob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();
    image.src = url;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();

      image.onerror = () => {
        reject(new Error("Failed to render the palette image."));
      };
    });

    const canvas = document.createElement("canvas");

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create the palette image.");
    }

    context.drawImage(image, 0, 0, WIDTH, HEIGHT);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to generate the PNG image."));
        }
      }, "image/png");
    });

    downloadBlob(blob, createFileName(name, "png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}
