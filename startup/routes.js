const express = require("express");
const users = require("../routes/users");
const transactions = require("../routes/transactions");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/users", users);
  app.use("/transactions", transactions);
  app.use(error);
};
