import * as React from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  Box,
  TextField,
  DialogActions,
  Button,
  MuiThemeProvider,
} from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { dialogTheme } from "../Layout/Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TopicDialogProps } from "./types";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  root: {
    m: 1,
    width: "25ch",
  },
  field: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  input: {
    borderRadius: 5,
    backgroundColor: "white",
  },
  dialogText: {
    textDecoration: "underline",
  },
  emptyFieldsText: {
    color: "#de2121",
  },
}));

export const RegistrationDialog = (
  props: TopicDialogProps
): React.ReactElement => {
  const { open, handleDialogState, addCustomer } = props;
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [street, setStreet] = React.useState<string>("");
  const [houseNumber, setHouseNumber] = React.useState<string>("");
  const [zipCode, setZipCode] = React.useState<string>("");

  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [emailErrorText, setEmailErrorText] = React.useState<string>("");
  const [zipCodeError, setZipCodeError] = React.useState<boolean>(false);
  const [zipCodeErrorText, setZipCodeErrorText] = React.useState<string>("");
  const [emptyFieldsError, setEmptyFieldsError] =
    React.useState<boolean>(false);

  const classes = useStyles();

  React.useEffect(() => {
    if (!open) {
      setFullName("");
      setEmail("");
      setCity("");
      setStreet("");
      setHouseNumber("");
      setZipCode("");
    }
  }, [open]);

  const handleDialogClose = (): void => {
    setEmailError(false);
    setZipCodeError(false);
    handleDialogState(false);
  };

  const handleCreateCustomer = () => {
    if (
      fullName === "" ||
      email === "" ||
      city === "" ||
      street === "" ||
      houseNumber === "" ||
      zipCode === ""
    ) {
      setEmptyFieldsError(true);
    } else {
      setEmptyFieldsError(false);
      handleDialogState(false);
      setEmailErrorText("");
      addCustomer(fullName, email, city, street, houseNumber, zipCode);
    }
  };

  const emailEntered = (value: string) => {
    if (validateEmail(value)) {
      setEmailError(false);
      setEmailErrorText("");
      setEmail(value);
    } else {
      setEmailError(true);
      setEmailErrorText("Wrong email format");
    }
  };

  const zipCodeEntered = (value: string) => {
    if (validateZipCode(value)) {
      setZipCodeError(false);
      setZipCodeErrorText("");
      setZipCode(value);
    } else {
      setZipCodeError(true);
      setZipCodeErrorText("Wrong zip-code format");
    }
  };

  function validateEmail(email: string) {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  function validateZipCode(zipCode: string) {
    const zipCodeRegex = /^\d{5}$|^\d{5}-\d{4}$/;
    return zipCodeRegex.test(zipCode);
  }

  return (
    <MuiThemeProvider theme={dialogTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle className={classes.dialogText}>
            Register a customer
          </DialogTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.grid}>
              <Box style={{ minHeight: "80px" }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Full Name"
                  name="fullName"
                  className={classes.field}
                  onChange={(event) => setFullName(event.target.value)}
                  InputProps={{
                    className: classes.input,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  error={emailError}
                  helperText={emailErrorText}
                  className={classes.field}
                  onChange={(event) => emailEntered(event.target.value)}
                  InputProps={{
                    className: classes.input,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <div className={classes.dialogText}>Address</div>
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                required
                id="outlined-required"
                label="City"
                className={classes.field}
                onChange={(event) => setCity(event.target.value)}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                id="outlined-required"
                label="Street"
                className={classes.field}
                onChange={(event) => setStreet(event.target.value)}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                required
                id="outlined-required"
                label="House number"
                className={classes.field}
                onChange={(event) => setHouseNumber(event.target.value)}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                id="outlined-required"
                label="Zip Code"
                className={classes.field}
                error={zipCodeError}
                helperText={zipCodeErrorText}
                onChange={(event) => zipCodeEntered(event.target.value)}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <div
              className={classes.emptyFieldsText}
              style={{ display: emptyFieldsError ? "block" : "none" }}
            >
              Some fields are still empty!
            </div>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleCreateCustomer} variant="outlined">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MuiThemeProvider>
  );
};
