import { ColorRole } from "../constants";

interface PaletteColorInput {
  id: number;
  role: ColorRole | null;
}

const ROLE_WEIGHTS: Record<ColorRole, number> = {
  background: 40,
  primary: 25,
  secondary: 15,
  accent: 10,
  surface: 20,
  neutral: 15,
  text: 25,
  muted: 8,
  border: 5,
  success: 5,
  warning: 5,
  error: 5,
  info: 5,
};

const DEFAULT_WEIGHT = 10;

export function calculatePaletteUsage(
  colors: PaletteColorInput[],
): Record<number, number> {
  if (colors.length === 0) return {};

  const groups = new Map<string, PaletteColorInput[]>();

  for (const color of colors) {
    const role = color.role ?? "other";
    const group = groups.get(role) ?? [];

    group.push(color);
    groups.set(role, group);
  }

  const totalWeight = colors.reduce(
    (total, color) =>
      total +
      (color.role ? ROLE_WEIGHTS[color.role] : DEFAULT_WEIGHT) /
        groups.get(color.role ?? "other")!.length,
    0,
  );

  const allocations = colors.map((color, index) => {
    const role = color.role ?? "other";
    const group = groups.get(role)!;

    const roleWeight = color.role ? ROLE_WEIGHTS[color.role] : DEFAULT_WEIGHT;

    const exactPercentage = (roleWeight / group.length / totalWeight) * 100;

    const percentage = Math.floor(exactPercentage);

    return {
      id: color.id,
      index,
      percentage,
      remainder: exactPercentage - percentage,
    };
  });

  const assignedTotal = allocations.reduce(
    (total, item) => total + item.percentage,
    0,
  );

  const remainderOrder = [...allocations].sort(
    (a, b) => b.remainder - a.remainder || a.index - b.index,
  );

  for (let i = 0; i < 100 - assignedTotal; i++) {
    const target = remainderOrder[i];

    if (target) target.percentage += 1;
  }

  return Object.fromEntries(
    allocations.map(({ id, percentage }) => [id, percentage]),
  );
}
