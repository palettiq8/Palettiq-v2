import { normalizeHex } from "./color-utils";
import type {
  ColorRole,
  TemplateType,
  ThemeMode,
  VisualizerHistory,
  VisualizerSnapshot,
} from "./types";

export const DEFAULT_TEMPLATE: TemplateType = "website";
export const DEFAULT_THEME: ThemeMode = "light";

const MAX_HISTORY = 50;

export type VisualizerAction =
  | { type: "setRoleColor"; role: ColorRole; hex: string }
  | { type: "resetRole"; role: ColorRole }
  | { type: "resetAllOverrides" }
  | { type: "setTemplate"; template: TemplateType }
  | { type: "setTheme"; theme: ThemeMode }
  | { type: "resetToDefaults" }
  | { type: "undo" }
  | { type: "redo" };

export function createDefaultSnapshot(): VisualizerSnapshot {
  return {
    overrides: {},
    template: DEFAULT_TEMPLATE,
    theme: DEFAULT_THEME,
  };
}

export function createInitialHistory(): VisualizerHistory {
  return { past: [], present: createDefaultSnapshot(), future: [] };
}

function snapshotsEqual(a: VisualizerSnapshot, b: VisualizerSnapshot): boolean {
  if (a.template !== b.template || a.theme !== b.theme) return false;

  const aRoles = Object.keys(a.overrides) as ColorRole[];
  const bRoles = Object.keys(b.overrides) as ColorRole[];

  if (aRoles.length !== bRoles.length) return false;

  return aRoles.every((role) => a.overrides[role] === b.overrides[role]);
}

function commit(
  history: VisualizerHistory,
  next: VisualizerSnapshot,
): VisualizerHistory {
  if (snapshotsEqual(history.present, next)) return history;

  return {
    past: [...history.past, history.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  };
}

export function reducer(
  state: VisualizerHistory,
  action: VisualizerAction,
): VisualizerHistory {
  switch (action.type) {
    case "setRoleColor": {
      const hex = normalizeHex(action.hex);

      if (!hex) return state;

      return commit(state, {
        ...state.present,
        overrides: { ...state.present.overrides, [action.role]: hex },
      });
    }

    case "resetRole": {
      if (!(action.role in state.present.overrides)) return state;

      const overrides = { ...state.present.overrides };
      delete overrides[action.role];

      return commit(state, { ...state.present, overrides });
    }

    case "resetAllOverrides": {
      if (Object.keys(state.present.overrides).length === 0) return state;

      return commit(state, { ...state.present, overrides: {} });
    }

    case "setTemplate": {
      if (state.present.template === action.template) return state;

      return commit(state, { ...state.present, template: action.template });
    }

    case "setTheme": {
      if (state.present.theme === action.theme) return state;

      return commit(state, { ...state.present, theme: action.theme });
    }

    case "resetToDefaults": {
      return { past: [], present: createDefaultSnapshot(), future: [] };
    }

    case "undo": {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];

      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case "redo": {
      if (state.future.length === 0) return state;

      const next = state.future[0];

      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }

    default:
      return state;
  }
}
