import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import { backgroundTheme } from "./Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@mui/material/Grid";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import useLocalStorage from "../../hooks/useLocalStorage";
import useGeocoding from "../../hooks/useGeocoding";

import { getCoordinatesHttpRequest } from "../../services/GeocodingService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    width: "100%",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
  tableHead: {
    backgroundColor: "#2f405c",
  },
}));

const createData = (
  fullName: any,
  email: any,
  city: any,
  street: any,
  houseNumber: any,
  zipCode: any
) => ({
  id: fullName.replace(" ", "_"),
  fullName,
  email,
  city,
  street,
  houseNumber,
  zipCode,
  isEditMode: false,
});

export const Layout = () => {
  const classes = useStyles();
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [street, setStreet] = React.useState<string>("");
  const [houseNumber, setHouseNumber] = React.useState<string>("");
  const [zipCode, setZipCode] = React.useState<string>("");

  const [data, setData] = useLocalStorage("customer");
  const { data1, sendRequest } = useGeocoding(getCoordinatesHttpRequest);
  // const [location, setLocation] = useGeocoding();

  const [previous, setPrevious] = React.useState({});

  const addCustomer = () => {
    const newData = createData(
      fullName,
      email,
      city,
      street,
      houseNumber,
      zipCode
    );

    if (data === undefined || data === null) {
      setData([newData]);
    } else {
      setData([...data, newData]);
    }
    setOpenDialog(false);
    const address = street + " " + houseNumber + "," + city;
    sendRequest(address);
    console.log(data1);
    // setLocation(city, street, houseNumber, zipCode);
    // console.log(location);
    // getCoordinates();
  };

  const onToggleEditMode = (id: any) => {
    console.log(data);
    setData((state) => {
      return data.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        console.log(row);
        return row;
      });
    });
    console.log(data);
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newdata = data.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setData(newdata);
  };

  const onRevert = (id) => {
    const newdata = data.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    console.log(newdata);
    console.log(previous);
    setData(newdata);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const deleteCustomer = (id) => {
    const newList = data.filter((item) => item.id !== id);
    setData(newList);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const CustomTableCell = ({ row, name, onChange }: any) => {
    const { isEditMode } = row;
    return (
      <TableCell align="left" className={classes.tableCell}>
        {isEditMode ? (
          <Input
            value={row[name]}
            name={name}
            onChange={(e) => onChange(e, row)}
            className={classes.input}
          />
        ) : (
          row[name]
        )}
      </TableCell>
    );
  };

  return (
    <MuiThemeProvider theme={backgroundTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.grid}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Add Customer
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
              <DialogTitle>Subscribe</DialogTitle>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  required
                  id="outlined-required"
                  label="Full Name"
                  name="fullName"
                  onChange={(event) => setFullName(event.target.value)}
                />
                <TextField
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="City"
                  onChange={(event) => setCity(event.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Street"
                  onChange={(event) => setStreet(event.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="House number"
                  onChange={(event) => setHouseNumber(event.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Zip Code"
                  onChange={(event) => setZipCode(event.target.value)}
                />
              </Box>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addCustomer}>Add</Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={12} className={classes.grid}>
            <Paper className={classes.paper}>
              <Table className={classes.table}>
                <caption>Current customer list</caption>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell align="left" />
                    <TableCell align="left">Full name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">City</TableCell>
                    <TableCell align="left">Street</TableCell>
                    <TableCell align="left">House number</TableCell>
                    <TableCell align="left">Zip Code</TableCell>
                    <TableCell align="left">Latitude</TableCell>
                    <TableCell align="left">Longitude</TableCell>
                    <TableCell align="left" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className={classes.selectTableCell}>
                        {row.isEditMode ? (
                          <>
                            <IconButton
                              aria-label="done"
                              onClick={() => onToggleEditMode(row.id)}
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="revert"
                              onClick={() => onRevert(row.id)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={() => onToggleEditMode(row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <CustomTableCell
                        {...{ row, name: "fullName", onChange }}
                      />
                      <CustomTableCell {...{ row, name: "email", onChange }} />
                      <CustomTableCell {...{ row, name: "city", onChange }} />
                      <CustomTableCell {...{ row, name: "street", onChange }} />
                      <CustomTableCell
                        {...{ row, name: "houseNumber", onChange }}
                      />
                      <CustomTableCell
                        {...{ row, name: "zipCode", onChange }}
                      />
                      <TableCell className={classes.selectTableCell}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteCustomer(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </div>
    </MuiThemeProvider>
  );
};
