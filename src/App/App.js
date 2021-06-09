import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import SideMenu from "../components/SideMenu";
import {
  makeStyles,
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import Header from "../components/Header";
import Contacts from "../pages/contacts";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "320px",
    width: "100%",
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <SideMenu />
      <div className={classes.appMain}>
        <Header />
        <Switch>
          <Route
            path="/person/all"
            render={(props) => (
              <Contacts
                {...props}
                title="New Employee"
                subTitle="Enter the contact details and click Create"
                mode="new"
              />
            )}
          ></Route>
          <Route
            path="/person/edit/:id"
            render={(props) => (
              <Contacts
                {...props}
                title="Edit Employee"
                subTitle="Update the contact details and click Update"
                mode="edit"
              />
            )}
          ></Route>

          <Redirect from="/" to="/person/all" />
          <Redirect to="/notfound" />
        </Switch>
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
