import { Theme } from "@mui/material";
import List from "./List";

export default function componentsOverrides(theme: Theme) {
  return Object.assign(List(theme));
}
