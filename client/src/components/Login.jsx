import React from "react";
import { Container, Box, Grid } from "@mui/material";
import Form from "./Form";
import Joi from "joi-browser";
import { login } from "../services/authService";

class Login extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data: JWT } = await login(
        this.state.data.email,
        this.state.data.password
      );
      localStorage.setItem("token", JWT);
      window.location = "/dashboard";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <Container
        maxWidth="xl"
        // style={{
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
      >
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
              {this.renderInput("email", "Email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Login")}
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Login;
