"use client";
import { ChildrenParams } from "@/types/common";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import GlobalStyles from "./globalStyles";
import { CssBaseline } from "@mui/material";
import palette from "./palette";
import componentsOverride from "./overrides";

export default function ThemeProvider({ children }: ChildrenParams) {
  const theme = createTheme({
    palette: palette("light"),
  });
  theme.components = componentsOverride(theme);
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </MUIThemeProvider>
  );
}
