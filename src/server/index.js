var app = require ('http').createServer();
var io = module.exports.io = require ('socket.io')(app);

const PORT = process.env || 3231;

const SocketManager = require ('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, ()=>{
    console.log("You are now connected to PORT " + PORT);
});