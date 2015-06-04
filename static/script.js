$(document).ready(function(){
    		//this triggers the connection event in our server
    		var socket = io.connect();
    		//we'll write all the socket stuff after the above line
            var user = prompt("What is your name?");
        
    		socket.emit("new_user", {name: user});
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
    			var new_message = user + ": " + $("input").val();
    			socket.emit("message_submit", {message: new_message})
                $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);
    		})
    		socket.on('new_message', function(data){
    			$('#chat_box').append("<p class='new_message'>" + data.message + "</p>");
                  $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);

    		})
    		socket.on('user_disconnected', function(data){
    			$('#chat_box').append("<p class='user_disconnected'>" + data.message + "</p>");
                $('#chat_box').scrollTop($('#chat_box')[0].scrollHeight);
    		})

    	})

    $(function () {
    $("#myform").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "send.php",
            data: $(this).serialize(),
            success: function (response) {
                if (response == "done") {
                    alert("Form submitted successfully!");
                } else {
                    alert("Form submission failed!");
                }
            },
            error: function(response){

            }
        });
    });

});
