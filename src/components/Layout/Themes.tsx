import { createTheme } from "@material-ui/core/styles";

export const backgroundTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#5893df",
    },
    secondary: {
      main: "#65effc",
    },
    background: {
      default: "#192231",
      paper: "#24344d",
    },
  },
});
export const dialogTheme = createTheme({
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: "#cfe1fc",
      },
    },
  },
  palette: {
    secondary: {
      main: "#db4d40",
    },
    action: {
      hover: "#C594BD",
    },
    background: {
      default: "#192231",
    },
  },
});
