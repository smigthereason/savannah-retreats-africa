import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linen: "#F7F4F0", // primary bg — Bone Linen
        umber: "#3A322C", // secondary — Raw Umber / Roasted Coffee
        ochre: "#A3704C", // accent — Savanna Ochre
        acacia: "#5B6B4A", // secondary accent — Acacia Green
        sand: "#EDE6DB", // alt section bg
        ink: "#4A433D", // muted body text
      },
      fontFamily: {
        // display: ["var(--font-fraunces)", "serif"],
        // sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-raleway)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      maxWidth: {
        "8xl": "1480px",
      },
    },
  },
  plugins: [],
};

export default config;
