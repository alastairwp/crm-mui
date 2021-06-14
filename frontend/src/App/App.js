import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Menu } from "antd";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import "antd/dist/antd.css";
import "../App/App.css";
import { UserAddOutlined } from "@ant-design/icons";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import {
  makeStyles,
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import Header from "../components/Header";
import Contacts from "../pages/contacts";
import NewContact from "../pages/newContact";
import EditContact from "../pages/editContact";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const useStyles = makeStyles({
  appOpen: {
    paddingLeft: "0px",
    width: "100%",
  },
  appClosed: {
    paddingLeft: "256px",
    width: "100%",
  },
});

const theme = createMuiTheme({
  appMain: {
    paddingLeft: "320px",
    width: "100%",
  },
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

function DrawerMenu(props) {
  const [visible, setVisible] = useState(false);
  const classes = useStyles();

  const showDrawerMenu = () => {
    visible ? setVisible(false) : setVisible(true);
  };
  const { brokenLayout } = props;

  useEffect(() => {
    if (brokenLayout) {
      setVisible(false);
    }
  }, [brokenLayout]);

  return (
    <Fragment>
      <Drawer
        level={null}
        placement="left"
        open={visible}
        onClick={showDrawerMenu}
      >
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <UserAddOutlined />
                <span>Navigation One</span>
              </span>
            }
          >
            <MenuItemGroup key="g1" title="Contact Management">
              <Menu.Item key="1">
                <Link to={"/person/all"} onClick={showDrawerMenu}>
                  All Contacts
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={"/person/new"} onClick={showDrawerMenu}>
                  New
                </Link>
              </Menu.Item>
            </MenuItemGroup>
          </SubMenu>
        </Menu>
      </Drawer>
      <ThemeProvider theme={theme}>
        <div className={visible ? classes.appClosed : classes.appOpen}>
          <Header />

          <Switch>
            <Route
              path="/person/all"
              render={(props) => (
                <Contacts
                  {...props}
                  title="All Contacts"
                  subTitle=""
                  mode="new"
                />
              )}
            ></Route>
            <Route
              path="/person/edit/:id"
              render={(props) => (
                <EditContact
                  {...props}
                  title="Edit Employee"
                  subTitle="Update the contact details and click Update"
                  mode="edit"
                />
              )}
            ></Route>
            <Route
              path="/person/new"
              render={(props) => (
                <NewContact
                  {...props}
                  history={props.history}
                  title="Create Contact"
                  subTitle=""
                  mode="new"
                />
              )}
            ></Route>
            <Redirect from="/" to="/person/all" />
            <Redirect to="/notfound" />
          </Switch>
        </div>
        <CssBaseline />
      </ThemeProvider>
    </Fragment>
  );
}

export default function App() {
  let history = useHistory();
  useHotkeys("ctrl+n", () => history.push("/person/new"));
  useHotkeys("ctrl+h", () => history.push("/person/all"));
  const [brokenLayout, setBrokenLayout] = useState(false);

  const responsiveHandler = (mql) => {
    const matches = mql.matches;
    setBrokenLayout(matches);
  };

  useEffect(() => {
    let mql = matchMedia(`(max-width: 768px)`);
    responsiveHandler(mql);
  }, []);

  return <DrawerMenu brokenLayout={brokenLayout} />;
}
