// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})
var io = require('socket.io').listen(server)

var messages = [];
var users = {};

io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!

	  //handling the new_user event(listening)
	  socket.on("new_user", function(data){
	  	//keeping track of the user
	  	users[socket.id] = data.name;
	  	//emitting intial messages to the new user
	  	socket.emit('intial_messages',{messages: messages});
	  	//creating a message for everyone else
	  	var new_message = data.name + " has joined the chat!";
	  	messages.push(new_message);
	  	console.log(messages);
	  	//and broadcasting it
	  	socket.broadcast.emit('user_connected', {message: new_message});
	  })
  //handling the message submit event (listening)
  socket.on('message_submit', function(data){
  		messages.push(data.message);
  		//broadcasting the message to everyone
  		io.emit('new_message', {message: data.message});
  })
  //handling the disconnect
  socket.on('disconnect', function(){
  	var new_message = users[socket.id] + ' has left the chat!';
  	//broadcasting the user_disconnected event
  	socket.broadcast.emit('user_disconnected', {message: new_message});
  })

})
 



// 1. Serve up the view index.ejs and connect to sockets

// 2. Connect to sockets from view and recieve the connection event on the server side

// 3. Prompt for user name on the client-side and then EMIT "new_user" event to server with user's name

// 4. Server listens for "new_user" event -- save message with new user connect message

// 5. Server BROADCASTS "user_connected" event to all but one and sends along the message

// 6. Server keeps track of messages via array of strings

// On button click client EMITS "message_submit" to server with message text

// 7. Server listens for "message_submit" event -- save message with user to array of messages

// 8. Server BROADCASTS "new_message" event -- append message to chat
