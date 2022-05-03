import React from "react";
import Joi from "joi-browser";
import AppInput from "./AppInput";
import { Button } from "@mui/material";

class Form extends React.Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      // <button disabled={this.validate()} className="btn btn-primary">
      //   {label}
      // </button>
      <Button
        variant="outlined"
        disabled={this.validate() === null ? false : true}
        style={{ margin: 10, marginLeft: 100 }}
        type="submit"
      >
        {label}
      </Button>
    );
  }

  renderInput(name, label, type = "text") {
    return (
      <div>
        <AppInput
          name={name}
          value={this.state.data[name]}
          label={label}
          onChange={this.handleChange}
          error={this.state.errors[name]}
          type={type}
        />
      </div>
    );
  }
}

export default Form;
