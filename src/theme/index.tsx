import { useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
// components
import { useSettingsContext } from "../components/settings";
//
import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import componentsOverride from "./overrides";
import customShadows from "./customShadows";
import GlobalStyles from "./globalStyles";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { themeMode, themeDirection } = useSettingsContext();

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette(themeMode),
      typography,
      shape: { borderRadius: 8 },
      direction: themeDirection,
      shadows: shadows(themeMode),
      customShadows: customShadows(themeMode),
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1600,
          xl: 2560,
        },
      },
    }),
    [themeDirection, themeMode]
  );

  const theme = createTheme(themeOptions);

  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </MUIThemeProvider>
  );
}
