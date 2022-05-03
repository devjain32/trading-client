import React from "react";
import "./App.css";
import { Route, Routes, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Search from "./components/Search";
import Network from "./components/Network";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import Account from "./components/Account";

class App extends React.Component {
  state = {};
  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      this.setState({ user });
    } catch (ex) {}
  }
  render() {
    return (
      <>
        <NavBar user={this.state.user} />
        <main className="container">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/network" element={<Network />} />
            <Route
              path="/dashboard"
              element={<Dashboard user={this.state.user} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
