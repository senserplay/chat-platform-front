import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    display: "flex",
  },
  variants: {
    visual: {
      navigation: {
        colorPalette: "pink",
        padding: "3px",
        borderRadius: "15px",
        borderColor: "colorPalette.500",
        cursor: "pointer",
        fontFamily: "heading",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "28px",
      },
    },
  },
});

const customConfig = defineConfig({
  globalCss: {
    body: {
      fontFamily: '"Montserrat", sans-serif',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          100: { value: "#db2777" },
        },
      },
      fonts: {
        heading: { value: '"Montserrat", sans-serif' },
        body: { value: '"Montserrat", sans-serif' },
      },
    },

    recipes: {
      button: buttonRecipe,
    },

    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "1152px",
      xl: "1350px",
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
