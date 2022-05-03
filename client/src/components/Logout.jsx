import React from "react";

class Logout extends React.Component {
  componentDidMount() {
    localStorage.removeItem("token");
    window.location = "/home";
  }
  render() {
    return null;
  }
}

export default Logout;
