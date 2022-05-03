import React from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  AppBar,
  Chip,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavMenu: null,
      userMenu: null,
    };
  }

  handleOpenNavMenu = (event) => {
    this.setState({ mobileNavMenu: event.currentTarget });
  };

  handleOpenUserMenu = (event) => {
    this.setState({ userMenu: event.currentTarget });
  };

  handleCloseNavMenu = () => {
    this.setState({ mobileNavMenu: null });
  };

  handleCloseUserMenu = () => {
    this.setState({ userMenu: null });
  };

  //   componentDidMount() {
  //     try {
  //       const jwt = localStorage.getItem("token");
  //       const user = jwtDecode(jwt);
  //       this.setState({ user });
  //     } catch (ex) {}
  //   }
  render() {
    var pages = this.props.user
      ? [
          { name: "Dashboard", route: "/dashboard" },
          { name: "Search", route: "/search" },
          { name: "Network", route: "/network" },
        ]
      : [
          // { name: "Products", route: "/products" },
          // { name: "How It Works", route: "/howitworks" },
          // { name: "Blog", route: "/blog" },
        ];
    var settings = [
      { name: "Account", route: "/account" },
      { name: "Logout", route: "/logout" },
    ];
    return (
      <AppBar
        position="static"
        style={{
          background:
            "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
          boxShadow: "rgb(0 0 0 / 5%) 0rem 1.25rem 1.6875rem 0rem",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <MenuItem
              style={{ color: "#white" }}
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
              component={Link}
              to="/home"
            >
              UTME Trading
            </MenuItem>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.mobileNavMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(this.state.mobileNavMenu)}
                onClose={this.handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={this.handleCloseNavMenu}
                    component={Link}
                    to={page.route}
                    style={{ color: "#white" }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <MenuItem
              component={Link}
              to="/home"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              UTME Trading
            </MenuItem>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  component={Link}
                  to={page.route}
                  key={page.name}
                  onClick={this.handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                  style={{ color: "white" }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {this.props.user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                    <Chip
                      label={this.props.user.first_name}
                      sx={{ mx: 2 }}
                      style={{ backgroundColor: "#EADBD2" }}
                    />
                    <Avatar
                      alt="Remy Sharp"
                      src="https://images.unsplash.com/photo-1531354755998-195b9eca7061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={this.state.userMenu}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(this.state.userMenu)}
                  onClose={this.handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={this.handleCloseNavMenu}
                      to={setting.route}
                      component={Link}
                      style={{ color: "#184273" }}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
            {!this.props.user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Log in">
                  <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                    <Chip
                      label="Log in"
                      // variant="outlined"
                      sx={{ mx: 1 }}
                      style={{ backgroundColor: "#EADBD2" }}
                      component={Link}
                      to="/login"
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sign up">
                  <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                    <Chip
                      label="Sign up"
                      // variant="outlined"
                      sx={{ mx: 1 }}
                      style={{ backgroundColor: "#EADBD2" }}
                      component={Link}
                      to="/signup"
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export default NavBar;
