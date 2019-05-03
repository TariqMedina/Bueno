// var app = require('express')();
const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const routes = require('./routes');
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// Add routes, both API and view
app.use(routes);
// Start the API server
server.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
var currentState = {};
var clientCount = 0;
io.on('connection', client => {
  console.log('Client connected');
  client.on('connected', playerName => {
    if (
      Object.entries(currentState).length === 0 &&
      currentState.constructor === Object
    ) {
      console.log('First Player');
      // client.broadcast.emit('stateChange', currentState);
    } else {
      console.log('New Player');
      console.log(currentState.setPlayers);
      currentState.playerName = playerName;
      io.emit('playerAdded', currentState);
    }
  });
  client.on('setPlayer', newState => {
    currentState = newState;
  });

  client.on('newState', myState => {
    client.broadcast.emit('stateChange', myState);
  });
  client.on('disconnect', () => {
    clientCount--;
    client.emit('disconnected');
    console.log('user disconnected');
  });
});

// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log('Socket listening on port ', PORT);
