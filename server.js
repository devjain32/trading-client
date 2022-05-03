// dependencies
var express = require("express");
var mongoose = require("mongoose");
var winston = require("winston");
var bodyParser = require("body-parser");

// express and body parser
var app = express();

// routes
require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

// port
const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
