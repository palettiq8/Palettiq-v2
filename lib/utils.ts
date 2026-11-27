import { converter, parse } from "culori";
import { Palette } from "./types";

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Recently";

  const diffInSeconds = (date.getTime() - Date.now()) / 1000;

  if (diffInSeconds > 0 || Math.abs(diffInSeconds) < 45) {
    return "Just now";
  }

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const units = [
    { unit: "year" as const, seconds: 31536000 },
    { unit: "month" as const, seconds: 2592000 },
    { unit: "week" as const, seconds: 604800 },
    { unit: "day" as const, seconds: 86400 },
    { unit: "hour" as const, seconds: 3600 },
    { unit: "minute" as const, seconds: 60 },
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return formatter.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return "Just now";
}

const toRgb = converter("rgb");

export function getContrastTextColor(hex: string) {
  const rgb = toRgb(parse(hex));

  if (!rgb) return "#FFFFFF";

  const luminance =
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b);

  return luminance > 0.179 ? "#111111" : "#FFFFFF";
}

function linearize(value: number) {
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

export function getShowcaseBackground(colors: Palette["colors"]) {
  const validColors = colors
    .map((color) => color.hex)
    .filter((hex): hex is string => Boolean(hex))
    .map((hex) => {
      const normalized = hex.replace("#", "");

      if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

      return [
        parseInt(normalized.slice(0, 2), 16),
        parseInt(normalized.slice(2, 4), 16),
        parseInt(normalized.slice(4, 6), 16),
      ];
    })
    .filter((rgb): rgb is number[] => rgb !== null);

  if (!validColors.length) return "#E8EAED";

  const average = [0, 1, 2].map(
    (channel) =>
      validColors.reduce((sum, rgb) => sum + rgb[channel], 0) /
      validColors.length,
  );

  // Blend the palette average with white for a soft background.
  const blended = average.map((value) => Math.round(value * 0.42 + 255 * 0.58));

  return `#${blended
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
