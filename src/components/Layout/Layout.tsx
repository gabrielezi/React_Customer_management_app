import React from "react";
import Button from "@mui/material/Button";
import {
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Input,
  Paper,
  IconButton,
  CssBaseline,
  AppBar,
} from "@material-ui/core";

// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";

import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import { backgroundTheme } from "./Themes";
import Grid from "@mui/material/Grid";

import { RegistrationDialog } from "../RegistrationDialog";
import useLocalStorageForArrays from "../../hooks/useLocalStorageForArrays";
import { getCoordinatesHttpRequest } from "../../services/GeocodingService";
import { Customer } from "../../models/Customer";
import { createNewGuid } from "../../services/UtilityService";

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
  toolbar: {
    paddingRight: 24,
    backgroundColor: "#aac0e3",
  },
  title: {
    flexGrow: 1,
    fontSize: 36,
    fontFamily: "Corbel",
  },
  body: {
    height: "100%",
  },
  titleIcon: {
    transform: "scale(1.6)",
    marginRight: theme.spacing(2),
  },
}));

export const Layout = () => {
  const classes = useStyles();

  const {
    data: customerList,
    addNewValue: addCustomerToList,
    deleteValueById: deleteFromCustomerList,
    editValue: editValueInCustomerList,
    setData: setEditableCustomerList,
    revertList: revertCustomerList,
  } = useLocalStorageForArrays<Customer>("customer");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  const addCustomer = (
    fullName: string,
    email: string,
    city: string,
    street: string,
    houseNumber: string,
    zipCode: string
  ) => {
    // the Geocoder does not recognize word "gatve" but works fine with "g."
    const modifiedStreet = street.replace("gatve", "g.").replace("gatvė", "g.");
    const address =
      modifiedStreet + " " + houseNumber + "," + city + " " + zipCode;

    getCoordinatesHttpRequest(address).then((x) => {
      const newCustomer: Customer = {
        id: createNewGuid(),
        fullName: fullName,
        email: email,
        city: city,
        street: street,
        houseNumber: houseNumber,
        zipCode: zipCode,
        latitude: x["data"][0]["latitude"],
        longitude: x["data"][0]["longitude"],
        isEditMode: false,
      };

      addCustomerToList(newCustomer);

      setOpenDialog(false);
    });
  };

  const onToggleEditMode = (row: any) => {
    setSelectedCustomer(row);
  };

  const onEditModeDone = (row: any) => {
    const address =
      row.street + " " + row.houseNumber + "," + row.city + " " + row.zipCode;
    getCoordinatesHttpRequest(address).then((x) => {
      row.latitude = x["data"][0]["latitude"];
      row.longitude = x["data"][0]["longitude"];

      editValueInCustomerList(row);
      setSelectedCustomer(null);
    });
  };

  const onChange = (e, row) => {
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newdata = customerList?.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setEditableCustomerList(newdata);
    setSelectedCustomer(row);
  };

  const onRevert = (id) => {
    revertCustomerList();
    setSelectedCustomer(null);
  };

  const deleteCustomer = (id) => {
    deleteFromCustomerList(id);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const CustomTableCell = ({ row, name, onChange }: any) => {
    return (
      <TableCell align="center" className={classes.tableCell}>
        {selectedCustomer?.id === row.id ? (
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
                  Customer Management App
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12} className={classes.grid}>
            <Button
              variant="contained"
              onClick={handleClickOpen}
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
            handleDialogState={setOpenDialog}
            addCustomer={addCustomer}
          />
          <Grid item xs={12} className={classes.grid}>
            <div className={classes.body}>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  {customerList.length === 0 ? (
                    <caption>- Customer list is empty -</caption>
                  ) : (
                    <caption>- Current Customer list -</caption>
                  )}
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
                    {customerList?.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className={classes.selectTableCell}>
                          {selectedCustomer?.id === row.id ? (
                            <>
                              <IconButton
                                aria-label="done"
                                color="secondary"
                                onClick={() => onEditModeDone(row)}
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
                              onClick={() => onToggleEditMode(row)}
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
      </div>
    </MuiThemeProvider>
  );
};
