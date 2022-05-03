import React from "react";
import { Container, Box, Grid } from "@mui/material";
import Form from "./Form";
import Joi from "joi-browser";
import { update } from "../services/authService";

class Account extends Form {
  state = {
    data: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    phone_number: Joi.string().required().label("Phone Number"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const response = await update(this.state.data);
      localStorage.removeItem("token");
      localStorage.setItem("token", response.headers["x-auth-token"]);
      window.location = "/account";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        if (ex.response.data === "both") {
          errors.email = "This email already exists";
          errors.phone_number = "This phone number already exists";
        } else if (ex.response.data === "email") {
          errors.email = "This email already exists";
        } else if (ex.response.data === "phone") {
          errors.phone_number = "This phone number already exists";
        }
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <Container maxWidth="xl">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          marginTop={10}
        >
          <Grid item xs={3} alignItems="center" justify="center">
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("first_name", "First Name")}
              {this.renderInput("last_name", "Last Name")}
              {this.renderInput("email", "Email")}
              {this.renderInput("phone_number", "Phone Number")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Update Account Info")}
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Account;
