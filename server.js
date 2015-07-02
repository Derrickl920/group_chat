var express = require("express");
var path = require("path");
var app = express();
var messages = [];
var users = {};

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
 res.render("index");
})


var server = app.listen(process.env.PORT || 8000, function() {
 console.log("listening on port 8000");
})
var io = require('socket.io').listen(server)


io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);

	socket.on("new_user", function(data){
	  	users[socket.id] = data.name;
	  	socket.emit('intial_messages',{messages: messages});
	  	var new_message = data.name + " has joined the chat!";
	  	messages.push(new_message);
	  	console.log(messages);
      socket.emit('show_chatbox', users[socket.id]);
	  	socket.broadcast.emit('user_connected', {message: new_message});
	  })
  socket.on('message_submit', function(data){
  		messages.push(data.message);
  		io.emit('new_message', {message: data.message});
  })
  socket.on('disconnect', function(){
  	var new_message = users[socket.id] + ' has left the chat!';
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
