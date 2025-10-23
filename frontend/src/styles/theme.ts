export const theme = {
  colors: {
    primary: "#4A90E2",
    primaryDark: "#357ABD",
    secondary: "#7B68EE",
    success: "#50C878",
    warning: "#FFB347",
    error: "#FF6B6B",

    text: {
      primary: "#2C3E50",
      secondary: "#7F8C8D",
      light: "#BDC3C7",
      white: "#FFFFFF",
    },

    background: {
      main: "#FFFFFF",
      secondary: "#F8F9FA",
      dark: "#2C3E50",
      light: "#F5F7FA",
    },

    border: "#E1E8ED",
    shadow: "rgba(0, 0, 0, 0.1)",
  },

  typography: {
    fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "24px",
      xxl: "32px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.15)",
  },

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
};

export type Theme = typeof theme;
