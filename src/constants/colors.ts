// Primary brand colors
export const COLORS = {
  // Gradients
  PRIMARY_GRADIENT: {
    from: "rgba(21, 93, 252, 1)",
    to: "rgba(152, 16, 250, 1)",
  },
  SUCCESS_GRADIENT: {
    from: "rgba(0, 153, 102, 1)",
    to: "rgba(0, 166, 62, 1)",
  },
  DANGER_GRADIENT: {
    from: "rgba(212, 24, 61, 1)",
    to: "rgb(126, 9, 32)",
  },
  GREEN_GRADIENT: {
    from: "rgba(81, 162, 255, 1)",
    to: "rgba(194, 122, 255, 1)",
  },

  // Background colors
  BACKGROUND_DARK: "rgba(15, 23, 43, 1)",
  BACKGROUND_MODAL: "rgba(29, 41, 61, 0.5)",
  BACKGROUND_DARK_SEMI: "rgba(15, 23, 43, 0.5)",
  BACKGROUND_DARK_LIGHTER: "rgba(15, 23, 43, 0.8)",

  // Button colors
  BUTTON_SECONDARY_BG: "rgba(15, 23, 43, 0.5)",
  BUTTON_SECONDARY_BORDER: "rgba(49, 65, 88, 1)",
  BUTTON_DISABLED_BG: "rgba(100, 100, 100, 1)",
  BUTTON_DISABLED_BORDER: "rgba(80, 80, 80, 1)",

  // Text colors
  TEXT_PRIMARY: "rgba(255, 255, 255, 1)",
  TEXT_SECONDARY: "rgba(144, 161, 185, 1)",
  TEXT_TERTIARY: "rgba(202, 213, 226, 1)",

  // Status colors
  SUCCESS: "rgba(0, 166, 62, 1)",
  ERROR: "rgba(212, 24, 61, 1)",
  CRASH_RED: "rgba(230, 31, 31, 1)",
  CASHOUT_GREEN: "rgba(25, 221, 87, 1)",

  // Border colors
  BORDER_DEFAULT: "rgba(98, 116, 142, 1)",
  BORDER_ACCENT: "rgba(49, 65, 88, 1)",
  BORDER_SUCCESS: "rgba(0, 188, 125, 0.3)",

  // Overlay
  OVERLAY: "rgba(0, 0, 0, 0.5)",
};

export const getGradient = (from: string, to: string): string =>
  `linear-gradient(to right, ${from}, ${to})`;
