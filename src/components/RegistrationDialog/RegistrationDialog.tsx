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
import { dialogTheme } from "../../containers/Layout/Themes";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "8px",
  },
  formControl: {
    margin: theme.spacing(1),
    width: 160,
  },
  button: {
    backgroundColor: "#C594BD",
  },
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
}));

type CreateTopicDialogProps = {
  open: boolean;
  setData: (state: boolean) => void;
  handleDialogState: (state: boolean) => void;
  addCustomer: (
    fullName: string,
    email: string,
    city: string,
    street: string,
    houseNumber: string,
    zipCode: string
  ) => void;
};

export const RegistrationDialog = (
  props: CreateTopicDialogProps
): React.ReactElement => {
  const { open, setData, handleDialogState, addCustomer } = props;
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [street, setStreet] = React.useState<string>("");
  const [houseNumber, setHouseNumber] = React.useState<string>("");
  const [zipCode, setZipCode] = React.useState<string>("");

  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [emailErrorText, setEmailErrorText] = React.useState<string>("");

  const classes = useStyles();

  const handleDialogClose = (): void => {
    handleDialogState(false);
  };

  const handleCreateCustomer = () => {
    handleDialogState(false);
    addCustomer(fullName, email, city, street, houseNumber, zipCode);
  };

  const emailEntered = (value: string) => {
    setEmail(value);
    if (validateEmail(value)) {
      setEmailError(false);
      setEmailErrorText("");
    } else {
      setEmailError(true);
      setEmailErrorText("Wrong email format");
    }
  };

  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  return (
    <MuiThemeProvider theme={dialogTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle>Register a customer</DialogTitle>
          {/* <Box
          component="form"
          // sx={{
          //   "& .MuiTextField-root": { m: 1, width: "25ch" },
          // }}
          // noValidate
          // autoComplete="off"
          className={classes.grid}
        > */}
          {/* <div> */}
          <Grid container spacing={4}>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                required
                id="outlined-required"
                label="Full Name"
                name="fullName"
                className={classes.field}
                onChange={(event) => setFullName(event.target.value)}
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
              />
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <div>- - - - - Address - - - - -</div>
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                required
                id="outlined-required"
                label="City"
                className={classes.field}
                onChange={(event) => setCity(event.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Street"
                className={classes.field}
                onChange={(event) => setStreet(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                required
                id="outlined-required"
                label="House number"
                className={classes.field}
                onChange={(event) => setHouseNumber(event.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Zip Code"
                className={classes.field}
                onChange={(event) => setZipCode(event.target.value)}
              />
            </Grid>
          </Grid>
          {/* </div> */}
          {/* </Box> */}
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleCreateCustomer}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    </MuiThemeProvider>
  );
};
