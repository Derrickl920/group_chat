$(document).ready(function(){
    		var socket = io.connect();
            var user ='';
            $('#container').hide();

            $('#login_submit').click(function(){
                user= $('#login_name').val();
                if(user.length > 2){
                    socket.emit("new_user", {name: user});
                    event.preventDefault();
                    $('#login').hide();
                }
            })

            socket.on('show_chatbox', function(data){
                $('#container').fadeIn();
                $('body').scrollTop(10000);
            });
        
    		socket.on ('initial_messages', function(data){
    			for(message in data.messages) {
    				$('#chat_box').append("<p>" + data.messages[message] + "</p>");
    			}
    		})
    		socket.on('user_connected', function(data){
    			$('#chat_box').append("<p class='user_connected'>" + data.message + "</p>");
                $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);
    		})
    		$('#chat_submit').click(function(){
    			var new_message = user + ": " + $("#message").val();
    			socket.emit("message_submit", {message: new_message})
                $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);
    		})
    		socket.on('new_message', function(data){
                if(data.message == message){
                   $('#chat_box').append("<span style='font-weight:bold;'><p class='new_message'>" + data.message + "</p></span>");
                   console.log(data);
                }
                else{
                    $('#chat_box').append("<p class='new_message'>" + data.message + "</p>");
                    console.log(data);
                }
                  $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);

    		})
    		socket.on('user_disconnected', function(data){
    			$('#chat_box').append("<p class='user_disconnected'>" + data.message + "</p>");
                $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);
    		});

            $('#chat_submit').click(function(){
                event.preventDefault();
                if($('#message').val().length >= 1){
                    socket.emit('add_message', {name: name, message: $('#message').val()});
                    $('form')[0].reset();
                    $('#message').val('');
                }
            });

});