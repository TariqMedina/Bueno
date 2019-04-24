const express = require("express");

const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB

//if deployed, use deployed database. Otherwise use the local mongoheadlines db
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoBueno";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(function() {
  console.log("connected to db");
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
