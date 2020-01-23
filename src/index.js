// Microservice Index
// The main file to run the service

// express related packages
const express = require("express");
// request parsing packages
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// import configurations
const config = require("./config/config");

// TODO: import and create logging objects
// NOTE: use winston express middleware to log all requests

// import error handling objects
const { handleError, ErrorHandler } = require("./library/error");

// initialize express app
let app = express();

// configure application
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser(config.sessionSecret));

// add session configurations
if (config.environment === "production") {
    app.set("trust proxy", 1);
}

// set the API routes of all supported version
require("./routes/v1")(app, config, ErrorHandler);

// set all other routes not available
app.use("*", (req, res) => {
    throw new ErrorHandler(404, "Page not found");
});

// custom error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});

// start the express server
const server = app.listen(config.port, () => {
    console.log("Running on port", config.port);
});

module.exports = server;