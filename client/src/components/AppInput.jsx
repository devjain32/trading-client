import React from "react";
import { FormControl, TextField } from "@mui/material";
// import AccountCircle from "@mui/icons-material/AccountCircle";

const AppInput = ({ name, label, error, onChange, value, type }) => {
  return (
    // <div className="form-group">
    //   <label htmlFor={name}>{label}</label>
    //   <input {...rest} id={name} name={name} className="form-control" />
    //   {error && <div className="alert alert-danger">{error}</div>}
    // </div>
    // <FormControl variant="standard">
    //   <InputLabel htmlFor="input-with-icon-adornment">Username</InputLabel>
    //   <Input
    //     id="input-with-icon-adornment"
    //     startAdornment={
    //       <InputAdornment position="start">
    //         <AccountCircle />
    //       </InputAdornment>
    //     }
    //   />
    // </FormControl>
    <FormControl>
      <TextField
        id={
          error
            ? "outlined-error-helper-text" + name
            : "outlined-required" + name
        }
        label={label}
        error={error ? true : false}
        helperText={error ? error : null}
        onChange={onChange}
        value={value}
        type={name}
        name={name}
        style={{ margin: 10, width: 280 }}
        autoComplete="off"
      />
    </FormControl>
  );
};

export default AppInput;
