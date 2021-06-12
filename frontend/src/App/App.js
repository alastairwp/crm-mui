import React, { Fragment, Component } from "react";

import { Menu } from "antd";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import "antd/dist/antd.css";
import "../App/App.css";
import { UserAddOutlined } from "@ant-design/icons";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Header from "../components/Header";
import Contacts from "../pages/contacts";
import NewContact from "../pages/newContact";
import EditContact from "../pages/editContact";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class DrawerMenu extends Component {
  state = {
    visible: false,
    appMain: {
      paddingLeft: "320px",
      width: "100%",
    },
  };

  showDrawerMenu = () => {
    this.state.visible
      ? this.setState({ visible: false })
      : this.setState({ visible: true });
  };

  componentWillReceiveProps(props) {
    if (props.brokenLayout) {
      this.setState({ visible: false });
    }
  }

  render() {
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

    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Drawer
            level={null}
            placement="left"
            handleChild={false}
            open={this.state.visible}
            onClick={this.showDrawerMenu}
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
                    <Link to={"/person/all"}>All Contacts</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to={"/person/new"}>New</Link>
                  </Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu>
          </Drawer>
          <div className={this.state.appMain}>
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
                    history={this.props.history}
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
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default class App extends Component {
  profileFields = [
    { name: "firstName", label: "First name", type: "text" },
    { name: "lastName", label: "Last name", type: "text" },
    { name: "jobTitle", label: "Job title", type: "text" },
    { name: "role", label: "Role", type: "text" },
    { name: "organisation", label: "Organisation", type: "Text" },
    { name: "department", label: "Department", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phoneWork", label: "Phone (work)", type: "text" },
    { name: "phoneMobile", label: "Phone (mob)", type: "text" },
    { name: "location", label: "Location", type: "text" },
  ];

  state = {
    brokenLayout: false,
  };

  constructor(props) {
    super(props);

    this.mql = matchMedia(`(max-width: 768px)`);
  }

  responsiveHandler = (mql) => {
    const matches = mql.matches;

    this.setState({ brokenLayout: matches });
  };

  componentDidMount() {
    this.responsiveHandler(this.mql);
  }

  componentWillUnmount() {
    this.mql.removeListener(this.responsiveHandler);
  }

  render() {
    const { brokenLayout } = this.state;

    return <DrawerMenu brokenLayout={brokenLayout} />;
  }
}
