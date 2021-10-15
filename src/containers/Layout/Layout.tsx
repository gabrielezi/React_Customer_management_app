import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
} from "@material-ui/core";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";

import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import { backgroundTheme } from "./Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@mui/material/Grid";

import { RegistrationDialog } from "../../components/RegistrationDialog/RegistrationDialog";
import AppBar from "@material-ui/core/AppBar";

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
    backgroundColor: "#fffff",
  },
  // button: {
  //   color: "#0000",
  //   marginLeft: theme.spacing(2),
  // },
  toolbar: {
    paddingRight: 24,
    backgroundColor: "#aac0e3",
  },
  title: {
    // backgroundColor: "#0000",
    flexGrow: 1,
    fontSize: 36,
    fontFamily: "Corbel",
    // textDecoration: "underline",
  },
  body: {
    height: "100%",
  },
  titleIcon: {
    transform: "scale(1.6)",
    marginRight: theme.spacing(2),
  },
}));

const createData = (
  fullName: any,
  email: any,
  city: any,
  street: any,
  houseNumber: any,
  zipCode: any,
  latitude: any,
  longitude: any
) => ({
  id: fullName.replace(" ", "_"),
  fullName,
  email,
  city,
  street,
  houseNumber,
  zipCode,
  latitude,
  longitude,
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
  const { requestData, sendRequest, loading } = useGeocoding(
    getCoordinatesHttpRequest
  );

  const [latitude, setLatitude] = React.useState<number>(0);
  const [longitude, setLongitude] = React.useState<number>(0);
  const [dataEntered, setDataEntered] = React.useState<boolean>(false);
  const [previous, setPrevious] = React.useState({});

  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    if (!loading && dataEntered) {
      if (requestData !== null) {
        setLatitude(requestData["data"][0]["latitude"]);
        setLongitude(requestData["data"][0]["longitude"]);
      }

      const newData = createData(
        fullName,
        email,
        city,
        street,
        houseNumber,
        zipCode,
        latitude,
        longitude
      );

      if (data === undefined || data === null) {
        setData([newData]);
      } else {
        setData([...data, newData]);
      }
      setOpenDialog(false);
      setDataEntered(false);
    }
  }, [loading]);

  const addCustomer = (
    fullName: string,
    email: string,
    city: string,
    street: string,
    houseNumber: string,
    zipCode: string
  ) => {
    setFullName(fullName);
    setEmail(email);
    setCity(city);
    setStreet(street);
    setHouseNumber(houseNumber);
    setZipCode(zipCode);

    setDataEntered(true);
    const address = street + " " + houseNumber + "," + city;
    sendRequest(address);
  };

  const onToggleEditMode = (id: any) => {
    setData((state) => {
      return data.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        console.log(row);
        return row;
      });
    });
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

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const CustomTableCell = ({ row, name, onChange }: any) => {
    const { isEditMode } = row;
    return (
      <TableCell align="center" className={classes.tableCell}>
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
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <AppBar
              color="secondary"
              position="fixed"
              className={classes.toolbar}
            >
              <Toolbar>
                <PersonAddIcon className={classes.titleIcon} />
                <Typography
                  component="h1"
                  variant="h3"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  Customer Management
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12} className={classes.grid}>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              // className={classes.button}
              // color="primary"
              style={{
                borderRadius: 35,
                backgroundColor: "#f79d48",
                color: "#000000",
                marginTop: "5%",
              }}
            >
              <AddIcon></AddIcon>
              Add Customer
            </Button>
          </Grid>
          <RegistrationDialog
            open={openDialog}
            setData={setData}
            handleDialogState={setOpenDialog}
            addCustomer={addCustomer}
          />
          <Grid item xs={12} className={classes.grid}>
            <div className={classes.body}>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <caption>Current customer list</caption>
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell align="center" />
                      <TableCell align="center">Full name</TableCell>
                      <TableCell align="center">Email</TableCell>
                      <TableCell align="center">City</TableCell>
                      <TableCell align="center">Street</TableCell>
                      <TableCell align="center">House number</TableCell>
                      <TableCell align="center">Zip Code</TableCell>
                      <TableCell align="center">Latitude</TableCell>
                      <TableCell align="center">Longitude</TableCell>
                      <TableCell align="center" />
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
                                color="secondary"
                                onClick={() => onToggleEditMode(row.id)}
                              >
                                <DoneIcon />
                              </IconButton>
                              <IconButton
                                aria-label="revert"
                                color="secondary"
                                onClick={() => onRevert(row.id)}
                              >
                                <RevertIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              aria-label="delete"
                              color="secondary"
                              onClick={() => onToggleEditMode(row.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                        <CustomTableCell
                          {...{ row, name: "fullName", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "email", onChange }}
                        />
                        <CustomTableCell {...{ row, name: "city", onChange }} />
                        <CustomTableCell
                          {...{ row, name: "street", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "houseNumber", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "zipCode", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "latitude", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "longitude", onChange }}
                        />
                        <TableCell className={classes.selectTableCell}>
                          <IconButton
                            aria-label="delete"
                            color="secondary"
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
            </div>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </div>
    </MuiThemeProvider>
  );
};
