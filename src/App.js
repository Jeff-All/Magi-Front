import React, { Component } from 'react';
import { 
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  NavDropdown,
  // Button,
} from 'react-bootstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.goTo.bind(this);
    this.handleNavClick.bind(this);
  }
  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  renewToken() {
    this.props.auth.renewToken();
  }

  handleNavClick(event) {
    switch(event) {
      case "Log-Out":
        this.props.auth.logout();
        break;
      case "Log-In":
        this.props.auth.login();
        break;
      default:
        this.goTo(event);
        break;
    }
  }

  renderMenuItems(isAuthenticated) {
    var navItems = [];

    if(isAuthenticated()) {
      navItems.push(
        <NavItem key="Upload" eventKey="Upload">Upload</NavItem>,
        <NavItem key="Print" eventKey="Print">Print</NavItem>,
        <NavItem key="Scan" eventKey="Scan">Scan</NavItem>,
        <NavItem key="Shopping" eventKey="Shopping">Shopping</NavItem>,
        // <NavItem key="Admin" eventKey="Admin">Admin</NavItem>,
        <NavDropdown id="Admin" key="Admin" title="Admin">
          <MenuItem id="Config" eventKey="Admin/Config">Config</MenuItem>
          <MenuItem id="Users" eventKey="Admin/Users">Users</MenuItem>
        </NavDropdown>,
        <NavItem key="Log-Out" eventKey="Log-Out">Log-Out</NavItem>
      );
    } else {
      navItems.push(
        <NavItem key="Log-In" eventKey="Log-In">Log-In</NavItem>
      );
    }

    return navItems;
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar
          fluid
          inverse
          collapseOnSelect
          onSelect={ event => { this.handleNavClick(event); }}
        >
          <Navbar.Header>
            <Navbar.Brand>
              {/* <NavItem key="Admin" eventKey="Admin">Magi</NavItem> */}
              {/* <Button onClick={this.goTo.bind(this, 'home')}>Magi</Button> */}
              <a onClick={this.goTo.bind(this, 'home')}>Magi</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.renderMenuItems.bind(this, isAuthenticated)()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default App;
