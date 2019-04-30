const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
const io = require('socket.io')();

// Define middleware here
// server.listen(80)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/GoogleBooks");

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './client/build/index.html'));
// });

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
var currentState = {};
var clientCount = 0;
io.on('connection', (client) => {
  client.on('connected', (playerName) => {
    if(Object.entries(currentState).length === 0 && currentState.constructor === Object){
      console.log('First Player')
      // client.broadcast.emit('stateChange', currentState);
    }
    else {
      console.log('New Player')
      console.log(currentState.setPlayers );
      currentState.playerName = playerName;
      io.emit('playerAdded', (currentState));
    }
  });
  client.on('setPlayer', (newState ) => {
    currentState = newState;
  });

  client.on('newState', (myState) => {
    client.broadcast.emit('stateChange', myState)
  });
  client.on("disconnect", () => {
    clientCount--;
    console.log("user disconnected");
  }) ;
});

const port = 8000;
io.listen(port);
console.log('Socket listening on port ', PORT);